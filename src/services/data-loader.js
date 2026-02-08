// services/data-loader.js

import { PATHS, ELEMENTS } from '../config/constants.js';
import { logger } from '../utils/logger.js';
import { notify } from '../utils/notifications.js';

const MODULE = 'DataLoader';

let tributacaoData = [];
let impostosFederaisData = [];
let faixasSimplesNacionalData = [];

/**
 * Carrega JSON com tratamento de erros
 */
async function loadJSON(path, dataName) {
  try {
    logger.debug(MODULE, `Carregando ${dataName}`, { path });
    
    const response = await fetch(path);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) {
      throw new Error('Dados retornados não são um array');
    }
    
    if (data.length === 0) {
      logger.warn(MODULE, `${dataName} está vazio`, { path });
    }
    
    logger.success(MODULE, `${dataName} carregado`, {
      path,
      items: data.length
    });
    
    return data;
    
  } catch (error) {
    logger.error(
      MODULE,
      `Falha ao carregar ${dataName}`,
      {
        path,
        error: error.message,
        stack: error.stack
      }
    );
    
    throw new Error(`Erro ao carregar ${dataName}: ${error.message}`);
  }
}

/**
 * Carrega os dados de tributação
 */
async function loadTributacoes() {
  try {
    const data = await loadJSON(PATHS.TRIBUTACOES, 'tributações');
    tributacaoData = data;
    populateTributacaoSelect(data);
    return data;
  } catch (error) {
    notify.error(
      'Erro ao Carregar Tributações',
      'Não foi possível carregar as opções de tributação. Algumas funcionalidades podem não funcionar.'
    );
    return [];
  }
}

/**
 * Carrega os dados de impostos federais
 */
async function loadImpostosFederais() {
  try {
    const data = await loadJSON(PATHS.IMPOSTOS_FEDERAIS, 'impostos federais');
    impostosFederaisData = data;
    populateImpostosFederaisSelect(data);
    return data;
  } catch (error) {
    notify.error(
      'Erro ao Carregar Impostos Federais',
      'Não foi possível carregar as opções de impostos federais.'
    );
    return [];
  }
}

/**
 * Carrega os dados de faixas do Simples Nacional
 */
async function loadFaixasSimplesNacional() {
  try {
    const data = await loadJSON(PATHS.FAIXAS_SIMPLES_NACIONAL, 'faixas do Simples Nacional');
    faixasSimplesNacionalData = data;
    populateFaixasSimplesNacionalSelect(data);
    return data;
  } catch (error) {
    notify.error(
      'Erro ao Carregar Faixas do Simples',
      'Não foi possível carregar as faixas do Simples Nacional.'
    );
    return [];
  }
}

/**
 * Popula o select de tributação
 */
function populateTributacaoSelect(data) {
  const select = document.getElementById(ELEMENTS.TRIBUTACAO);
  
  if (!select) {
    logger.warn(MODULE, 'Select de tributação não encontrado no DOM');
    return;
  }
  
  select.innerHTML = '<option value="">Selecione...</option>';
  
  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item.tributacao;
    option.textContent = item.tributacao;
    select.appendChild(option);
  });
  
  logger.debug(MODULE, `Select de tributação populado com ${data.length} opções`);
}

/**
 * Popula o select de impostos federais
 */
function populateImpostosFederaisSelect(data) {
  const select = document.getElementById(ELEMENTS.IMP_FEDERAL);
  
  if (!select) {
    logger.warn(MODULE, 'Select de impostos federais não encontrado no DOM');
    return;
  }
  
  select.innerHTML = '<option value="">Selecione...</option>';
  
  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item.imposto_federal;
    option.textContent = item.imposto_federal;
    select.appendChild(option);
  });
  
  logger.debug(MODULE, `Select de impostos federais populado com ${data.length} opções`);
}

/**
 * Popula o select de faixas do Simples Nacional
 */
function populateFaixasSimplesNacionalSelect(data) {
  const select = document.getElementById('faixaSimples');
  
  if (!select) {
    logger.warn(MODULE, 'Select de faixas do Simples não encontrado no DOM');
    return;
  }
  
  select.innerHTML = '<option value="">Selecione...</option>';
  
  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item.faixa;
    option.textContent = item.faixa_descricao;
    select.appendChild(option);
  });
  
  logger.debug(MODULE, `Select de faixas do Simples populado com ${data.length} opções`);
}

/**
 * Inicializa o carregamento de todos os dados
 */
export async function initializeData() {
  logger.group('📊 Carregamento de Dados de Tributação');
  logger.time('Carregamento de dados');
  
  try {
    const results = await Promise.allSettled([
      loadTributacoes(),
      loadImpostosFederais(),
      loadFaixasSimplesNacional()
    ]);
    
    // Verifica se algum carregamento falhou
    const failures = results.filter(r => r.status === 'rejected');
    
    if (failures.length > 0) {
      logger.warn(
        MODULE,
        `${failures.length} de 3 carregamentos falharam`,
        { failures }
      );
    }
    
    // Verifica se pelo menos alguns dados foram carregados
    const hasData = 
      tributacaoData.length > 0 ||
      impostosFederaisData.length > 0 ||
      faixasSimplesNacionalData.length > 0;
    
    if (!hasData) {
      throw new Error('Nenhum dado de tributação pôde ser carregado');
    }
    
    logger.timeEnd('Carregamento de dados');
    logger.success(MODULE, 'Dados de tributação carregados', {
      tributacoes: tributacaoData.length,
      impostosFederais: impostosFederaisData.length,
      faixasSimples: faixasSimplesNacionalData.length
    });
    logger.groupEnd();
    
  } catch (error) {
    logger.timeEnd('Carregamento de dados');
    logger.groupEnd();
    logger.error(MODULE, 'Falha crítica no carregamento de dados', error);
    
    notify.error(
      'Erro Crítico',
      'Não foi possível carregar os dados necessários. A aplicação pode não funcionar corretamente.',
      0 // não desaparece automaticamente
    );
    
    throw error;
  }
}

/**
 * Retorna os dados de tributação
 */
export function getTributacaoData() {
  if (tributacaoData.length === 0) {
    logger.warn(MODULE, 'Tentativa de acessar dados de tributação vazios');
  }
  return tributacaoData;
}

/**
 * Retorna os dados de impostos federais
 */
export function getImpostosFederaisData() {
  if (impostosFederaisData.length === 0) {
    logger.warn(MODULE, 'Tentativa de acessar dados de impostos federais vazios');
  }
  return impostosFederaisData;
}

/**
 * Retorna os dados de faixas do Simples Nacional
 */
export function getFaixasSimplesNacionalData() {
  if (faixasSimplesNacionalData.length === 0) {
    logger.warn(MODULE, 'Tentativa de acessar dados de faixas do Simples vazios');
  }
  return faixasSimplesNacionalData;
}