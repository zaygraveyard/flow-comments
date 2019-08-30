#!/usr/bin/env node

/*eslint-disable no-global-assign, import/no-commonjs */
require = require('esm')(module);
module.exports = require('./cli.esm.js');
