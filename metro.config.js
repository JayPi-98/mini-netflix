const { getDefaultConfig } = require('@expo/metro-config');

/**
 * Metro configuration for Expo
 * - Prefer the CommonJS build of third-party packages by selecting `main` first.
 *   This avoids issues where Metro attempts to use the `module` field (ESM)
 *   that can be mis-resolved on Windows.
 */
const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  mainFields: ['main', 'react-native', 'module'],
};

// Guard symbolication against frames that point to pseudo files like "<anonymous>"
config.symbolicator = {
  ...config.symbolicator,
  customizeFrame: (frame) => {
    if (!frame || typeof frame.file !== 'string') return frame;
    if (frame.file.includes('<anonymous>') || frame.file.startsWith('eval__')) {
      return { ...frame, collapse: true };
    }
    return frame;
  },
};

module.exports = config;
