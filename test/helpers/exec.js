#!/usr/bin/env node

var gen = require('../../index');
console.log(process.cwd());
var argv = process.argv.slice(2);
console.log(argv);

gen(null, argv);