// handlers/pwa-install-handler.js

import { logger } from '../utils/logger.js';

const MODULE = 'PWAInstallHandler';

let deferredPrompt = null;

// ============================================================
// EXIBIÇÃO DO BOTÃO NO SIDEBAR
// ============================================================

/**
 * Armazena o prompt e exibe o botão de instalação no footer do sidebar
 */
export function showSidebarInstallButton(prompt) {
  deferredPrompt = prompt;

  const btn = document.getElementById('sidebarInstallBtn');

  if (!btn) {
    logger.error(MODULE, 'Botão de instalação (#sidebarInstallBtn) não encontrado no DOM');
    return;
  }

  btn.style.display = 'flex';
  logger.info(MODULE, 'Botão de instalação exibido no sidebar');
}

/**
 * Oculta o botão de instalação do sidebar
 */
export function hideSidebarInstallButton() {
  const btn = document.getElementById('sidebarInstallBtn');
  if (btn) btn.style.display = 'none';
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

/**
 * Registra o listener de instalação via event delegation no document.
 * Isso garante que funciona mesmo que #sidebarInstallBtn ainda não
 * esteja no DOM no momento da inicialização do PWA.
 */
export function initializeSidebarInstallButton() {
  document.addEventListener('click', (e) => {
    if (e.target.closest('#sidebarInstallBtn')) {
      handleInstall();
    }
  });

  logger.success(MODULE, 'Listener de instalação registrado via event delegation');
}
