// handlers/pwa-install-handler.js

import { logger } from '../utils/logger.js';
import { syncSidebarFooter } from './update-handler.js';

const MODULE = 'PWAInstallHandler';

let deferredPrompt = null;

// ============================================================
// EXIBIÇÃO DO BOTÃO NO SIDEBAR
// ============================================================

export function showSidebarInstallButton(prompt) {
  deferredPrompt = prompt;
  syncSidebarFooter(true);
  logger.info(MODULE, 'Prompt de instalação armazenado — botão Instalar exibido');
}

export function hasPendingInstallPrompt() {
  return deferredPrompt !== null;
}

export function hideSidebarInstallButton() {
  deferredPrompt = null;
  syncSidebarFooter(false);
  logger.debug(MODULE, 'Botão de instalação ocultado');
}

// ============================================================
// AÇÃO DE INSTALAÇÃO
// ============================================================

/**
 * Dispara o prompt nativo do browser para instalar o PWA
 */
async function handleInstall() {
  if (!deferredPrompt) {
    logger.warn(MODULE, 'Prompt de instalação não disponível');
    return;
  }

  try {
    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    logger.info(MODULE, `Escolha de instalação: ${outcome}`);

    if (outcome === 'accepted') {
      logger.success(MODULE, 'Usuário aceitou a instalação');
    } else {
      logger.info(MODULE, 'Usuário recusou a instalação');
    }

    deferredPrompt = null;

  } catch (error) {
    logger.error(MODULE, 'Erro ao processar instalação', error);
  } finally {
    hideSidebarInstallButton();
  }
}

// ============================================================
// INICIALIZAÇÃO — event delegation no document
// ============================================================

export function initializeSidebarInstallButton() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('#sidebarInstallBtn')) {
      handleInstall();
    }
  });

  logger.success(MODULE, 'Listener de instalação registrado via event delegation');
}
