export const flatten = (ob) => {
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if (typeof ob[i] == 'object' && ob[i] !== null && !Array.isArray(ob[i])) {
      var flatObject = flatten(ob[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        toReturn[i + '.' + x] = flatObject[x];
      }
    } else {
      toReturn[i] = ob[i];
    }
  }
  return toReturn;
};

export const isInWorksheet = (season_code, crn, worksheet) => {
  if (worksheet === null) return false;
  for (let i = 0; i < worksheet.length; i++) {
    if (worksheet[i][0] === season_code && worksheet[i][1] === crn) return true;
  }
  return false;
};

export const toSeasonString = (season_code) => {
  const seasons = ['', 'Spring', 'Summer', 'Fall'];
  return season_code.substring(0, 4) + ' ' + seasons[parseInt(season_code[5])];
};
