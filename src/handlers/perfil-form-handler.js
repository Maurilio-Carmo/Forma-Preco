// handlers/perfil-form-handler.js

import { formatCNPJ, formatCEP } from '../utils/formatters.js';
import { consultarCNPJ } from '../services/cnpj-service.js';
import { loadPerfilData, savePerfilData, clearPerfilData } from '../services/perfil-service.js';

/**
 * Preenche o formulário com dados do perfil
 */
export function fillPerfilForm() {
  const data = loadPerfilData();

  if (!data) return;

  document.getElementById('cnpj').value = data.cnpj || '';
  document.getElementById('razaoSocial').value = data.razao_social || '';
  document.getElementById('nomeFantasia').value = data.nome_fantasia || '';
  document.getElementById('cep').value = data.cep || '';
  document.getElementById('uf').value = data.uf || '';
  document.getElementById('municipio').value = data.municipio || '';
  document.getElementById('bairro').value = data.bairro || '';
  document.getElementById('logradouro').value = data.logradouro || '';
  document.getElementById('numero').value = data.numero || '';
  document.getElementById('complemento').value = data.complemento || '';
}

/**
 * Coleta dados do formulário
 */
function getFormData() {
  return {
    cnpj: document.getElementById('cnpj').value,
    razao_social: document.getElementById('razaoSocial').value,
    nome_fantasia: document.getElementById('nomeFantasia').value,
    cep: document.getElementById('cep').value,
    uf: document.getElementById('uf').value,
    municipio: document.getElementById('municipio').value,
    bairro: document.getElementById('bairro').value,
    logradouro: document.getElementById('logradouro').value,
    numero: document.getElementById('numero').value,
    complemento: document.getElementById('complemento').value
  };
}

/**
 * Exibe mensagem de status
 */
function showStatus(message, type = 'info') {
  const statusElement = document.getElementById('cnpjStatus');
  statusElement.textContent = message;
  statusElement.className = `form-helper ${type}`;
}

/**
 * Preenche campos com dados da API
 */
function fillFieldsFromAPI(data) {
  document.getElementById('razaoSocial').value = data.razao_social;
  document.getElementById('nomeFantasia').value = data.nome_fantasia;
  document.getElementById('cep').value = data.cep;
  document.getElementById('uf').value = data.uf;
  document.getElementById('municipio').value = data.municipio;
  document.getElementById('bairro').value = data.bairro;
  document.getElementById('logradouro').value = data.logradouro;
  document.getElementById('numero').value = data.numero;
  document.getElementById('complemento').value = data.complemento;
}

/**
 * Handler para consulta de CNPJ
 */
async function handleConsultarCNPJ() {
  const cnpjInput = document.getElementById('cnpj');
  const consultarBtn = document.getElementById('consultarCNPJ');

  showStatus('Consultando...', 'info');
  consultarBtn.disabled = true;

  try {
    const data = await consultarCNPJ(cnpjInput.value);
    fillFieldsFromAPI(data);
    showStatus('Dados carregados com sucesso!', 'success');
  } catch (error) {
    console.error('Erro ao consultar CNPJ:', error);
    showStatus(error.message || 'Erro ao consultar CNPJ', 'error');
  } finally {
    consultarBtn.disabled = false;
  }
}

/**
 * Handler para submit do formulário
 */
function handleFormSubmit(e, onSuccess) {
  e.preventDefault();

  const formData = getFormData();

  if (savePerfilData(formData)) {
    showStatus('Dados salvos com sucesso!', 'success');
    
    setTimeout(() => {
      if (onSuccess) onSuccess();
      showStatus('', 'info');
    }, 1000);
  } else {
    showStatus('Erro ao salvar os dados', 'error');
  }
}

/**
 * Handler para limpar os dados do perfil
 */

function handleClearPerfil() {
  clearPerfilData();

  document.getElementById('perfilForm')?.reset();

  showStatus('Dados do perfil limpos.', 'success');
}

/**
 * Inicializa eventos do formulário de perfil
 */
export function initializePerfilForm(onSuccess) {
  const cnpjInput = document.getElementById('cnpj');
  const cepInput = document.getElementById('cep');
  const consultarBtn = document.getElementById('consultarCNPJ');
  const perfilForm = document.getElementById('perfilForm');
  const perfilLimpar = document.getElementById('perfilLimpar');

  // Formatação automática
  cnpjInput?.addEventListener('input', (e) => {
    e.target.value = formatCNPJ(e.target.value);
  });

  cepInput?.addEventListener('input', (e) => {
    e.target.value = formatCEP(e.target.value);
  });

  // Consulta CNPJ
  consultarBtn?.addEventListener('click', handleConsultarCNPJ);

  // Submit do formulário
  perfilForm?.addEventListener('submit', (e) => handleFormSubmit(e, onSuccess));

  // Limpar formulário
  perfilLimpar?.addEventListener('click', handleClearPerfil);
}