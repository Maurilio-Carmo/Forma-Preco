// src/handlers/update-handler.js

import { APP_VERSION, isNewerVersion } from '../config/version.js';
import { logger } from '../utils/logger.js';
import { notify } from '../utils/notifications.js';

const MODULE = 'UpdateHandler';
const STORAGE_KEY = 'installed_version';

function getInstalledVersion() {
  try {
    return localStorage.getItem(STORAGE_KEY) || '0.0.0';
  } catch {
    return '0.0.0';
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

function showUpdateNotification(currentVersion, newVersion) {
  const notification = document.getElementById('updateNotification');
  const currentVersionEl = document.getElementById('currentVersion');
  const newVersionEl = document.getElementById('newVersion');
  
  if (!notification) return;
  
  if (currentVersionEl) currentVersionEl.textContent = `v${currentVersion}`;
  if (newVersionEl) newVersionEl.textContent = `v${newVersion}`;
  
  notification.style.display = 'block';
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  logger.info(MODULE, `Atualização disponível: ${currentVersion} → ${newVersion}`);
}

function hideUpdateNotification() {
  const notification = document.getElementById('updateNotification');
  if (!notification) return;
  
  notification.classList.remove('show');
  setTimeout(() => {
    notification.style.display = 'none';
  }, 400);
}

async function updateApp() {
  const notification = document.getElementById('updateNotification');
  
  try {
    notification?.classList.add('updating');
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
    
    setTimeout(() => {
      window.location.reload(true);
    }, 1500);
    
  } catch (error) {
    logger.error(MODULE, 'Erro ao atualizar app', error);
    notification?.classList.remove('updating');
    notify.error('Erro na atualização', 'Tente novamente mais tarde');
  }
}

function dismissUpdate() {
  hideUpdateNotification();
  logger.info(MODULE, 'Atualização adiada');
  try {
    sessionStorage.setItem('update_dismissed', 'true');
  } catch {}
}

export function checkForUpdates() {
  const installedVersion = getInstalledVersion();
  const currentVersion = APP_VERSION;
  
  logger.info(MODULE, `Verificando atualizações...`);
  logger.info(MODULE, `Versão instalada: ${installedVersion}`);
  logger.info(MODULE, `Versão atual: ${currentVersion}`);
  
  if (isNewerVersion(currentVersion, installedVersion)) {
    const dismissed = sessionStorage.getItem('update_dismissed');
    if (!dismissed) {
      showUpdateNotification(installedVersion, currentVersion);
    }
    return true;
  }
  
  if (installedVersion !== currentVersion) {
    saveInstalledVersion(currentVersion);
  }
  
  return false;
}

export function initializeUpdateHandler() {
  logger.group('🔄 Inicializando Update Handler');
  
  const updateBtn = document.getElementById('updateNow');
  const dismissBtn = document.getElementById('updateDismiss');
  
  updateBtn?.addEventListener('click', updateApp);
  dismissBtn?.addEventListener('click', dismissUpdate);
  
  checkForUpdates();
  setInterval(checkForUpdates, 30 * 60 * 1000);
  
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      checkForUpdates();
    }
  });
  
  logger.groupEnd();
  logger.success(MODULE, 'Update Handler inicializado');
}