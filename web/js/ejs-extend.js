import _ from 'lodash';
import moment from 'moment';
import $ from 'jquery';

EJS.Helpers.prototype.forEach = function(data, callback) {
  _.forEach(data, (value, key) => {
    callback(key, value);
  });
};

EJS.Helpers.prototype.moment = moment;

EJS.Helpers.prototype.include = function(file, data) {
  return new EJS({ url: '/templates/' + file }).render(data);
};

EJS.Helpers.prototype.round = function(num, digits) {
  const power = Math.pow(10, digits); // eslint-disable-line no-restricted-properties
  return Math.round(num * power) / power;
};

/**
 * Take an array of strings and sorts them by length
 */
EJS.Helpers.prototype.sortByLength = function(input, ascDesc) {
  const multiplier = ascDesc === 'asc' ? 1 : -1;

  // Get string lengths and associated indexes
  const lengths = [];
  for (let i = 0; i < input.length; i++) {
    lengths.push({ index: i, length: input[i].length });
  }

  // Sort indexes
  lengths.sort((a, b) => {
    return multiplier * (a.length - b.length);
  });

  // Assign new array based on indexes
  const result = [];
  for (let i = 0; i < lengths.length; i++) {
    result.push(input[lengths[i].index]);
  }

  return result;
};

const loadedTemplates = {};
const templatePath = '/templates';

/**
 * Load a Smarty template, along with specified dependencies listed in
 * names.
 * @param  mainTemplate  the root, parent template's name (parent.tpl)
 * @param  names      an array of all templates {include}'d
 * @param  done      callback that's passed the built EJS object
 */
export function loadTemplate(mainTemplate, names, done) {
  let doneRan = false;

  /**
   * Creates a function that creates a done function, encapsulating the name
   * in a new closure.
   */
  function doneFactory(name) {
    return function(data) {
      // Save the template
      const ejs = new EJS({ text: data, name: name });
      loadedTemplates[name] = ejs;

      // If all templates loaded, call "done"
      let allDone = true;
      for (let i = 0; i < names.length; i++) {
        const nameToCheck = names[i];
        if (!(nameToCheck in loadedTemplates)) {
          allDone = false;
        }
      }

      if (allDone && !doneRan) {
        doneRan = true;
        done(ejs);
      }
    };
  }

  for (let i = 0; i < names.length; i++) {
    const name = names[i];

    if (!(name in loadedTemplates)) {
      const url = templatePath + '/' + name;
      $.get(url, null, doneFactory(url), 'text');
    }
  }
}

export default { loadTemplate };
