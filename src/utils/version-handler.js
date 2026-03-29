// src/utils/version-handler.js

import { logger } from './logger.js';
import { APP_VERSION } from '../config/version.js';

const MODULE = 'VersionHandler';

/**
 * Detecta se o app está rodando como PWA instalado (standalone)
 */
function isInstalledPWA() {
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
  const versionWrapper = document.getElementById('appVersionWrapper');

  if (versionElement) {
    versionElement.textContent = `v${APP_VERSION}`;
    logger.info(MODULE, `Versão do app carregada: ${APP_VERSION}`);
  }

  if (versionWrapper) {
    versionWrapper.style.display = isInstalledPWA() ? 'flex' : 'none';
    logger.debug(MODULE, `Wrapper de versão ${isInstalledPWA() ? 'exibido' : 'ocultado'} (modo standalone: ${isInstalledPWA()})`);
  }

  return APP_VERSION;
}

/**
 * Obtém a versão do app do localStorage (cache)
 */
export function getCachedVersion() {
  try {
    return localStorage.getItem('app_version') || '1.0.0';
  } catch {
    return '1.0.0';
  }
}

/**
 * Salva a versão no cache
 */
export function cacheVersion(version) {
  try {
    localStorage.setItem('app_version', version);
    logger.debug(MODULE, `Versão ${version} salva em cache`);
  } catch (error) {
    logger.warn(MODULE, 'Não foi possível salvar versão em cache', error);
  }
}
