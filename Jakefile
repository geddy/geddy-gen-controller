var fs = require('fs');
var path = require('path')
  , utilities = require('utilities')
  , geddyPath = path.normalize(path.join(require.resolve('geddy'), '../../'));

// Load the basic Geddy toolkit
require(path.join(geddyPath,'lib/geddy'));

// Dependencies
var cwd = process.cwd()
  , utils = require(path.join(geddyPath, 'lib/utils'))
  , Adapter = require(path.join(geddyPath, 'lib/template/adapters')).Adapter
  , genDirname = path.join(__dirname, '..');


function flagSet(shortName, name) {
  return process.argv.indexOf(shortName) !== -1 && process.argv.indexOf(name);
}

// Tasks
task('default', function(name) {
  var self = this;

  if (!name) {
    fail('Missing controller name.');
    return;
  }

  var appPath = process.cwd();
  var controllersDir = path.join(appPath, 'app', 'controllers');
  if (!fs.existsSync(controllersDir) || !fs.statSync(controllersDir).isDirectory()) {
    fail('You must run this generator from the root of your application.');
    return;
  }

  // sanitize the controller name
  var controllerFileName = name.toLowerCase().replace(/\s|-/g, '_');
  var controllerFilePath = path.join(controllersDir, controllerFileName + '.js');

  var force = flagSet('-f','--force');

  if (!force && fs.existsSync(controllerFilePath)) {
    fail('Controller already exists. Use -f to replace it.');
    return;
  }

  // create constructor name
  var constructorName = utilities.string.capitalize(utilities.string.camelize(controllerFileName));

  var contents = fs.readFileSync(path.join(__dirname, 'template', 'controller.js.ejs'),{encoding:'utf8'});
  var adapter = new Adapter({engine: 'ejs', template: contents});

  fs.writeFileSync(
    controllerFilePath,
    adapter.render({
      controllersDir: controllersDir,
      controllerFilePath: controllerFilePath,
      constructorName: constructorName,
      controllerFileName: controllerFileName
    }),
    'utf8'
  );

  console.log('Created controller "' + constructorName + '" in app/controllers/' + controllerFileName + '.js');
});

task('help', function() {
  console.log(
    fs.readFileSync(
      path.join(__dirname, 'help.txt'),
      {encoding: 'utf8'}
    )
  );
});

testTask('Controller', ['clean', 'prepare-test-app'], function() {
  this.testFiles.exclude('test/helpers/**');
  this.testFiles.exclude('test/fixtures/**');
  this.testFiles.exclude('test/geddy-test-app');
  this.testFiles.exclude('test/tmp/**');
  this.testFiles.include('test/**/*.js');
});

desc('Clears the test temp directory.');
task('clean', function() {
  console.log('Cleaning temp files ...');
  var tmpDir = path.join(__dirname, 'test', 'tmp');
  utilities.file.rmRf(tmpDir, {silent:true});
  fs.mkdirSync(tmpDir);
});

desc('Copies the test app into the temp directory.');
task('prepare-test-app', function() {
  console.log('Preparing test app ...');
  jake.cpR(
    path.join(__dirname, 'test', 'geddy-test-app'),
    path.join(__dirname, 'test', 'tmp'),
    {silent: true}
  );
  console.log('Test app prepared.');
});