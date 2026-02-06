// src/utils/component-loader.js

/**
 * Carrega um componente HTML externo e injeta no elemento especificado
 * @param {string} elementId - ID do elemento onde o componente será injetado
 * @param {string} componentPath - Caminho do arquivo HTML do componente
 * @returns {Promise<void>}
 */
export async function loadComponent(elementId, componentPath) {
  try {
    const response = await fetch(componentPath);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${componentPath}`);
    }
    
    const html = await response.text();
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.warn(`⚠️ Elemento #${elementId} não encontrado no DOM`);
      return;
    }
    
    element.innerHTML = html;
    console.log(`✅ Componente carregado: ${componentPath} → #${elementId}`);
    
  } catch (error) {
    console.error(`❌ Erro ao carregar componente ${componentPath}:`, error);
    throw error; // Re-lança o erro para que initializeApp possa capturá-lo
  }
}

/**
 * Carrega múltiplos componentes em paralelo
 * @param {Array<{id: string, path: string}>} components - Array de objetos com id e path
 * @returns {Promise<void>}
 */
export async function loadComponents(components) {
  const promises = components.map(({ id, path }) => 
    loadComponent(id, path)
  );
  
  await Promise.all(promises);
}

/**
 * Carrega componentes sequencialmente (útil se houver dependências)
 * @param {Array<{id: string, path: string}>} components - Array de objetos com id e path
 * @returns {Promise<void>}
 */
export async function loadComponentsSequential(components) {
  for (const { id, path } of components) {
    await loadComponent(id, path);
  }
}