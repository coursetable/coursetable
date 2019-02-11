const fs = require('fs');
const util = require('util');
const readline = require('readline');
const path = require('path');
const os = require('os');
const exec = util.promisify(require('child_process').exec);

/* eslint-disable no-await-in-loop */

// Get the Coursetable directory: should be the parent of the
// current directory
const coursetablePath = path.resolve(__dirname, '..');

async function execAndPrint(command) {
  console.log(`EXECUTING: ${command}`);
  await exec(command);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = prompt =>
  new Promise(resolve => {
    rl.question(prompt, input => {
      resolve(input);
    });
  });

const isWindows = process.platform === 'win32';
const defaults = isWindows
  ? {
      xamppPath: 'C:/xampp',
      httpdConfPath: 'apache/conf/httpd.conf',
      phpIniPath: 'php/php.ini',
      phpPath: 'php/php.exe',
      mysqlClientPath: 'mysql/bin/mysql.exe',
      downloadsPath: path.resolve(process.env.HOME, 'Downloads'),
    }
  : {
      xamppPath: '/Applications/XAMPP',
      httpdConfPath: 'xamppfiles/etc/httpd.conf',
      phpIniPath: 'xamppfiles/etc/php.ini',
      phpPath: 'php',
      mysqlClientPath: 'xamppfiles/bin/mysql',
      downloadsPath: path.resolve(process.env.HOME, 'Downloads'),
    };

async function run() {
  console.log('NOTE: you can run this script multiple times without any issues!');
  let xamppPath =
    (await question(
      `Where did you install XAMPP? (default: ${defaults.xamppPath}) `
    )) || defaults.xamppPath;

  while (!fs.existsSync(`${xamppPath}/${defaults.httpdConfPath}`)) {
    console.log(
      "The path doesn't seem to be right. We couldn't find httpd.conf at:"
    );
    console.log(`${xamppPath}/${defaults.httpdConfPath}`);
    console.log();

    xamppPath =
      (await question(
        `Try again: where did you install XAMPP? (default: ${
          defaults.xamppPath
        }) `
      )) || defaults.xamppPath;
  }

  console.log('================================================================');

  await replaceHttpdConf(xamppPath);
  await replacePhpIni(xamppPath);

  console.log();
  console.log("We've finished configuring XAMPP!");
  console.log("Next, we'll import the database");
  console.log(
    `1. Open the XAMPP Control Panel (in ${
      isWindows ? `${xamppPath}` : `${xamppPath}/manager-osx`
    }`
  );
  console.log('2. Click the Start button for Apache and MySQL');
  console.log();
  await question("Press Enter once you're ready");

  const mysqlClientPath = path.resolve(xamppPath, defaults.mysqlClientPath);
  const emptySqlPath = path.resolve(__dirname, 'empty.sql');
  const mysqlCommand = `${mysqlClientPath} -u root < ${emptySqlPath}`;

  while (!(await returnsSuccessfully(mysqlCommand))) {
    console.log(`We tried running "${mysqlCommand}", but it failed.`);
    console.log("MySQL doesn't seem started yet; try again");
    console.log();

    await question("Press Enter once you're ready");
  }

  console.log('================================================================');

  let coursetableSqlPath = '';
  const defaultCoursetableSqlPath = path.join(
    defaults.downloadsPath,
    'coursetable.sql'
  );

  while (!coursetableSqlPath || !fs.existsSync(coursetableSqlPath)) {
    console.log();
    console.log('Where did you download coursetable.sql to?');
    console.log(`(Default: ${defaultCoursetableSqlPath})`);

    coursetableSqlPath = (await question('')) || defaultCoursetableSqlPath;

    if (!fs.existsSync(coursetableSqlPath)) {
      console.log('We could not find coursetable.sql at:');
      console.log(coursetableSqlPath);
      console.log();
      console.log('Try again:');
    }
  }

  console.log('================================================================');
  console.log('Importing coursetable.sql into your MySQL database');
  console.log('This could take up to 30 seconds');
  await importCoursetableSql(mysqlClientPath, coursetableSqlPath);
  console.log('Done importing!');

  const phpPath = isWindows ? path.resolve(xamppPath, defaults.phpPath) : 'php';
  await buildPhp(phpPath);

  console.log('We\'re complete done!');
  console.log('Move onto the next step');

  process.exit();
}

async function returnsSuccessfully(command) {
  try {
    await exec(command);
    return true;
  } catch (err) {
    return false;
  }
}

/** Step 1: modify httpd.conf */
async function replaceHttpdConf(xamppPath) {
  const httpdPath = `${xamppPath}/${defaults.httpdConfPath}`;

  // 1. Replace DocumentRoot
  const origHttpd = fs.readFileSync(httpdPath, { encoding: 'utf8' });
  const ourDocumentRootLine = `DocumentRoot "${coursetablePath}/web"`;
  let modifiedHttpd = origHttpd.replace(
    /\s*DocumentRoot.*\s*<Directory[^>]*>/,
    ['', ourDocumentRootLine, `<Directory "${coursetablePath}/web">`].join(
      os.EOL
    )
  );

  const fileParts = modifiedHttpd.split('</Directory>');

  // 2. If a part with the relevant DocumentRoot doesn't have our
  // rewrite declaration, add it
  const rewriteEngineDirective = `
RewriteEngine On
# Change all requests without .php to .php
RewriteRule ^([\\d\\w]+)(/[\\d\\w/]+)?$ /$1\\.php$2 [L]
`.trim();
  for (let i = 0; i !== fileParts.length; i++) {
    const part = fileParts[i];
    if (
      part.indexOf(ourDocumentRootLine) !== -1 &&
      part.indexOf('/$1\\.php$2') === -1
    ) {
      fileParts[i] = part + os.EOL + rewriteEngineDirective;
    }
  }

  modifiedHttpd = fileParts.join('</Directory>');

  // Save as a backup the original
  const httpdBackupPath = `${httpdPath}.bak`;
  if (!fs.existsSync(httpdBackupPath)) {
    fs.writeFileSync(httpdBackupPath, origHttpd);
  }
  fs.writeFileSync(httpdPath, modifiedHttpd);
}

/** Step 2: modify php.ini to report fewer errors, use SQLite */
async function replacePhpIni(xamppPath) {
  const phpIniPath = `${xamppPath}/${defaults.phpIniPath}`;
  const origPhpIni = fs.readFileSync(phpIniPath, 'utf8');

  const modifiedPhpIni = origPhpIni
    .replace(
      /[^\s]*error_reporting=[^\r\n]*/,
      'error_reporting=E_ALL & ~E_DEPRECATED & ~E_STRICT & ~E_NOTICE & ~E_WARNING'
    )
    .replace(/;\s*extension=sqlite3/, 'extension=sqlite3'); // Windows only

  const phpIniBackupPath = `${phpIniPath}.bak`;
  if (!fs.existsSync(phpIniBackupPath)) {
    fs.writeFileSync(phpIniBackupPath, origPhpIni);
  }
  fs.writeFileSync(phpIniPath, modifiedPhpIni);
}

/** Step 3: execute the .sql file */
async function importCoursetableSql(mysqlPath, sqlFilePath) {
  const command = `${mysqlPath} -u root < ${sqlFilePath}`;
  await execAndPrint(command);
}

/** Step 4: copy config scripts and run PHP build scripts */
async function buildPhp(phpPath) {
  const composerPath = path.resolve(coursetablePath, 'composer.phar');
  const webLibsPath = path.resolve(coursetablePath, 'web/libs');
  console.log('Using Composer (PHP) to install PHP packages');
  await execAndPrint(`cd ${webLibsPath} && ${phpPath} ${composerPath} install`);
  await execAndPrint(`${phpPath} ${composerPath} install`);
  console.log('Done installing packages using Composer');

  const buildScriptPath = path.resolve(coursetablePath, 'web/tools/Build.php');
  const regenerateScriptPath = path.resolve(coursetablePath, 'crawler/RegenerateDataFiles.php');

  console.log('Running build script');
  await execAndPrint(`${phpPath} ${buildScriptPath}`);
  console.log('Done build script');
  console.log('Running regenerate data files script');
  await execAndPrint(`${phpPath} ${regenerateScriptPath}`);
  console.log('Done running regenerate data files script');
}

run().catch((err) => {
  console.error(err.stack);
  process.exit();
});
