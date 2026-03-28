// services/perfil-service.js

import { STORAGE_KEYS } from '../config/constants.js';
import { logger } from '../utils/logger.js';

const MODULE = 'PerfilService';

/**
 * Carrega dados do perfil do localStorage
 * @returns {Object|null} - Dados do perfil ou null se não existir
 */
export function loadPerfilData() {
  try {
    const perfilData = localStorage.getItem(STORAGE_KEYS.PERFIL);

    if (!perfilData) {
      logger.debug(MODULE, 'Nenhum perfil salvo encontrado');
      return null;
    }

    const parsedData = JSON.parse(perfilData);
    
    logger.success(MODULE, 'Perfil carregado com sucesso', {
      hasCnpj: !!parsedData.cnpj,
      regime: parsedData.regime,
      hasRazaoSocial: !!parsedData.razao_social
    });
    
    return parsedData;
    
  } catch (error) {
    logger.error(MODULE, 'Erro ao carregar dados do perfil do localStorage', {
      error: error.message,
      stack: error.stack
    });
    
    // Se os dados estão corrompidos, limpa o localStorage
    try {
      localStorage.removeItem(STORAGE_KEYS.PERFIL);
      logger.warn(MODULE, 'Dados corrompidos foram removidos do localStorage');
    } catch (cleanError) {
      logger.error(MODULE, 'Erro ao limpar dados corrompidos', cleanError);
    }
    
    return null;
  }
}

/**
 * Salva dados do perfil no localStorage
 * @param {Object} data - Dados do perfil para salvar
 * @returns {boolean} - true se salvou com sucesso, false caso contrário
 */
export function savePerfilData(data) {
  try {
    // Valida dados essenciais
    if (!data || typeof data !== 'object') {
      throw new Error('Dados inválidos para salvar');
    }
    
    if (!data.cnpj || !data.razao_social || !data.regime) {
      throw new Error('Dados obrigatórios faltando (cnpj, razao_social, regime)');
    }
    
    const jsonData = JSON.stringify(data);
    
    // Verifica tamanho dos dados (limite típico do localStorage é 5-10MB)
    const sizeInKB = new Blob([jsonData]).size / 1024;
    if (sizeInKB > 100) {
      logger.warn(MODULE, `Dados do perfil são grandes (${sizeInKB.toFixed(2)} KB)`);
    }
    
    localStorage.setItem(STORAGE_KEYS.PERFIL, jsonData);
    
    logger.success(MODULE, 'Perfil salvo com sucesso', {
      hasCnpj: !!data.cnpj,
      hasRazaoSocial: !!data.razao_social,
      regime: data.regime,
      size: `${sizeInKB.toFixed(2)} KB`
    });
    
    return true;
    
  } catch (error) {
    logger.error(MODULE, 'Erro ao salvar dados do perfil', {
      error: error.message,
      stack: error.stack,
      data: data
    });
    
    // Verifica se é erro de quota excedida
    if (error.name === 'QuotaExceededError') {
      logger.error(MODULE, 'Quota do localStorage excedida', {
        recommendation: 'Limpe dados antigos ou reduza o tamanho dos dados'
      });
    }
    
    return false;
  }
}

/**
 * Limpa dados do perfil
 * @returns {boolean} - true se limpou com sucesso, false caso contrário
 */
export function clearPerfilData() {
  try {
    const hadData = localStorage.getItem(STORAGE_KEYS.PERFIL) !== null;
    
    localStorage.removeItem(STORAGE_KEYS.PERFIL);
    
    if (hadData) {
      logger.success(MODULE, 'Perfil limpo com sucesso');
    } else {
      logger.debug(MODULE, 'Nenhum perfil para limpar');
    }
    
    return true;
    
  } catch (error) {
    logger.error(MODULE, 'Erro ao limpar dados do perfil', {
      error: error.message,
      stack: error.stack
    });
    return false;
  }
}

/**
 * Obtém o regime tributário do perfil
 * @returns {string|null} - Regime tributário salvo ou null
 */
export function getRegimeTributario() {
  try {
    const perfilData = loadPerfilData();
    
    if (!perfilData) {
      return null;
    }
    
    const regime = perfilData.regime || null;
    
    if (regime) {
      logger.debug(MODULE, 'Regime tributário obtido', { regime });
    } else {
      logger.debug(MODULE, 'Perfil existe mas não tem regime definido');
    }
    
    return regime;
    
  } catch (error) {
    logger.error(MODULE, 'Erro ao obter regime tributário', error);
    return null;
  }
}

/**
 * Verifica se a empresa é optante pelo Simples Nacional
 * @returns {boolean}
 */
export function isOptanteSimples() {
  try {
    const perfilData = loadPerfilData();
    
    if (!perfilData) {
      return false;
    }
    
    const isOptante = perfilData.opcao_pelo_simples === true;
    
    logger.debug(MODULE, 'Verificação de optante pelo Simples', { isOptante });
    
    return isOptante;
    
  } catch (error) {
    logger.error(MODULE, 'Erro ao verificar opção pelo Simples', error);
    return false;
  }
}

/**
 * Valida integridade dos dados do perfil
 * @returns {Object} - { valid: boolean, issues: string[] }
 */
export function validatePerfilData() {
  const issues = [];
  const perfilData = loadPerfilData();
  
  if (!perfilData) {
    return { valid: false, issues: ['Nenhum perfil salvo'] };
  }
  
  // Campos obrigatórios
  if (!perfilData.cnpj) issues.push('CNPJ ausente');
  if (!perfilData.razao_social) issues.push('Razão social ausente');
  if (!perfilData.regime) issues.push('Regime tributário ausente');
  
  // Validação de CNPJ (formato básico)
  if (perfilData.cnpj) {
    const cnpjNumeros = perfilData.cnpj.replace(/\D/g, '');
    if (cnpjNumeros.length !== 14) {
      issues.push('CNPJ com formato inválido');
    }
  }
  
  // Validação de regime
  const regimesValidos = ['Real', 'Presumido', 'Simples'];
  if (perfilData.regime && !regimesValidos.includes(perfilData.regime)) {
    issues.push('Regime tributário inválido');
  }
  
  const valid = issues.length === 0;
  
  if (!valid) {
    logger.warn(MODULE, 'Dados do perfil possuem problemas', { issues });
  } else {
    logger.debug(MODULE, 'Dados do perfil válidos');
  }
  
  return { valid, issues };
}

/**
 * Retorna estatísticas do perfil
 * @returns {Object|null} - Estatísticas ou null
 */
export function getPerfilStats() {
  try {
    const perfilData = loadPerfilData();
    
    if (!perfilData) {
      return null;
    }
    
    const stats = {
      hasData: true,
      fieldsCount: Object.keys(perfilData).length,
      filledFields: Object.values(perfilData).filter(v => v !== '' && v !== null && v !== undefined).length,
      regime: perfilData.regime,
      isOptanteSimples: perfilData.opcao_pelo_simples === true,
      hasAddress: !!(perfilData.logradouro && perfilData.municipio),
      completeness: 0
    };
    
    stats.completeness = ((stats.filledFields / stats.fieldsCount) * 100).toFixed(0);
    
    logger.debug(MODULE, 'Estatísticas do perfil', stats);
    
    return stats;
    
  } catch (error) {
    logger.error(MODULE, 'Erro ao obter estatísticas do perfil', error);
    return null;
  }
}