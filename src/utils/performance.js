// utils/performance.js

import { logger } from './logger.js';

const MODULE = 'Performance';

/**
 * Adiciona loading="lazy" em imagens
 */
export function addNativeLazyLoading() {
  const images = document.querySelectorAll('img:not([loading])');
  
  images.forEach(img => {
    img.loading = 'lazy';
  });
  
  logger.debug(MODULE, `Loading lazy nativo adicionado a ${images.length} imagens`);
}

/**
 * Observa elementos que podem ter content-visibility
 */
export function initializeContentVisibility() {
  if (!('CSS' in window && CSS.supports('content-visibility', 'auto'))) {
    logger.debug(MODULE, 'content-visibility não suportado');
    return;
  }
  
  const lazyContents = document.querySelectorAll('.result-box, .boxed-section');
  
  lazyContents.forEach(element => {
    element.classList.add('lazy-content');
  });
  
  logger.success(MODULE, `Content visibility ativado para ${lazyContents.length} elementos`);
}

/**
 * Mede Web Vitals
 */
export function measureWebVitals() {
  if (!('PerformanceObserver' in window)) {
    logger.warn(MODULE, 'PerformanceObserver não disponível');
    return;
  }
  
  // Largest Contentful Paint (LCP)
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      logger.info(MODULE, 'LCP (Largest Contentful Paint)', {
        value: `${lastEntry.renderTime || lastEntry.loadTime}ms`,
        element: lastEntry.element
      });
    });
    
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    logger.debug(MODULE, 'LCP não disponível');
  }
  
  // First Input Delay (FID)
  try {
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        logger.info(MODULE, 'FID (First Input Delay)', {
          value: `${entry.processingStart - entry.startTime}ms`
        });
      });
    });
    
    fidObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    logger.debug(MODULE, 'FID não disponível');
  }
  
  // Cumulative Layout Shift (CLS)
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      
      logger.info(MODULE, 'CLS (Cumulative Layout Shift)', {
        value: clsValue.toFixed(4)
      });
    });
    
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    logger.debug(MODULE, 'CLS não disponível');
  }
}

/**
 * Prefetch de recursos importantes
 */
export function prefetchResources() {
  const resources = [
    './data/tributacoes.json',
    './data/impostos_federais.json',
    './data/faixas_simples_nacional.json'
  ];
  
  resources.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
  
  logger.debug(MODULE, `Prefetch configurado para ${resources.length} recursos`);
}

/**
 * Inicializa todas as otimizações de performance
 */
export function initializePerformanceOptimizations() {
  logger.group('⚡ Otimizações de Performance');
  
  addNativeLazyLoading();
  initializeContentVisibility();
  prefetchResources();
  
  // Mede Web Vitals apenas em modo debug
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('debug') === 'true') {
    measureWebVitals();
  }
  
  logger.groupEnd();
}