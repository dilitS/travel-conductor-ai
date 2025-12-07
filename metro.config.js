// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for .mjs files which are used by some libraries (like Firebase)
config.resolver.sourceExts.push('mjs');

// Prioritize CommonJS imports to avoid ESM issues like 'import.meta'
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
