// handlers/perfil-form-handler.js

import { formatCNPJ, formatCEP } from '../utils/formatters.js';
import { consultarCNPJ, getCNPJErrorMessage } from '../services/cnpj-service.js';
import { loadPerfilData, savePerfilData, clearPerfilData } from '../services/perfil-service.js';
import { logger } from '../utils/logger.js';
import { notify } from '../utils/notifications.js';

const MODULE = 'PerfilFormHandler';

/**
 * Preenche o formulário com dados do perfil
 */
export function fillPerfilForm() {
  const data = loadPerfilData();

  if (!data) {
    logger.debug(MODULE, 'Nenhum dado de perfil encontrado para preencher');
    return;
  }

  logger.info(MODULE, 'Preenchendo formulário com dados salvos');

  try {
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

    // Atualiza opções do regime baseado no que está salvo
    if (data.opcao_pelo_simples === true) {
      updateRegimeOptions(true);
    } else if (data.regime) {
      updateRegimeOptions(false);
      document.getElementById('regimePerfil').value = data.regime;
    }

    logger.success(MODULE, 'Formulário preenchido com sucesso', {
      cnpj: data.cnpj,
      regime: data.regime
    });
  } catch (error) {
    logger.error(MODULE, 'Erro ao preencher formulário', error);
    notify.error(
      'Erro ao Carregar Perfil',
      'Não foi possível preencher os dados salvos'
    );
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
 * Atualiza opções do select de regime baseado na opção pelo Simples
 * @param {boolean} isOptanteSimples - Se a empresa é optante pelo Simples
 */
function updateRegimeOptions(isOptanteSimples) {
  const regimeSelect = document.getElementById('regimePerfil');
  const regimeHelper = document.getElementById('regimeHelper');

  if (!regimeSelect || !regimeHelper) {
    logger.warn(MODULE, 'Elementos de regime não encontrados no DOM');
    return;
  }

  if (isOptanteSimples) {
    regimeSelect.innerHTML = `
      <option value="Simples" selected>Simples Nacional</option>
    `;
    regimeSelect.disabled = true;
    regimeHelper.textContent = 'Empresa optante pelo Simples Nacional';
    regimeHelper.className = 'form-helper success';
    
    logger.info(MODULE, 'Regime definido como Simples Nacional (optante)');
  } else {
    const currentValue = regimeSelect.value;
    
    regimeSelect.innerHTML = `
      <option value="">Selecione...</option>
      <option value="Real">Lucro Real</option>
      <option value="Presumido">Lucro Presumido</option>
    `;
    regimeSelect.disabled = false;
    
    if (currentValue === 'Real' || currentValue === 'Presumido') {
      regimeSelect.value = currentValue;
    }
    
    regimeHelper.textContent = 'Selecione o regime tributário da empresa';
    regimeHelper.className = 'form-helper info';
    
    logger.info(MODULE, 'Opções de regime atualizadas (não optante pelo Simples)');
  }
}

/**
 * Preenche campos com dados da API
 */
function fillFieldsFromAPI(data) {
  logger.info(MODULE, 'Preenchendo campos com dados da API');

  try {
    document.getElementById('razaoSocial').value = data.razao_social;
    document.getElementById('nomeFantasia').value = data.nome_fantasia;
    document.getElementById('cep').value = data.cep;
    document.getElementById('uf').value = data.uf;
    document.getElementById('logradouro').value = data.logradouro;
    document.getElementById('numero').value = data.numero;
    document.getElementById('bairro').value = data.bairro;
    document.getElementById('municipio').value = data.municipio;
    document.getElementById('complemento').value = data.complemento;

    updateRegimeOptions(data.opcao_pelo_simples);
    
    if (data.regime) {
      document.getElementById('regimePerfil').value = data.regime;
    }

    logger.success(MODULE, 'Campos preenchidos com dados da API');
  } catch (error) {
    logger.error(MODULE, 'Erro ao preencher campos da API', error);
    throw error;
  }
}

/**
 * Handler para consulta de CNPJ
 */
async function handleConsultarCNPJ() {
  const cnpjInput = document.getElementById('cnpj');
  const consultarBtn = document.getElementById('consultarCNPJ');

  if (!cnpjInput || !consultarBtn) {
    logger.error(MODULE, 'Elementos de CNPJ não encontrados');
    return;
  }

  const cnpj = cnpjInput.value;
  
  if (!cnpj) {
    notify.warning('CNPJ Vazio', 'Digite um CNPJ para realizar a consulta');
    return;
  }

  logger.info(MODULE, 'Iniciando consulta de CNPJ', { cnpj });
  
  consultarBtn.disabled = true;

  // Mostra loading
  const loading = notify.loading(
    'Consultando CNPJ',
    'Buscando dados na Receita Federal...'
  );

  try {
    const data = await consultarCNPJ(cnpj);
    
    fillFieldsFromAPI(data);
    
    loading.close();
    notify.success(
      'CNPJ Consultado',
      `Dados de ${data.razao_social} carregados com sucesso!`
    );
    
  } catch (error) {
    const userMessage = getCNPJErrorMessage(error);
    
    loading.close();
    
    notify.error(
      'Erro na Consulta',
      userMessage
    );
    
    logger.error(MODULE, 'Falha na consulta de CNPJ', error);
    
  } finally {
    consultarBtn.disabled = false;
  }
}

/**
 * Handler para submit do formulário
 */
function handleFormSubmit(e, onSuccess) {
  e.preventDefault();

  logger.info(MODULE, 'Iniciando salvamento do perfil');

  const formData = getFormData();

  // Valida se regime foi selecionado
  if (!formData.regime) {
    notify.warning(
      'Regime Não Selecionado',
      'Por favor, selecione o regime tributário da empresa'
    );
    return;
  }

  // Valida campos obrigatórios
  if (!formData.cnpj || !formData.razao_social) {
    notify.warning(
      'Campos Obrigatórios',
      'CNPJ e Razão Social são campos obrigatórios'
    );
    return;
  }

  logger.debug(MODULE, 'Dados do formulário coletados', {
    cnpj: formData.cnpj,
    razaoSocial: formData.razao_social,
    regime: formData.regime
  });

  if (savePerfilData(formData)) {
    logger.success(MODULE, 'Perfil salvo com sucesso', {
      cnpj: formData.cnpj,
      regime: formData.regime
    });
    
    notify.success(
      'Perfil Salvo',
      'Os dados da sua loja foram salvos com sucesso!'
    );
    
    // Atualiza o regime do calculador se houver callback
    if (window.updateRegimeFromPerfil) {
      window.updateRegimeFromPerfil(formData.regime);
    }
    
    setTimeout(() => {
      if (onSuccess) onSuccess();
    }, 1500);
  } else {
    logger.error(MODULE, 'Falha ao salvar perfil');
    
    notify.error(
      'Erro ao Salvar',
      'Não foi possível salvar os dados. Tente novamente.'
    );
  }
}

/**
 * Handler para limpar os dados do perfil
 */
function handleClearPerfil() {
  logger.info(MODULE, 'Limpando dados do perfil');

  if (!confirm('Tem certeza que deseja limpar todos os dados do perfil?')) {
    logger.debug(MODULE, 'Limpeza cancelada pelo usuário');
    return;
  }

  clearPerfilData();

  document.getElementById('perfilForm')?.reset();
  
  // Restaura opções padrão do regime
  const regimeSelect = document.getElementById('regimePerfil');
  if (regimeSelect) {
    regimeSelect.innerHTML = `<option value=""></option>`;
    regimeSelect.disabled = false;
  }

  const regimeHelper = document.getElementById('regimeHelper');
  if (regimeHelper) {
    regimeHelper.textContent = 'O regime será definido após consultar o CNPJ';
    regimeHelper.className = 'form-helper info';
  }

  logger.success(MODULE, 'Perfil limpo com sucesso');
  
  notify.info(
    'Perfil Limpo',
    'Todos os dados foram removidos com sucesso'
  );
}

/**
 * Inicializa eventos do formulário de perfil
 */
export function initializePerfilForm(onSuccess) {
  logger.info(MODULE, 'Inicializando formulário de perfil');

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

  logger.success(MODULE, 'Formulário de perfil inicializado com sucesso');
}