var path = require('path')
  , assert = require('assert')
  , fs = require('fs')
  , exec = require('child_process').exec
  , tests;

var testAppDir = path.join(__dirname, 'tmp', 'geddy-test-app');
var controllersDir = path.join(testAppDir, 'app', 'controllers');

function createController(name, argv, cb)
{
  if (!argv) {
    argv = []
  }

  if (typeof argv === 'function') {
    cb = argv;
    argv = [];
  }

  var p = exec(path.join(__dirname, 'helpers', 'exec.js') + ' ' + name + ' ' +argv.join(' '), cb);
  p.stdout.pipe(process.stdout);
}

tests = {
  'beforeEach': function() {
    // go to app root
    process.chdir(path.join(__dirname, 'tmp', 'geddy-test-app'));
  },
  'Call outside of test app\'s root': function(next) {
    process.chdir('./app');
    createController('test', function(err, stdout, stderr) {
      assert.equal(stderr.split('\n')[1], 'Error: You must run this generator from the root of your application.');
      next();
    });
  },
  'Create a controller': function(next) {
    createController('test', function(err, stdout, stderr) {
      if (err) {
        console.log(err);
        fail();
        return;
      }
      var filePath = path.join(controllersDir, 'test.js');
      assert.equal(fs.existsSync(filePath), true);
      assert.equal(fs.readFileSync(filePath, {encoding:'utf8'}), fs.readFileSync(path.join(__dirname, 'fixtures', 'test.js'), { encoding: 'utf8'}));
      next();
    });
  },
  'Re-create the same controller': function(next) {
    createController('test', function(err, stdout, stderr) {
      assert.equal(stderr.split('\n')[1], 'Error: Controller already exists. Use -f to replace it.');
      next();
    });
  },
  'Overwrite the controller': function(next) {
    function checkFile()
    {
      var filePath = path.join(controllersDir, 'test.js');
      assert.equal(fs.existsSync(filePath), true);
      assert.equal(fs.readFileSync(filePath, {encoding:'utf8'}), fs.readFileSync(path.join(__dirname, 'fixtures', 'test.js'), { encoding: 'utf8'}));
    }

    createController('test',['-f'], function(err, stdout, stderr) {
      assert.equal(stderr, '');
      checkFile();

      createController('test',['--force'], function(err, stdout, stderr) {
        assert.equal(stderr, '');
        checkFile();
        next();
      });
    });
  }
};

module.exports = tests;