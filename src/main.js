// src/main.js

import { loadComponents } from './utils/component-loader.js';
import { loadAppVersion } from './utils/version-handler.js';
import { initializeUpdateHandler } from './handlers/update-handler.js';
import { initializeData, getTributacaoData, getImpostosFederaisData, getFaixasSimplesNacionalData } from './services/data-loader.js';
import { processCalculation } from './controllers/calculation-controller.js';
import { setupCalculationListeners, setupTaxUpdateListeners } from './handlers/event-handlers.js';
import { setupRegimeVisibilityHandler } from './handlers/regime-handler.js';
import { initializeTheme } from './views/theme-handler.js';
import { initializeTooltips } from './views/tooltip-handler.js';
import { initializeMenu } from './handlers/menu-handler.js';
import { initializePerfilModal } from './handlers/perfil-modal-handler.js';
import { getRegimeTributario } from './services/perfil-service.js';
import { ELEMENTS } from './config/constants.js';
import { logger } from './utils/logger.js';
import { notify } from './utils/notifications.js';
import { eventBus } from './utils/event-bus.js';
import { initializePerformanceOptimizations } from './utils/performance.js';
import { initializePWA } from './utils/pwa.js';

const MODULE = 'Main';

/**
 * Carrega todos os componentes HTML
 */
async function loadHTMLComponents() {
  logger.group('📄 Carregamento de Componentes HTML');

  try {
    await loadComponents([
      { id: 'header-container',       path: 'components/header.html',        skeleton: 'header'  },
      { id: 'side-menu-container',    path: 'components/side-menu.html',      skeleton: 'default' },
      { id: 'perfil-modal-container', path: 'components/perfil-modal.html',   skeleton: 'default' },
      { id: 'left-panel-container',   path: 'components/left-panel.html',     skeleton: 'panel'   },
      { id: 'right-panel-container',  path: 'components/right-panel.html',    skeleton: 'sidebar' },
      { id: 'tooltip-modal-container',path: 'components/tooltip-modal.html',  skeleton: 'default' },
      { id: 'footer-container',       path: 'components/footer.html',         skeleton: 'default' }
    ]);

    logger.groupEnd();
  } catch (error) {
    logger.groupEnd();
    throw error;
  }
}

/**
 * Carrega o regime do perfil e define no calculador
 */
function loadRegimeFromPerfil() {
  const regimeSalvo = getRegimeTributario();
  const regimeSelect = document.getElementById(ELEMENTS.REGIME);

  if (regimeSalvo && regimeSelect) {
    regimeSelect.value = regimeSalvo;
    logger.success(MODULE, 'Regime tributário carregado do perfil', { regime: regimeSalvo });

    const event = new Event('change', { bubbles: true });
    regimeSelect.dispatchEvent(event);
  } else {
    logger.debug(MODULE, 'Nenhum regime salvo no perfil');
  }
}

/**
 * Registra listener do EventBus para atualizar o regime quando o perfil é salvo
 */
function setupPerfilRegimeListener() {
  eventBus.on('perfil:regime-changed', (regime) => {
    const regimeSelect = document.getElementById(ELEMENTS.REGIME);

    if (regime && regimeSelect) {
      regimeSelect.value = regime;
      logger.success(MODULE, 'Regime atualizado via perfil', { regime });

      const event = new Event('change', { bubbles: true });
      regimeSelect.dispatchEvent(event);

      notify.success('Regime Atualizado', `Regime tributário alterado para ${regime}`);
    }
  });
}

/**
 * Inicializa a aplicação
 */
async function initializeApp() {
  try {
    logger.group('🚀 Inicialização da Aplicação');
    logger.time('Tempo total de inicialização');

    await loadHTMLComponents();
    loadAppVersion();
    await initializeData();

    const tributacaoData = getTributacaoData();
    const impostosFederaisData = getImpostosFederaisData();
    const faixasSimplesNacionalData = getFaixasSimplesNacionalData();

    setupPerfilRegimeListener();
    loadRegimeFromPerfil();
    setupCalculationListeners(processCalculation);
    setupTaxUpdateListeners(tributacaoData, impostosFederaisData, faixasSimplesNacionalData, processCalculation);
    setupRegimeVisibilityHandler(processCalculation);
    initializeTheme();
    initializeMenu();
    initializePerfilModal();
    initializeTooltips();
    initializePerformanceOptimizations();
    initializePWA();
    initializeUpdateHandler();

    const footerYear = document.getElementById('footer-year');
    if (footerYear) footerYear.textContent = new Date().getFullYear();
    processCalculation();

    logger.timeEnd('Tempo total de inicialização');
    logger.success(MODULE, 'Aplicação inicializada com sucesso!');
    logger.groupEnd();
    sessionStorage.setItem('app_initialized', 'true');

  } catch (error) {
    logger.groupEnd();
    logger.error(MODULE, 'Falha crítica na inicialização da aplicação', error);

    showFatalError({
      title: 'Erro ao Carregar Aplicação',
      message: 'Não foi possível inicializar a calculadora. Por favor, recarregue a página.',
      technical: error.message,
      action: 'Recarregar Página'
    });
  }
}

/**
 * Exibe mensagem de erro fatal com opção de recarregar
 */
function showFatalError({ title, message, technical, action = 'Recarregar' }) {
  const existingError = document.getElementById('fatal-error-container');
  if (existingError) existingError.remove();

  const errorDiv = document.createElement('div');
  errorDiv.id = 'fatal-error-container';
  errorDiv.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    animation: fadeIn 0.3s ease;
  `;

  errorDiv.innerHTML = `
    <div style="
      background: white;
      border-radius: 12px;
      padding: 32px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      animation: slideUp 0.3s ease;
    ">
      <div style="
        width: 64px; height: 64px;
        background: #fee;
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto 20px;
      ">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
            stroke="#e53935" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 style="margin: 0 0 12px; color: #333; text-align: center; font-size: 24px;">${title}</h2>
      <p style="margin: 0 0 20px; color: #666; text-align: center; line-height: 1.6;">${message}</p>
      ${technical ? `
        <details style="margin: 0 0 20px; padding: 12px; background: #f5f5f5; border-radius: 6px; cursor: pointer;">
          <summary style="color: #666; font-size: 14px;">Detalhes técnicos</summary>
          <pre style="margin: 12px 0 0; padding: 8px; background: white; border-radius: 4px; font-size: 12px; color: #e53935; overflow-x: auto;">${technical}</pre>
        </details>
      ` : ''}
      <button onclick="window.location.reload()" style="
        width: 100%; padding: 14px;
        background: #5aa2ff; color: white;
        border: none; border-radius: 8px;
        font-size: 16px; font-weight: 600;
        cursor: pointer; transition: background 0.2s;
      " onmouseover="this.style.background='#4890ff'" onmouseout="this.style.background='#5aa2ff'">
        ${action}
      </button>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `;
  document.head.appendChild(style);
  document.body.appendChild(errorDiv);

  notify.error(title, message, 0);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

window.addEventListener('error', (event) => {
  logger.error(MODULE, 'Erro não tratado capturado', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

window.addEventListener('unhandledrejection', (event) => {
  logger.error(MODULE, 'Promise rejeitada não tratada', { reason: event.reason });
  event.preventDefault();
});
