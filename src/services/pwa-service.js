// services/pwa-service.js

import { logger } from '../utils/logger.js';
import { notify } from '../utils/notifications.js';
import { showSidebarInstallButton, hideSidebarInstallButton } from '../handlers/pwa-install-handler.js';

const MODULE = 'PWAService';

// ============================================================
// REGISTRO DO SERVICE WORKER
// ============================================================

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    logger.warn(MODULE, 'Service Worker não suportado neste navegador');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('./sw.js', { type: 'module' });

    logger.success(MODULE, 'Service Worker registrado', { scope: registration.scope });

    return registration;

  } catch (error) {
    logger.error(MODULE, 'Falha ao registrar Service Worker', error);
    return null;
  }
}

// ============================================================
// PROMPT DE INSTALAÇÃO
// ============================================================

/**
 * Configura a captura do prompt de instalação PWA.
 *
 * O evento beforeinstallprompt pode ser disparado pelo browser
 * ANTES dos módulos ES6 carregarem. Por isso, o index.html
 * captura o evento cedo e salva em window.__pwaInstallPrompt.
 *
 * Aqui fazemos duas coisas:
 * 1. Se o prompt já foi capturado antes, exibe o botão imediatamente.
 * 2. Registra o listener para capturas futuras (navegações seguintes).
 */
export function setupInstallPrompt() {
  // 1. Prompt já capturado antes dos módulos carregarem
  if (window.__pwaInstallPrompt) {
    logger.info(MODULE, 'Prompt de instalação já capturado — exibindo botão no sidebar');
    showSidebarInstallButton(window.__pwaInstallPrompt);
    window.__pwaInstallPrompt = null;
  }

  // 2. Listener para próximas disparadas (ex: após desinstalar)
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    logger.info(MODULE, 'beforeinstallprompt recebido — exibindo botão no sidebar');
    showSidebarInstallButton(e);
  });

  window.addEventListener('appinstalled', () => {
    logger.success(MODULE, 'App instalado com sucesso');
    hideSidebarInstallButton();
    notify.success('Instalado!', 'A calculadora foi instalada no seu dispositivo');
  });

  logger.debug(MODULE, 'Listeners de instalação configurados');
}

// ============================================================
// MONITOR DE CONEXÃO
// ============================================================

export function setupConnectionMonitor() {
  let wasOffline = false;

  const updateOnlineStatus = () => {
    if (navigator.onLine) {
      if (wasOffline) {
        logger.info(MODULE, 'Conexão restaurada');
        notify.success('Online', 'Conexão com a internet restaurada', 3000);
        wasOffline = false;
      }
    } else {
      logger.warn(MODULE, 'Sem conexão com a internet');
      notify.warning('Offline', 'Você está sem conexão. Algumas funcionalidades podem não funcionar.', 0);
      wasOffline = true;
    }
  };

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);

  if (!navigator.onLine) updateOnlineStatus();

  logger.debug(MODULE, 'Monitor de conexão configurado');
}

// ============================================================
// UTILITÁRIOS
// ============================================================

export async function checkForUpdates() {
  if (!('serviceWorker' in navigator)) {
    logger.warn(MODULE, 'Service Worker não disponível');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();

    if (!registration) {
      logger.warn(MODULE, 'Nenhum Service Worker registrado');
      return false;
    }

    await registration.update();
    logger.info(MODULE, 'Verificação manual de atualização executada');
    return true;

  } catch (error) {
    logger.error(MODULE, 'Erro ao verificar atualizações', error);
    return false;
  }
}

export async function getServiceWorkerInfo() {
  if (!('serviceWorker' in navigator)) {
    return { supported: false, registered: false, controller: null };
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();

    return {
      supported: true,
      registered: !!registration,
      controller: navigator.serviceWorker.controller
        ? {
            state: navigator.serviceWorker.controller.state,
            scriptURL: navigator.serviceWorker.controller.scriptURL
          }
        : null,
      registration: registration
        ? { scope: registration.scope, updateViaCache: registration.updateViaCache }
        : null
    };

  } catch (error) {
    logger.error(MODULE, 'Erro ao obter informações do Service Worker', error);
    return { supported: true, registered: false, controller: null, error: error.message };
  }
}
