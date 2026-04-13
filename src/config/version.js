// src/config/version.js

export const APP_VERSION = '1.0.14';

export const VERSION_INFO = {
  version: APP_VERSION,
  buildDate: '2026-04-13',
  name: 'Forma Preço',
  shortName: 'FormaPreço',
};

export function compareVersions(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }

  return 0;
}

export function isNewerVersion(newVersion, currentVersion) {
  return compareVersions(newVersion, currentVersion) > 0;
}
