// src/handlers/update-handler.js

import { APP_VERSION } from '../../version.js';

function isNewerVersion(newVersion, currentVersion) {
  const p1 = newVersion.split('.').map(Number);
  const p2 = currentVersion.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (p1[i] > p2[i]) return true;
    if (p1[i] < p2[i]) return false;
  }
  return false;
}
import { logger } from '../utils/logger.js';
import { notify } from '../utils/notifications.js';
import { isInstalledPWA } from '../utils/version-handler.js';

const MODULE = 'UpdateHandler';
const STORAGE_KEY = 'installed_version';

// ============================================================
// CONTROLE DE VERSÃO NO STORAGE
// ============================================================

function getInstalledVersion() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveInstalledVersion(version) {
  try {
    localStorage.setItem(STORAGE_KEY, version);
    logger.info(MODULE, `Versão ${version} salva`);
  } catch (error) {
    logger.error(MODULE, 'Erro ao salvar versão', error);
  }
}

// ============================================================
// VERIFICAÇÃO DE VERSÃO
// ============================================================

/**
 * Verifica se há nova versão disponível.
 * Na primeira visita registra silenciosamente e retorna false.
 * @returns {boolean}
 */
export function checkForUpdates() {
  const installedVersion = getInstalledVersion();
  const currentVersion = APP_VERSION;

  if (installedVersion === null) {
    logger.info(MODULE, `Primeira visita — registrando versão ${currentVersion}`);
    saveInstalledVersion(currentVersion);
    return false;
  }

  logger.info(MODULE, `Verificando atualizações — instalada: ${installedVersion} / atual: ${currentVersion}`);

  return isNewerVersion(currentVersion, installedVersion);
}

// ============================================================
// SINCRONIZAÇÃO DO FOOTER DO SIDEBAR
// ============================================================

/**
 * Decide o que exibir no footer do sidebar de acordo com as regras:
 *   - canInstall  → botão Instalar
 *   - instalado + nova versão → botão Atualizar
 *   - instalado + versão ok  → wrapper de versão
 *   - demais casos → nada
 *
 * @param {boolean} canInstall - true quando beforeinstallprompt está disponível
 */
export function syncSidebarFooter(canInstall = false) {
  const installBtn = document.getElementById('sidebarInstallBtn');
  const updateBtn  = document.getElementById('sidebarUpdateBtn');
  const versionEl  = document.getElementById('appVersionWrapper');

  [installBtn, updateBtn, versionEl].forEach(el => { if (el) el.style.display = 'none'; });

  const installed = isInstalledPWA();
  const hasUpdate = checkForUpdates();
  const menuToggle = document.getElementById('menuToggle');

  menuToggle?.classList.toggle('has-update', hasUpdate);

  if (canInstall) {
    if (installBtn) installBtn.style.display = 'flex';
    logger.debug(MODULE, 'Sidebar footer: botão Instalar');
  } else if (installed && hasUpdate) {
    if (updateBtn) updateBtn.style.display = 'flex';
    logger.debug(MODULE, 'Sidebar footer: botão Atualizar');
  } else if (installed) {
    if (versionEl) versionEl.style.display = 'flex';
    logger.debug(MODULE, 'Sidebar footer: versão');
  } else {
    logger.debug(MODULE, 'Sidebar footer: nada a exibir');
  }
}

// ============================================================
// LÓGICA DE ATUALIZAÇÃO
// ============================================================

async function updateApp() {
  const btn = document.getElementById('sidebarUpdateBtn');

  try {
    btn?.classList.add('loading');
    logger.info(MODULE, 'Iniciando atualização...');

    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) await registration.update();

      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(key => caches.delete(key)));
        logger.info(MODULE, 'Cache limpo');
      }
    }

    saveInstalledVersion(APP_VERSION);
    notify.success('Atualizando...', 'O app será recarregado', 1500);
    setTimeout(() => window.location.reload(true), 1500);

  } catch (error) {
    logger.error(MODULE, 'Erro ao atualizar app', error);
    btn?.classList.remove('loading');
    notify.error('Erro na atualização', 'Tente novamente mais tarde');
  }
}

// ============================================================
// INICIALIZAÇÃO — event delegation no document
// ============================================================

export function initializeUpdateHandler() {
  logger.group('🔄 Inicializando Update Handler');

  document.addEventListener('click', (e) => {
    if (e.target.closest('#sidebarUpdateBtn')) {
      updateApp();
    }
  });

  syncSidebarFooter(false);

  setInterval(() => syncSidebarFooter(false), 30 * 60 * 1000);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) syncSidebarFooter(false);
  });

  logger.groupEnd();
  logger.success(MODULE, 'Update Handler inicializado');
}
