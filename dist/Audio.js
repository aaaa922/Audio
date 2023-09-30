// Import the Enmity library.
const Enmity = require('enmity');

// Get the module for your plugin.
const plugin = require('./plugin');

// Register the plugin with Enmity.
Enmity.registerPlugin(plugin);
