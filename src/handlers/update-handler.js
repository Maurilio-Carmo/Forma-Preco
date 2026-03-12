// src/handlers/update-handler.js

import { APP_VERSION, isNewerVersion } from '../config/version.js';
import { logger } from '../utils/logger.js';
import { notify } from '../utils/notifications.js';

const MODULE = 'UpdateHandler';
const STORAGE_KEY = 'installed_version';

// ============================================================
// CONTROLE DE VERSÃO NO STORAGE
// ============================================================

/**
 * Retorna null se nunca foi salvo (primeira visita),
 * ou a string da versão salva.
 * Nunca usa fallback '0.0.0' para não criar falsos positivos.
 */
function getInstalledVersion() {
  try {
    return localStorage.getItem(STORAGE_KEY); // null se não existe
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
// BOTÃO DE ATUALIZAÇÃO NO SIDEBAR
// ============================================================

function showSidebarUpdateButton() {
  const btn = document.getElementById('sidebarUpdateBtn');
  if (!btn) return;
  btn.style.display = 'flex';
  logger.info(MODULE, 'Botão de atualização exibido no sidebar');
}

function hideSidebarUpdateButton() {
  const btn = document.getElementById('sidebarUpdateBtn');
  if (!btn) return;
  btn.style.display = 'none';
  logger.debug(MODULE, 'Botão de atualização ocultado');
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
// VERIFICAÇÃO DE VERSÃO
// ============================================================

/**
 * Três cenários possíveis:
 *
 * 1. installedVersion === null  → primeira visita após trocar de sistema
 *    de notificação. Salva silenciosamente. Sem botão.
 *
 * 2. installedVersion < APP_VERSION  → há atualização disponível.
 *    Exibe botão (a menos que o usuário tenha dispensado na sessão).
 *
 * 3. installedVersion === APP_VERSION  → tudo em dia. Sem botão.
 */
export function checkForUpdates() {
  const installedVersion = getInstalledVersion();
  const currentVersion = APP_VERSION;

  // Cenário 1: primeira visita — apenas registra, sem mostrar botão
  if (installedVersion === null) {
    logger.info(MODULE, `Primeira visita — registrando versão ${currentVersion}`);
    saveInstalledVersion(currentVersion);
    return false;
  }

  logger.info(MODULE, `Verificando atualizações — instalada: ${installedVersion} / atual: ${currentVersion}`);

  // Cenário 2: versão desatualizada
  if (isNewerVersion(currentVersion, installedVersion)) {
    const dismissed = sessionStorage.getItem('update_dismissed');
    if (!dismissed) {
      showSidebarUpdateButton();
    }
    return true;
  }

  // Cenário 3: em dia
  return false;
}

// ============================================================
// INICIALIZAÇÃO — event delegation no document
// ============================================================

export function initializeUpdateHandler() {
  logger.group('🔄 Inicializando Update Handler');

  // Event delegation — funciona mesmo se o elemento ainda não estiver no DOM
  document.addEventListener('click', (e) => {
    if (e.target.closest('#sidebarUpdateBtn')) {
      updateApp();
    }
  });

  checkForUpdates();

  setInterval(checkForUpdates, 30 * 60 * 1000);

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) checkForUpdates();
  });

  logger.groupEnd();
  logger.success(MODULE, 'Update Handler inicializado');
}
