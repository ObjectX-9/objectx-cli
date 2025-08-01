#!/usr/bin/env node

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('../package.json');

import '../lib/index.js'; 