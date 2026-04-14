// src/handlers/update-handler.js

import { APP_VERSION } from '../../version.js';
import { logger } from '../utils/logger.js';
import { notify } from '../utils/notifications.js';
import { isInstalledPWA } from '../utils/version-handler.js';
import { hasPendingInstallPrompt } from './pwa-install-handler.js';

const MODULE = 'UpdateHandler';
const STORAGE_KEY = 'installed_version';

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

function isNewerVersion(newVersion, currentVersion) {
  const p1 = newVersion.split('.').map(Number);
  const p2 = currentVersion.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if (p1[i] > p2[i]) return true;
    if (p1[i] < p2[i]) return false;
  }
  return false;
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

  if (installedVersion === null) {
    logger.info(MODULE, `Primeira visita — registrando versão ${APP_VERSION}`);
    saveInstalledVersion(APP_VERSION);
    return false;
  }

  logger.info(MODULE, `Verificando atualizações — instalada: ${installedVersion} / atual: ${APP_VERSION}`);
  return isNewerVersion(APP_VERSION, installedVersion);
}

// ============================================================
// SINCRONIZAÇÃO DO FOOTER DO SIDEBAR
// ============================================================

/**
 * Decide o que exibir no footer do sidebar:
 *   - canInstall  → botão Instalar
 *   - nova versão → bolinha no menu + botão Atualizar
 *   - instalado e em dia → wrapper de versão
 *   - demais → nada
 */
export function syncSidebarFooter(canInstall = false) {
  const installBtn  = document.getElementById('sidebarInstallBtn');
  const updateBtn   = document.getElementById('sidebarUpdateBtn');
  const versionEl   = document.getElementById('appVersionWrapper');
  const menuToggle  = document.getElementById('menuToggle');

  [installBtn, updateBtn, versionEl].forEach(el => { if (el) el.style.display = 'none'; });

  const hasUpdate = checkForUpdates();

  menuToggle?.classList.toggle('has-update', hasUpdate);

  if (canInstall) {
    if (installBtn) installBtn.style.display = 'flex';
    logger.debug(MODULE, 'Sidebar footer: botão Instalar');
  } else if (hasUpdate) {
    if (updateBtn) updateBtn.style.display = 'flex';
    logger.debug(MODULE, 'Sidebar footer: botão Atualizar');
  } else if (isInstalledPWA()) {
    if (versionEl) versionEl.style.display = 'flex';
    logger.debug(MODULE, 'Sidebar footer: versão');
  }
}

// ============================================================
// LÓGICA DE ATUALIZAÇÃO
// ============================================================

async function updateApp() {
  const btn = document.getElementById('sidebarUpdateBtn');

  try {
    btn?.classList.add('loading');

    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) await registration.update();

      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(key => caches.delete(key)));
      }
    }

    saveInstalledVersion(APP_VERSION);
    setTimeout(() => window.location.reload(true), 300);

  } catch (error) {
    logger.error(MODULE, 'Erro ao atualizar app', error);
    btn?.classList.remove('loading');
    notify.error('Erro na atualização', 'Tente novamente mais tarde');
  }
}

// ============================================================
// INICIALIZAÇÃO
// ============================================================

export function initializeUpdateHandler() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('#sidebarUpdateBtn')) updateApp();
  });

  syncSidebarFooter(hasPendingInstallPrompt());

  setInterval(() => syncSidebarFooter(hasPendingInstallPrompt()), 30 * 60 * 1000);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) syncSidebarFooter(hasPendingInstallPrompt());
  });

  logger.success(MODULE, 'Update Handler inicializado');
}
