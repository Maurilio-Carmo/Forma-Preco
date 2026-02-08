// src/utils/component-loader.js

import { logger } from './logger.js';

/**
 * Carrega um componente HTML externo e injeta no elemento especificado
 * @param {string} elementId - ID do elemento onde o componente será injetado
 * @param {string} componentPath - Caminho do arquivo HTML do componente
 * @returns {Promise<void>}
 */
export async function loadComponent(elementId, componentPath) {
  const MODULE = 'ComponentLoader';
  
  try {
    logger.debug(MODULE, `Iniciando carregamento: ${componentPath} → #${elementId}`);
    
    const response = await fetch(componentPath);
    
    if (!response.ok) {
      const error = new Error(
        `Falha ao carregar componente. Status HTTP: ${response.status}`
      );
      error.componentPath = componentPath;
      error.httpStatus = response.status;
      throw error;
    }
    
    const html = await response.text();
    const element = document.getElementById(elementId);
    
    if (!element) {
      logger.warn(
        MODULE,
        `Elemento de destino não encontrado no DOM`,
        { elementId, componentPath }
      );
      return;
    }
    
    element.innerHTML = html;
    logger.success(MODULE, `Componente carregado com sucesso`, {
      path: componentPath,
      target: `#${elementId}`,
      size: `${html.length} caracteres`
    });
    
  } catch (error) {
    logger.error(
      MODULE,
      `Falha ao carregar componente: ${componentPath}`,
      error
    );
    throw error; // Re-lança o erro para que initializeApp possa capturá-lo
  }
}

/**
 * Carrega múltiplos componentes em paralelo
 * @param {Array<{id: string, path: string}>} components - Array de objetos com id e path
 * @returns {Promise<void>}
 */
export async function loadComponents(components) {
  const MODULE = 'ComponentLoader';
  
  logger.info(MODULE, `Carregando ${components.length} componentes em paralelo`);
  logger.time('Carregamento de componentes');
  
  const promises = components.map(({ id, path }) => 
    loadComponent(id, path)
  );
  
  try {
    await Promise.all(promises);
    logger.timeEnd('Carregamento de componentes');
    logger.success(MODULE, `Componentes carregados com sucesso`);
  } catch (error) {
    logger.timeEnd('Carregamento de componentes');
    logger.error(MODULE, 'Erro ao carregar componentes', error);
    throw error;
  }
}

/**
 * Carrega componentes sequencialmente (útil se houver dependências)
 * @param {Array<{id: string, path: string}>} components - Array de objetos com id e path
 * @returns {Promise<void>}
 */
export async function loadComponentsSequential(components) {
  const MODULE = 'ComponentLoader';
  
  logger.info(MODULE, `Carregando ${components.length} componentes sequencialmente`);
  logger.time('Carregamento sequencial');
  
  try {
    for (const { id, path } of components) {
      await loadComponent(id, path);
    }
    logger.timeEnd('Carregamento sequencial');
    logger.success(MODULE, `Componentes sequenciais carregados com sucesso`);
  } catch (error) {
    logger.timeEnd('Carregamento sequencial');
    logger.error(MODULE, 'Erro no carregamento sequencial', error);
    throw error;
  }
}