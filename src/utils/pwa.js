// utils/pwa.js

import { logger } from './logger.js';
import { 
  registerServiceWorker, 
  setupInstallPrompt, 
  setupConnectionMonitor,
  checkForUpdates,
  getServiceWorkerInfo
} from '../services/pwa-service.js';
import { initializePWAInstallNotification } from '../handlers/pwa-install-handler.js';

const MODULE = 'PWA';

/**
 * Inicializa todas as funcionalidades PWA
 */
export function initializePWA() {
  logger.group('📱 Inicialização PWA');
  
  try {
    // 1. Registra Service Worker
    logger.info(MODULE, 'Etapa 1/4: Registrando Service Worker');
    registerServiceWorker();
    
    // 2. Configura prompt de instalação
    logger.info(MODULE, 'Etapa 2/4: Configurando prompt de instalação');
    setupInstallPrompt();
    
    // 3. Configura monitor de conexão
    logger.info(MODULE, 'Etapa 3/4: Configurando monitor de conexão');
    setupConnectionMonitor();
    
    // 4. Inicializa notificação de instalação
    logger.info(MODULE, 'Etapa 4/4: Inicializando notificação de instalação');
    initializePWAInstallNotification();
    
    logger.success(MODULE, 'PWA inicializado com sucesso');
    
    // Disponibiliza funções úteis no console (apenas em debug)
    exposeDebugFunctions();
    
  } catch (error) {
    logger.error(MODULE, 'Erro ao inicializar PWA', error);
  } finally {
    logger.groupEnd();
  }
}

/**
 * Expõe funções úteis no console para debug
 */
function exposeDebugFunctions() {
  if (typeof window === 'undefined') return;
  
  // Função para verificar atualizações manualmente
  window.checkForUpdates = checkForUpdates;
  
  // Função para obter informações do Service Worker
  window.getServiceWorkerInfo = getServiceWorkerInfo;
  
  logger.debug(MODULE, 'Funções de debug disponíveis no console', {
    functions: ['checkForUpdates()', 'getServiceWorkerInfo()']
  });
}

/**
 * Re-exporta funções úteis do service
 */
export { checkForUpdates, getServiceWorkerInfo };