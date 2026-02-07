// services/cnpj-service.js

import { removeFormatting, formatCEP } from '../utils/formatters.js';

/**
 * Consulta dados do CNPJ na BrasilAPI
 */
export async function consultarCNPJ(cnpj) {
  const cnpjLimpo = removeFormatting(cnpj);

  if (cnpjLimpo.length !== 14) {
    throw new Error('CNPJ deve ter 14 dígitos');
  }

  const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpjLimpo}`);

  if (!response.ok) {
    throw new Error('CNPJ não encontrado');
  }

  const data = await response.json();

  // Formata e retorna dados padronizados
  return {
    razao_social: data.razao_social || '',
    nome_fantasia: data.nome_fantasia || '',
    cep: formatCEP(data.cep || ''),
    uf: data.uf || '',
    municipio: data.municipio || '',
    bairro: data.bairro || '',
    logradouro: [
      data.descricao_tipo_de_logradouro,
      data.logradouro
    ].filter(Boolean).join(' '),
    numero: data.numero || '',
    complemento: data.complemento || ''
  };
}