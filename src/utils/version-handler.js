// src/utils/version-handler.js

import { logger } from './logger.js';
import { APP_VERSION } from '../../version.js';

const MODULE = 'VersionHandler';

/**
 * Detecta se o app está rodando como PWA instalado (standalone)
 */
export function isInstalledPWA() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

/**
 * Atualiza o elemento #appVersion e exibe o wrapper
 * somente quando o app estiver instalado como PWA.
 */
export function loadAppVersion() {
  const versionElement = document.getElementById('appVersion');
  if (versionElement) {
    versionElement.textContent = `v${APP_VERSION}`;
    logger.info(MODULE, `Versão do app carregada: ${APP_VERSION}`);
  }

  // display do appVersionWrapper é controlado por syncSidebarFooter (update-handler.js)

  return APP_VERSION;
}
