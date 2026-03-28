// utils/debounce.js

/**
 * Retorna versão com debounce de uma função
 * @param {Function} fn - Função a ser executada
 * @param {number} delay - Atraso em ms (padrão: 150)
 * @returns {Function}
 */
export function debounce(fn, delay = 150) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
