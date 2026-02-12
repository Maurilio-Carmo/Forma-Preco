// src/utils/version-handler.js

import { logger } from './logger.js';

const MODULE = 'VersionHandler';

/**
 * Carrega a versão do app do manifest.json e atualiza o menu
 */
export async function loadAppVersion() {
  try {
    const response = await fetch('/manifest.json');
    const manifest = await response.json();
    
    const version = manifest.version || '1.0.0';
    const versionElement = document.getElementById('appVersion');
    
    if (versionElement) {
      versionElement.textContent = `v${version}`;
      logger.info(MODULE, `Versão do app carregada: ${version}`);
    }
    
    return version;
    
  } catch (error) {
    logger.error(MODULE, 'Erro ao carregar versão do app', error);
    
    // Fallback para versão padrão
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