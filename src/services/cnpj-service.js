// services/cnpj-service.js

import { removeFormatting, formatCEP } from '../utils/formatters.js';
import { logger } from '../utils/logger.js';

const MODULE = 'CNPJService';
const API_URL = 'https://brasilapi.com.br/api/cnpj/v1/';
const TIMEOUT_MS = 10000; // 10 segundos

/**
 * Classe personalizada para erros de CNPJ
 */
class CNPJError extends Error {
  constructor(message, type, details = {}) {
    super(message);
    this.name = 'CNPJError';
    this.type = type;
    this.details = details;
  }
}

/**
 * Valida formato do CNPJ
 */
function validateCNPJFormat(cnpj) {
  const cnpjLimpo = removeFormatting(cnpj);
  
  if (!cnpjLimpo) {
    throw new CNPJError(
      'CNPJ não pode estar vazio',
      'VALIDATION_ERROR',
      { cnpj }
    );
  }
  
  if (cnpjLimpo.length !== 14) {
    throw new CNPJError(
      `CNPJ deve ter 14 dígitos (fornecido: ${cnpjLimpo.length})`,
      'VALIDATION_ERROR',
      { cnpj, length: cnpjLimpo.length }
    );
  }
  
  // Verifica se todos são o mesmo dígito (ex: 11111111111111)
  if (/^(\d)\1+$/.test(cnpjLimpo)) {
    throw new CNPJError(
      'CNPJ inválido: todos os dígitos são iguais',
      'VALIDATION_ERROR',
      { cnpj }
    );
  }

  // Valida dígitos verificadores
  if (!validateCNPJDigits(cnpjLimpo)) {
    throw new CNPJError(
      'CNPJ inválido: dígitos verificadores incorretos',
      'VALIDATION_ERROR',
      { cnpj }
    );
  }

  return cnpjLimpo;
}

/**
 * Valida os dois dígitos verificadores do CNPJ
 * @param {string} cnpj - CNPJ com 14 dígitos (apenas números)
 * @returns {boolean}
 */
function validateCNPJDigits(cnpj) {
  const calcDigit = (digits, weights) => {
    const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const digits = cnpj.split('').map(Number);
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const d1 = calcDigit(digits.slice(0, 12), weights1);
  if (d1 !== digits[12]) return false;

  const d2 = calcDigit(digits.slice(0, 13), weights2);
  return d2 === digits[13];
}

/**
 * Faz requisição com timeout
 */
async function fetchWithTimeout(url, timeout = TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new CNPJError(
        'Tempo de consulta esgotado. Verifique sua conexão.',
        'TIMEOUT_ERROR',
        { url, timeout }
      );
    }
    throw error;
  }
}

/**
 * Consulta dados do CNPJ na BrasilAPI
 * @param {string} cnpj - CNPJ para consulta (com ou sem formatação)
 * @returns {Promise<Object>} - Dados formatados da empresa
 */
export async function consultarCNPJ(cnpj) {
  logger.info(MODULE, 'Iniciando consulta de CNPJ', { cnpj });
  
  try {
    // Valida formato
    const cnpjLimpo = validateCNPJFormat(cnpj);
    logger.debug(MODULE, 'CNPJ validado', { cnpjLimpo });
    
    // Faz requisição à API
    const url = `${API_URL}${cnpjLimpo}`;
    logger.debug(MODULE, 'Consultando API BrasilAPI', { url });
    
    const response = await fetchWithTimeout(url);
    
    // Trata erros HTTP
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 404) {
        throw new CNPJError(
          'CNPJ não encontrado na base de dados da Receita Federal',
          'NOT_FOUND',
          { cnpj: cnpjLimpo, status: 404 }
        );
      }
      
      if (response.status === 429) {
        throw new CNPJError(
          'Limite de consultas excedido. Tente novamente em alguns instantes.',
          'RATE_LIMIT',
          { status: 429 }
        );
      }
      
      if (response.status >= 500) {
        throw new CNPJError(
          'Serviço de consulta temporariamente indisponível',
          'SERVER_ERROR',
          { status: response.status }
        );
      }
      
      throw new CNPJError(
        errorData.message || `Erro na consulta (HTTP ${response.status})`,
        'HTTP_ERROR',
        { status: response.status, errorData }
      );
    }
    
    const data = await response.json();
    logger.debug(MODULE, 'Dados recebidos da API', data);
    
    // Valida dados essenciais
    if (!data.razao_social) {
      throw new CNPJError(
        'Dados incompletos retornados pela API',
        'INCOMPLETE_DATA',
        { data }
      );
    }
    
    // Define regime com base na opção pelo Simples
    const opcaoPeloSimples = data.opcao_pelo_simples === true;
    const regime = opcaoPeloSimples ? 'Simples' : '';
    
    // Formata e retorna dados padronizados
    const formattedData = {
      razao_social: data.razao_social || '',
      nome_fantasia: data.nome_fantasia || data.razao_social || '',
      cep: formatCEP(data.cep || ''),
      uf: data.uf || '',
      logradouro: [
        data.descricao_tipo_de_logradouro,
        data.logradouro
      ].filter(Boolean).join(' ') || '',
      numero: data.numero || '',
      bairro: data.bairro || '',
      municipio: data.municipio || '',
      complemento: data.complemento || '',
      opcao_pelo_simples: opcaoPeloSimples,
      regime: regime
    };
    
    logger.success(MODULE, 'CNPJ consultado com sucesso', {
      cnpj: cnpjLimpo,
      razaoSocial: formattedData.razao_social,
      regime: formattedData.regime
    });
    
    return formattedData;
    
  } catch (error) {
    // Se já é um CNPJError, apenas loga e re-lança
    if (error instanceof CNPJError) {
      logger.error(MODULE, `Erro na consulta: ${error.type}`, error);
      throw error;
    }
    
    // Erros de rede
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const networkError = new CNPJError(
        'Erro de conexão. Verifique sua internet.',
        'NETWORK_ERROR',
        { originalError: error.message }
      );
      logger.error(MODULE, 'Erro de rede', networkError);
      throw networkError;
    }
    
    // Outros erros não esperados
    const unexpectedError = new CNPJError(
      'Erro inesperado na consulta de CNPJ',
      'UNEXPECTED_ERROR',
      { originalError: error.message }
    );
    logger.error(MODULE, 'Erro inesperado', unexpectedError);
    throw unexpectedError;
  }
}

/**
 * Retorna mensagem amigável para o usuário baseada no tipo de erro
 */
export function getCNPJErrorMessage(error) {
  if (!(error instanceof CNPJError)) {
    return 'Erro ao consultar CNPJ. Tente novamente.';
  }
  
  const messages = {
    'VALIDATION_ERROR': error.message,
    'NOT_FOUND': 'CNPJ não encontrado. Verifique o número digitado.',
    'TIMEOUT_ERROR': 'Consulta demorou muito. Tente novamente.',
    'RATE_LIMIT': 'Muitas consultas. Aguarde alguns segundos e tente novamente.',
    'SERVER_ERROR': 'Serviço temporariamente indisponível. Tente mais tarde.',
    'NETWORK_ERROR': 'Sem conexão com a internet. Verifique sua rede.',
    'HTTP_ERROR': 'Erro na consulta. Tente novamente.',
    'INCOMPLETE_DATA': 'Dados incompletos retornados. Tente novamente.',
    'UNEXPECTED_ERROR': 'Erro inesperado. Tente novamente.'
  };
  
  return messages[error.type] || error.message;
}