// services/pwa-service.js

import { logger } from '../utils/logger.js';
import { notify } from '../utils/notifications.js';
import { showInstallNotification } from '../handlers/pwa-install-handler.js';

const MODULE = 'PWAService';

/**
 * Registra Service Worker e gerencia atualizações
 */
export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    logger.warn(MODULE, 'Service Worker não suportado neste navegador');
    return null;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('./sw.js');
    
    logger.success(MODULE, 'Service Worker registrado', {
      scope: registration.scope
    });
    
    // Configura listener de atualizações
    setupUpdateListener(registration);
    
    // Configura verificação periódica
    setupPeriodicUpdateCheck(registration);
    
    return registration;
    
  } catch (error) {
    logger.error(MODULE, 'Falha ao registrar Service Worker', error);
    return null;
  }
}

/**
 * Configura listener para detectar atualizações
 */
function setupUpdateListener(registration) {
  registration.addEventListener('updatefound', () => {
    const newWorker = registration.installing;
    
    if (!newWorker) return;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        handleUpdateAvailable(newWorker);
      }
    });
  });
  
  logger.debug(MODULE, 'Listener de atualizações configurado');
}

/**
 * Processa atualização disponível
 */
function handleUpdateAvailable(newWorker) {
  logger.info(MODULE, 'Nova versão detectada - atualizando...');
  
  // Mostra notificação informativa
  notify.info(
    'Atualizando Aplicação',
    'Nova versão detectada. Atualizando em 2 segundos...',
    2000
  );
  
  // Aguarda 2 segundos para usuário ver a mensagem
  setTimeout(() => {
    applyUpdate(newWorker);
  }, 2000);
}

/**
 * Aplica a atualização
 */
function applyUpdate(newWorker) {
  newWorker.postMessage({ type: 'SKIP_WAITING' });
  window.location.reload();
  
  logger.success(MODULE, 'Atualização aplicada - recarregando página');
}

/**
 * Configura verificação periódica de atualizações
 */
function setupPeriodicUpdateCheck(registration) {
  // Verifica a cada 60 minutos
  setInterval(() => {
    registration.update();
    logger.debug(MODULE, 'Verificação periódica de atualização executada');
  }, 60 * 60 * 1000);
  
  logger.debug(MODULE, 'Verificação periódica configurada (60 minutos)');
}

/**
 * Verifica atualizações manualmente
 */
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

/**
 * Configura prompt de instalação
 */
export function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Previne o prompt automático
    e.preventDefault();
    
    logger.info(MODULE, 'App pode ser instalado');
    
    // Mostra notificação customizada
    showInstallNotification(e);
  });
  
  window.addEventListener('appinstalled', () => {
    logger.success(MODULE, 'App instalado com sucesso');
    
    notify.success(
      'Instalado!',
      'A calculadora foi instalada no seu dispositivo'
    );
  });
  
  logger.debug(MODULE, 'Listeners de instalação configurados');
}

/**
 * Monitora status de conexão
 */
export function setupConnectionMonitor() {
  let wasOffline = false;
  
  const updateOnlineStatus = () => {
    if (navigator.onLine) {
      if (wasOffline) {
        logger.info(MODULE, 'Conexão restaurada');
        
        notify.success(
          'Online',
          'Conexão com a internet restaurada',
          3000
        );
        
        wasOffline = false;
      }
    } else {
      logger.warn(MODULE, 'Sem conexão com a internet');
      
      notify.warning(
        'Offline',
        'Você está sem conexão. Algumas funcionalidades podem não funcionar.',
        0 // Não desaparece automaticamente
      );
      
      wasOffline = true;
    }
  };
  
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  
  // Verifica status inicial
  if (!navigator.onLine) {
    updateOnlineStatus();
  }
  
  logger.debug(MODULE, 'Monitor de conexão configurado');
}

/**
 * Retorna informações sobre o Service Worker
 */
export async function getServiceWorkerInfo() {
  if (!('serviceWorker' in navigator)) {
    return {
      supported: false,
      registered: false,
      controller: null
    };
  }
  
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    
    return {
      supported: true,
      registered: !!registration,
      controller: navigator.serviceWorker.controller ? {
        state: navigator.serviceWorker.controller.state,
        scriptURL: navigator.serviceWorker.controller.scriptURL
      } : null,
      registration: registration ? {
        scope: registration.scope,
        updateViaCache: registration.updateViaCache
      } : null
    };
    
  } catch (error) {
    logger.error(MODULE, 'Erro ao obter informações do Service Worker', error);
    
    return {
      supported: true,
      registered: false,
      controller: null,
      error: error.message
    };
  }
}