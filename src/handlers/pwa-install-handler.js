// handlers/pwa-install-handler.js

import { logger } from '../utils/logger.js';

const MODULE = 'PWAInstallHandler';

let deferredPrompt = null;
let notificationElement = null;
let autoHideTimeout = null;

/**
 * Mostra a notificação de instalação
 */
export function showInstallNotification(prompt) {
  deferredPrompt = prompt;
  
  notificationElement = document.getElementById('pwaInstallNotification');
  
  if (!notificationElement) {
    logger.error(MODULE, 'Elemento de notificação não encontrado no DOM');
    return;
  }
  
  // Mostra a notificação
  notificationElement.style.display = 'block';
  
  logger.info(MODULE, 'Notificação de instalação exibida');
  
  // Auto-oculta após 15 segundos
  autoHideTimeout = setTimeout(() => {
    hideInstallNotification();
    logger.debug(MODULE, 'Notificação auto-ocultada após 15s');
  }, 15000);
}

/**
 * Oculta a notificação de instalação
 */
export function hideInstallNotification() {
  if (!notificationElement) return;
  
  notificationElement.style.display = 'none';
  
  if (autoHideTimeout) {
    clearTimeout(autoHideTimeout);
    autoHideTimeout = null;
  }
  
  logger.debug(MODULE, 'Notificação de instalação ocultada');
}

/**
 * Processa a instalação do PWA
 */
async function handleInstall() {
  if (!deferredPrompt) {
    logger.warn(MODULE, 'Prompt de instalação não disponível');
    return;
  }
  
  try {
    // Mostra o prompt nativo
    deferredPrompt.prompt();
    
    // Aguarda escolha do usuário
    const { outcome } = await deferredPrompt.userChoice;
    
    logger.info(MODULE, `Escolha de instalação: ${outcome}`);
    
    if (outcome === 'accepted') {
      logger.success(MODULE, 'Usuário aceitou instalação');
    } else {
      logger.info(MODULE, 'Usuário recusou instalação');
    }
    
    // Limpa o prompt
    deferredPrompt = null;
    
  } catch (error) {
    logger.error(MODULE, 'Erro ao processar instalação', error);
  } finally {
    // Oculta a notificação
    hideInstallNotification();
  }
}

/**
 * Adia a instalação
 */
function handleLater() {
  logger.info(MODULE, 'Usuário adiou instalação');
  hideInstallNotification();
}

/**
 * Inicializa os event listeners da notificação
 */
export function initializePWAInstallNotification() {
  const installBtn = document.getElementById('pwaInstallBtn');
  const laterBtn = document.getElementById('pwaInstallLaterBtn');
  const closeBtn = document.getElementById('pwaInstallClose');
  
  if (!installBtn || !laterBtn || !closeBtn) {
    logger.warn(MODULE, 'Botões da notificação não encontrados no DOM');
    return;
  }
  
  // Botão Instalar
  installBtn.addEventListener('click', handleInstall);
  
  // Botão Depois
  laterBtn.addEventListener('click', handleLater);
  
  // Botão Fechar
  closeBtn.addEventListener('click', hideInstallNotification);
  
  logger.success(MODULE, 'Event listeners da notificação inicializados');
}