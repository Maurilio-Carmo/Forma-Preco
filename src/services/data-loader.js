// services/data-loader.js

import { PATHS, ELEMENTS } from '../config/constants.js';

let tributacaoData = [];
let impostosFederaisData = [];
let faixasSimplesNacionalData = [];

/**
 * Carrega os dados de tributação
 */
async function loadTributacoes() {
  try {
    const response = await fetch(PATHS.TRIBUTACOES);
    const data = await response.json();
    tributacaoData = data;
    populateTributacaoSelect(data);
    return data;
  } catch (error) {
    console.error('Erro ao carregar tributações:', error);
    return [];
  }
}

/**
 * Carrega os dados de impostos federais
 */
async function loadImpostosFederais() {
  try {
    const response = await fetch(PATHS.IMPOSTOS_FEDERAIS);
    const data = await response.json();
    impostosFederaisData = data;
    populateImpostosFederaisSelect(data);
    return data;
  } catch (error) {
    console.error('Erro ao carregar impostos federais:', error);
    return [];
  }
}

/**
 * Carrega os dados de faixas do Simples Nacional
 */
async function loadFaixasSimplesNacional() {
  try {
    const response = await fetch(PATHS.FAIXAS_SIMPLES_NACIONAL);
    const data = await response.json();
    faixasSimplesNacionalData = data;
    populateFaixasSimplesNacionalSelect(data);
    return data;
  } catch (error) {
    console.error('Erro ao carregar faixas do Simples Nacional:', error);
    return [];
  }
}

/**
 * Popula o select de tributação
 */
function populateTributacaoSelect(data) {
  const select = document.getElementById(ELEMENTS.TRIBUTACAO);
  select.innerHTML = '<option value="">Selecione...</option>';
  
  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item.tributacao;
    option.textContent = item.tributacao;
    select.appendChild(option);
  });
}

/**
 * Popula o select de impostos federais
 */
function populateImpostosFederaisSelect(data) {
  const select = document.getElementById(ELEMENTS.IMP_FEDERAL);
  select.innerHTML = '<option value="">Selecione...</option>';
  
  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item.imposto_federal;
    option.textContent = item.imposto_federal;
    select.appendChild(option);
  });
}

/**
 * Popula o select de faixas do Simples Nacional
 */
function populateFaixasSimplesNacionalSelect(data) {
  const select = document.getElementById('faixaSimples');
  select.innerHTML = '<option value="">Selecione...</option>';
  data.forEach(item => {
    const option = document.createElement('option');
    option.value = item.faixa;
    option.textContent = item.faixa_descricao;
    select.appendChild(option);
  });
}

/**
 * Inicializa o carregamento de todos os dados
 */
export async function initializeData() {
  await Promise.all([
    loadTributacoes(),
    loadImpostosFederais(),
    loadFaixasSimplesNacional()
  ]);
}

/**
 * Retorna os dados de tributação
 */
export function getTributacaoData() {
  return tributacaoData;
}

/**
 * Retorna os dados de impostos federais
 */
export function getImpostosFederaisData() {
  return impostosFederaisData;
}

/**
 * Retorna os dados de faixas do Simples Nacional
 */
export function getFaixasSimplesNacionalData() {
  return faixasSimplesNacionalData;
}