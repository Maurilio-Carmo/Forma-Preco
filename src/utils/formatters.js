// utils/formatters.js

/**
 * Converte string ou número para número decimal
 */
export function toNumber(value) {
  if (!value) return 0;
  return parseFloat(value.toString().replace(",", ".")) || 0;
}

/**
 * Converte percentual para decimal
 */
export function toPercent(value) {
  return toNumber(value) / 100;
}

/**
 * Formata número como moeda brasileira
 */
export function formatCurrency(value) {
  return `R$ ${value.toFixed(2)}`;
}

/**
 * Formata número como percentual
 */
export function formatPercent(value) {
  return `${value.toFixed(2)} %`;
}

/**
 * Retorna a data atual formatada como dd/mm/yyyy
 */
export function getCurrentDate() {
  const hoje = new Date();
  const dia = String(hoje.getDate()).padStart(2, '0');
  const mes = String(hoje.getMonth() + 1).padStart(2, '0');
  const ano = hoje.getFullYear();
  return `${dia} / ${mes} / ${ano}`;
}

/**
 * Formata valor para exibição em input numérico
 */
export function formatInputValue(value, decimals = 2) {
  return value.toFixed(decimals);
}

/**
 * Remove formatação de CNPJ/CEP
 */
export function removeFormatting(value) {
  return value.replace(/\D/g, '');
}

/**
 * Formata CNPJ: 12.345.678/0001-90
 */
export function formatCNPJ(value) {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 14) {
    return numbers
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  return value;
}

/**
 * Formata CEP: 12345-678
 */
export function formatCEP(value) {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 8) {
    return numbers.replace(/^(\d{5})(\d)/, '$1-$2');
  }

  return value;
}