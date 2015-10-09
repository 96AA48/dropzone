console.log('Loaded app.js');
global.gui = require('nw.gui');

require('./frontend');
require('./web').start();
