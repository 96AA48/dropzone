console.log('Loaded app.js');
global.gui = require('nw.gui');

require('./dropzone/frontend');
require('./dropzone/web').start();
