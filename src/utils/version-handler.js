// src/utils/version-handler.js

import { logger } from './logger.js';

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
 * Carrega a versão do app do manifest.json,
 * atualiza o elemento #appVersion e exibe o wrapper
 * somente quando o app estiver instalado como PWA.
 */
export async function loadAppVersion() {
  try {
    const response = await fetch('./manifest.json');
    const manifest = await response.json();

    const version = manifest.version || '1.0.0';
    const versionElement = document.getElementById('appVersion');
    const versionWrapper = document.getElementById('appVersionWrapper');

    if (versionElement) {
      versionElement.textContent = `v${version}`;
      logger.info(MODULE, `Versão do app carregada: ${version}`);
    }

    // Exibe o wrapper de versão somente se instalado como PWA
    if (versionWrapper) {
      versionWrapper.style.display = isInstalledPWA() ? 'flex' : 'none';
      logger.debug(MODULE, `Wrapper de versão ${isInstalledPWA() ? 'exibido' : 'ocultado'} (modo standalone: ${isInstalledPWA()})`);
    }

    return version;

  } catch (error) {
    logger.error(MODULE, 'Erro ao carregar versão do app', error);

    // Fallback
    const versionElement = document.getElementById('appVersion');
    if (versionElement) {
      versionElement.textContent = 'v1.0.0';
    }

    return '1.0.0';
  }
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
