// utils/pwa.js

import { logger } from './logger.js';
import { notify } from './notifications.js';

const MODULE = 'PWA';

/**
 * Registra Service Worker
 */
export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    logger.warn(MODULE, 'Service Worker não suportado neste navegador');
    return;
  }
  
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js');
      
      logger.success(MODULE, 'Service Worker registrado', {
        scope: registration.scope
      });
      
      // Verifica atualizações
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            logger.info(MODULE, 'Nova versão disponível');
            
            notify.info(
              'Atualização Disponível',
              'Uma nova versão está disponível. Recarregue a página para atualizar.',
              0
            );
          }
        });
      });
      
    } catch (error) {
      logger.error(MODULE, 'Falha ao registrar Service Worker', error);
    }
  });
}

/**
 * Verifica se app pode ser instalado
 */
export function setupInstallPrompt() {
  let deferredPrompt;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    logger.info(MODULE, 'App pode ser instalado');
    
    // Mostra notificação de instalação
    const notification = notify.info(
      'Instalar Aplicativo',
      'Você pode instalar esta calculadora no seu dispositivo',
      10000
    );
    
    // Adiciona botão de instalação na notificação
    // (Implementação customizada se necessário)
  });
  
  window.addEventListener('appinstalled', () => {
    logger.success(MODULE, 'App instalado com sucesso');
    deferredPrompt = null;
    
    notify.success(
      'Instalado!',
      'A calculadora foi instalada no seu dispositivo'
    );
  });
}

/**
 * Verifica status de conexão
 */
export function setupConnectionMonitor() {
  const updateOnlineStatus = () => {
    if (navigator.onLine) {
      logger.info(MODULE, 'Conexão restaurada');
      notify.success('Online', 'Conexão com a internet restaurada');
    } else {
      logger.warn(MODULE, 'Sem conexão');
      notify.warning(
        'Offline',
        'Você está sem conexão. Algumas funcionalidades podem não funcionar.',
        0
      );
    }
  };
  
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}

/**
 * Inicializa funcionalidades PWA
 */
export function initializePWA() {
  logger.group('📱 Inicialização PWA');
  
  registerServiceWorker();
  setupInstallPrompt();
  setupConnectionMonitor();
  
  logger.groupEnd();
}