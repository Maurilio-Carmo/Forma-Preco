// src/utils/component-loader.js

import { logger } from './logger.js';

/**
 * Template de skeleton para loading
 */
const SKELETON_TEMPLATES = {
  default: '<div class="skeleton skeleton-card"></div>',
  header: '<div class="skeleton" style="height: 80px;"></div>',
  panel: '<div class="loading-container"><div class="skeleton skeleton-input"></div><div class="skeleton skeleton-input"></div><div class="skeleton skeleton-input"></div></div>',
  sidebar: '<div class="loading-container"><div class="skeleton skeleton-highlight"></div><div class="skeleton skeleton-highlight"></div></div>'
};

/**
 * Carrega um componente HTML externo e injeta no elemento especificado
 */
export async function loadComponent(elementId, componentPath, skeletonType = 'default') {
  const MODULE = 'ComponentLoader';
  
  try {
    logger.debug(MODULE, `Iniciando carregamento: ${componentPath} → #${elementId}`);
    
    const element = document.getElementById(elementId);
    
    if (!element) {
      logger.warn(MODULE, `Elemento de destino não encontrado no DOM`, { elementId });
      return;
    }
    
    // Mostra skeleton durante carregamento
    element.innerHTML = SKELETON_TEMPLATES[skeletonType] || SKELETON_TEMPLATES.default;
    
    const response = await fetch(componentPath);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    
    // Aplica fade-in ao trocar conteúdo
    element.classList.add('fade-in');
    element.innerHTML = html;
    
    logger.success(MODULE, `Componente carregado`, {
      path: componentPath,
      target: `#${elementId}`
    });
    
  } catch (error) {
    logger.error(MODULE, `Falha ao carregar: ${componentPath}`, error);
    throw error;
  }
}

/**
 * Carrega múltiplos componentes em paralelo
 */
export async function loadComponents(components) {
  const MODULE = 'ComponentLoader';
  
  logger.info(MODULE, `Carregando ${components.length} componentes em paralelo`);
  logger.time('Carregamento de componentes');
  
  const promises = components.map(({ id, path, skeleton }) => 
    loadComponent(id, path, skeleton)
  );
  
  try {
    await Promise.all(promises);
    logger.timeEnd('Carregamento de componentes');
    logger.success(MODULE, 'Todos os componentes carregados');
  } catch (error) {
    logger.timeEnd('Carregamento de componentes');
    logger.error(MODULE, 'Erro ao carregar componentes', error);
    throw error;
  }
}