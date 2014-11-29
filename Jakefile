var path = require('path')
  , fs = require('fs')
  , cwd = process.cwd()
  , utilities = require('utilities')
  , genutils = require('geddy-genutils')
  , exec = require('child_process').exec
  , helpers = require('./helpers')
  , genDirname = __dirname;

var ns = 'controller';

// Load the basic Geddy toolkit
genutils.loadGeddy();
var utils = genutils.loadGeddyUtils();

// Tasks
task('default', function(name) {
  var t = jake.Task['controller:create'];
  t.reenable();
  t.invoke(name);
});

namespace(ns, function() {
  task('create', function(name) {
    var self = this;

    if (!genutils.inAppRoot()) {
      fail('You must run this generator from the root of your application.');
      return;
    }

    if (!name) {
      fail('Missing controller name.');
      return;
    }

    var appPath = process.cwd();
    var controllersDir = path.join(appPath, 'app', 'controllers');

    var force = genutils.flagSet('-f','--force');
    var resource = genutils.flagSet('-r', '--resource');

    // sanitize the controller name
    var controllerFileName = name.replace(/\s|-/g, '_');
    if (resource) {
      controllerFileName = utilities.string.getInflection(controllerFileName, 'filename', 'plural');
    }
    else {
      controllerFileName = utilities.string.getInflection(controllerFileName, 'filename', 'normal');
    }
    var controllerFilePath = path.join(controllersDir, controllerFileName + '.js');

    if (!force && fs.existsSync(controllerFilePath)) {
      fail('Controller already exists. Use -f to replace it.');
      return;
    }

    // create constructor name
    var constructorName = utilities.string.capitalize(utilities.string.camelize(controllerFileName));

    genutils.template.write(
      path.join(__dirname, 'template', (resource) ? 'resource_controller.js.ejs' : 'controller.js.ejs'),
      controllerFilePath,
      {
        controllersDir: controllersDir,
        controllerFilePath: controllerFilePath,
        constructorName: constructorName,
        controllerFileName: controllerFileName
      }
    );

    console.log('Created controller "' + constructorName + '" in app/controllers/' + controllerFileName + '.js');

    // create route
    jake.Task['controller:route'].invoke(name);
  });

  task('route', function (name) {
    if (!name) {
      throw new Error('No route name specified.');
    }

    var resource = genutils.flagSet('-r', '--resource');

    var names = utils.string.getInflections(name)
      , routerPath = helpers.getRouterPath()
      , routeType = resource ? 'Resource' : 'Bare'
      , newRoute;

    if (routerPath) {
      if (routerPath.match('.coffee')) {
        if (!resource) {
          newRoute = 'router.match(\'/' +  names.filename.plural +
            '\').to controller: \'' + names.constructor.plural +
            '\', action: \'index\'';
        } else {
          newRoute = 'router.resource \'' +  names.filename.plural + '\'';
        }
      } else if (routerPath.match('.js')) {
        if (!resource) {
          newRoute = 'router.match(\'/' +  names.filename.plural +
            '\').to({controller: \'' + names.constructor.plural +
            '\', action: \'index\'});';
        } else {
          newRoute = 'router.resource(\'' +  names.filename.plural + '\');';
        }
      }

      if (helpers.addRoute(routerPath, newRoute)) {
        console.log('[Added] ' + routeType + ' ' + names.filename.plural +
          ' route added to ' + routerPath);
      }
      else {
        console.log(routeType + ' ' + names.filename.plural + ' route already defined in ' +
          routerPath);
      }
    }
    else {
      console.log('There is no router file to add routes too');
    }
  });

  task('help', function() {
    console.log(
      fs.readFileSync(
        path.join(__dirname, 'help.txt'),
        {encoding: 'utf8'}
      )
    );
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
});

testTask('Controller', ['controller:clean', 'controller:prepare-test-app'], function() {
  this.testFiles.exclude('test/helpers/**');
  this.testFiles.exclude('test/fixtures/**');
  this.testFiles.exclude('test/geddy-test-app');
  this.testFiles.exclude('test/tmp/**');
  this.testFiles.include('test/**/*.js');
});