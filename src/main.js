// js/main.js

import { initializeData, getTributacaoData, getImpostosFederaisData, getFaixasSimplesNacionalData } from './services/data-loader.js';
import { processCalculation } from './controllers/calculation-controller.js';
import { setupCalculationListeners, setupTaxUpdateListeners } from './handlers/event-handlers.js';
import { setupRegimeVisibilityHandler } from './handlers/regime-handler.js';
import { initializeTheme } from './views/theme-handler.js';

/**
 * Inicializa a aplicação
 */
async function initializeApp() {
  try {
    // Carrega dados dos JSONs
    await initializeData();
    
    // Obtém referências aos dados carregados
    const tributacaoData = getTributacaoData();
    const impostosFederaisData = getImpostosFederaisData();
    const faixasSimplesNacionalData = getFaixasSimplesNacionalData();
    
    // Configura listeners de eventos
    setupCalculationListeners(processCalculation);
    setupTaxUpdateListeners(tributacaoData, impostosFederaisData, faixasSimplesNacionalData, processCalculation);
    
    // Configura gerenciamento de visibilidade por regime
    setupRegimeVisibilityHandler(processCalculation);
    
    // Inicializa tema
    initializeTheme();
    
    // Executa cálculo inicial
    processCalculation();
    
    console.log('✅ Aplicação inicializada com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar aplicação:', error);
  }
}

// Inicia a aplicação quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}