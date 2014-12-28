Meteor.methods({
  'upload': function(filename, data, semester, className, universityId) {
    var md5;
    md5 = writeFile(filename, data, semester, className, universityId);
    insertFile(filename, md5, semester, className, universityId);
  }
});

writeFile = function(filename, data, semester, className, universityId) {
  var buf, filePath, fn, fs, latestPath, md5, now;
  check(filename, String);
  check(data, Uint8Array);
  fs = Npm.require('fs');
  md5 = Meteor.npmRequire('MD5');
  if (process.cwd().indexOf('.meteor/local') > -1) {
    process.chdir('../../../..');
  }
  if (!fs.existsSync('./files')) {
    fs.mkdirSync('./files');
  }
  if (!fs.existsSync('./files/revisions')) {
    fs.mkdirSync('./files/revisions');
  }
  if (!fs.existsSync('./files/' + universityId)) {
    fs.mkdirSync('./files/' + universityId);
  }
  if (!fs.existsSync('./files/' + universityId + '/' + semester)) {
    fs.mkdirSync('./files/' + universityId + '/' + semester);
  }
  if (!fs.existsSync('./files/' + universityId + '/' + semester + '/' + className)) {
    fs.mkdirSync('./files/' + universityId + '/' + semester + '/' + className);
  }

  now = new Date();
  fn = filename;
  filePath = './files/' + universityId + '/' + semester + '/' + className + '/' + fn;
  fs.writeFileSync(filePath, new Buffer(data));
  buf = fs.readFileSync(filePath);
  md5 = md5(buf);
  return md5;
};

insertFile = function(filename, md5, semester, className, universityId) {
    var id;
    return id = Files.insert({
      filename: filename,
      md5: md5,
      uploader: "N/A",
      uploader_id: "N/A",
      timestamp: new Date(),
      semester: semester,
      universityId: universityId,
      className: className,
      season: semester.substr(0, semester.indexOf('2')),
      year: semester.substr(semester.indexOf('2'))
    });
  }
