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
  document.getElementById('logradouro').value = data.logradouro || '';
  document.getElementById('numero').value = data.numero || '';
  document.getElementById('bairro').value = data.bairro || '';
  document.getElementById('municipio').value = data.municipio || '';
  document.getElementById('complemento').value = data.complemento || '';
  document.getElementById('regimePerfil').value = data.regime || '';

  // Atualiza opções do regime baseado no que está salvo
  if (data.opcao_pelo_simples === true) {
    updateRegimeOptions(true);
  } else if (data.regime) {
    updateRegimeOptions(false);
  }
}

/**
 * Coleta dados do formulário
 */
function getFormData() {
  const regime = document.getElementById('regimePerfil').value;
  const opcaoPeloSimples = regime === 'Simples';

  return {
    cnpj: document.getElementById('cnpj').value,
    razao_social: document.getElementById('razaoSocial').value,
    nome_fantasia: document.getElementById('nomeFantasia').value,
    cep: document.getElementById('cep').value,
    uf: document.getElementById('uf').value,
    logradouro: document.getElementById('logradouro').value,
    numero: document.getElementById('numero').value,
    bairro: document.getElementById('bairro').value,
    municipio: document.getElementById('municipio').value,
    complemento: document.getElementById('complemento').value,
    regime: regime,
    opcao_pelo_simples: opcaoPeloSimples
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
 * Atualiza opções do select de regime baseado na opção pelo Simples
 * @param {boolean} isOptanteSimples - Se a empresa é optante pelo Simples
 */
function updateRegimeOptions(isOptanteSimples) {
  const regimeSelect = document.getElementById('regimePerfil');
  const regimeHelper = document.getElementById('regimeHelper');

  if (isOptanteSimples) {
    // Optante pelo Simples: mostra apenas Simples Nacional
    regimeSelect.innerHTML = `
      <option value="Simples" selected>Simples Nacional</option>
    `;
    regimeSelect.disabled = true;
    regimeHelper.textContent = 'Empresa optante pelo Simples Nacional';
    regimeHelper.className = 'form-helper success';
  } else {
    // Não optante: mostra Lucro Real e Presumido
    regimeSelect.innerHTML = `
      <option value="">Selecione...</option>
      <option value="Real">Lucro Real</option>
      <option value="Presumido">Lucro Presumido</option>
    `;
    regimeSelect.disabled = false;
    regimeHelper.textContent = 'Selecione o regime tributário da empresa';
    regimeHelper.className = 'form-helper info';
  }
}

/**
 * Preenche campos com dados da API
 */
function fillFieldsFromAPI(data) {
  document.getElementById('razaoSocial').value = data.razao_social;
  document.getElementById('nomeFantasia').value = data.nome_fantasia;
  document.getElementById('cep').value = data.cep;
  document.getElementById('uf').value = data.uf;
  document.getElementById('logradouro').value = data.logradouro;
  document.getElementById('numero').value = data.numero;
  document.getElementById('bairro').value = data.bairro;
  document.getElementById('municipio').value = data.municipio;
  document.getElementById('complemento').value = data.complemento;

  // Atualiza o regime baseado na opção pelo Simples
  updateRegimeOptions(data.opcao_pelo_simples);
  
  if (data.regime) {
    document.getElementById('regimePerfil').value = data.regime;
  }
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
    
    // Atualiza o regime do calculador se houver callback
    if (window.updateRegimeFromPerfil) {
      window.updateRegimeFromPerfil(formData.regime);
    }
    
    setTimeout(() => {
      if (onSuccess) onSuccess();
      showStatus('', 'info');
    }, 2000);
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
  
  // Restaura opções padrão do regime
  const regimeSelect = document.getElementById('regimePerfil');
  regimeSelect.innerHTML = `
    <option value=""></option>
  `;
  regimeSelect.disabled = false;

  const regimeHelper = document.getElementById('regimeHelper');
  regimeHelper.textContent = 'O regime será definido após consultar o CNPJ';
  regimeHelper.className = 'form-helper info';

  showStatus('Dados do perfil limpos.', 'success');

  setTimeout(() => {
    showStatus('', 'info');
  }, 2000);
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