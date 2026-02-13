// src/config/version.js

(function(window) {
  'use strict';
  
  const APP_VERSION = '1.0.6';
  
  const VERSION_INFO = {
    version: APP_VERSION,
    buildDate: '2026-02-13',
    name: 'Calculadora de Preço',
    shortName: 'CalcPreço'
  };
  
  /**
   * Compara duas versões
   */
  function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
      if (parts1[i] > parts2[i]) return 1;
      if (parts1[i] < parts2[i]) return -1;
    }
    
    return 0;
  }
  
  /**
   * Verifica se uma versão é mais nova
   */
  function isNewerVersion(newVersion, currentVersion) {
    return compareVersions(newVersion, currentVersion) > 0;
  }
  
  // Expõe no objeto window
  window.AppVersion = {
    VERSION: APP_VERSION,
    INFO: VERSION_INFO,
    compareVersions: compareVersions,
    isNewerVersion: isNewerVersion
  };
  
})(window);