// src/main.js

import { loadComponents } from './utils/component-loader.js';
import { initializeData, getTributacaoData, getImpostosFederaisData, getFaixasSimplesNacionalData } from './services/data-loader.js';
import { processCalculation } from './controllers/calculation-controller.js';
import { setupCalculationListeners, setupTaxUpdateListeners } from './handlers/event-handlers.js';
import { setupRegimeVisibilityHandler } from './handlers/regime-handler.js';
import { initializeTheme } from './views/theme-handler.js';
import { initializeTooltips } from './views/tooltip-handler.js';
import { initializeMenu, initializePerfilModal } from './handlers/menu-handler.js';

/**
 * Carrega todos os componentes HTML
 */
async function loadHTMLComponents() {
  console.log('🔄 Carregando componentes HTML...');
  
  await loadComponents([
    { id: 'header-container', path: 'components/header.html' },
    { id: 'side-menu-container', path: 'components/side-menu.html' },
    { id: 'perfil-modal-container', path: 'components/perfil-modal.html' },
    { id: 'left-panel-container', path: 'components/left-panel.html' },
    { id: 'right-panel-container', path: 'components/right-panel.html' },
    { id: 'tooltip-modal-container', path: 'components/tooltip-modal.html' },
    { id: 'footer-container', path: 'components/footer.html' }
  ]);
  
  console.log('✅ Componentes HTML carregados');
}

/**
 * Inicializa a aplicação
 */
async function initializeApp() {
  try {
    // 1. Carrega componentes HTML primeiro
    await loadHTMLComponents();
    
    // 2. Carrega dados dos JSONs
    await initializeData();
    
    // 3. Obtém referências aos dados carregados
    const tributacaoData = getTributacaoData();
    const impostosFederaisData = getImpostosFederaisData();
    const faixasSimplesNacionalData = getFaixasSimplesNacionalData();
    
    // 4. Configura listeners de eventos
    setupCalculationListeners(processCalculation);
    setupTaxUpdateListeners(tributacaoData, impostosFederaisData, faixasSimplesNacionalData, processCalculation);
    
    // 5. Configura gerenciamento de visibilidade por regime
    setupRegimeVisibilityHandler(processCalculation);
    
    // 6. Inicializa tema
    initializeTheme();
    
    // 7. Inicializa menu
    initializeMenu();

    // 8. Inicializa modal de perfil
    initializePerfilModal();

    // 9. Inicializa tooltips
    initializeTooltips();
    
    // 10. Executa cálculo inicial
    processCalculation();
    
    console.log('✅ Aplicação inicializada com sucesso');
  } catch (error) {
    console.error('❌ Erro ao inicializar aplicação:', error);
    // Exibir mensagem de erro para o usuário
    showErrorMessage('Erro ao carregar a aplicação. Por favor, recarregue a página.');
  }
}

/**
 * Exibe mensagem de erro para o usuário
 */
function showErrorMessage(message) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #f44336;
    color: white;
    padding: 15px 25px;
    border-radius: 8px;
    z-index: 10000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);
  
  setTimeout(() => errorDiv.remove(), 5000);
}

// Inicia a aplicação quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}