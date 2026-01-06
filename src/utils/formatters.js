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