// src/handlers/update-handler.js

import { APP_VERSION, isNewerVersion } from '../config/version.js';
import { logger } from '../utils/logger.js';
import { notify } from '../utils/notifications.js';

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
 * Lógica de verificação:
 *
 * - Se nunca houve versão salva (null): é a primeira visita.
 *   Salva a versão atual silenciosamente. Sem botão.
 *
 * - Se a versão salva é menor que APP_VERSION: há atualização.
 *   Exibe o botão (a menos que o usuário tenha dispensado na sessão).
 *
 * - Se a versão salva é igual à atual: tudo em dia. Sem botão.
 */
export function checkForUpdates() {
  const installedVersion = getInstalledVersion();
  const currentVersion = APP_VERSION;

  // Primeira visita: apenas registra a versão
  if (installedVersion === null) {
    logger.info(MODULE, `Primeira visita — registrando versão ${currentVersion}`);
    saveInstalledVersion(currentVersion);
    return false;
  }

  logger.info(MODULE, `Verificando atualizações — instalada: ${installedVersion} / atual: ${currentVersion}`);

  if (isNewerVersion(currentVersion, installedVersion)) {
    const dismissed = sessionStorage.getItem('update_dismissed');
    if (!dismissed) {
      showSidebarUpdateButton();
    }
    return true;
  }

  return false;
}

// ============================================================
// INICIALIZAÇÃO — event delegation no document
// ============================================================

export function initializeUpdateHandler() {
  logger.group('🔄 Inicializando Update Handler');

  // Event delegation — não depende do elemento já estar no DOM
  document.addEventListener('click', (e) => {
    if (e.target.closest('#sidebarUpdateBtn')) {
      updateApp();
    }
  });

  // Verificação inicial
  checkForUpdates();

  // Verificação periódica a cada 30 minutos
  setInterval(checkForUpdates, 30 * 60 * 1000);

  // Reverifica ao retornar para a aba
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) checkForUpdates();
  });

  logger.groupEnd();
  logger.success(MODULE, 'Update Handler inicializado');
}
