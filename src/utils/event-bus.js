// utils/event-bus.js

/**
 * EventBus simples para comunicação desacoplada entre módulos
 */
const listeners = {};

export const eventBus = {
  /**
   * Registra um listener para um evento
   * @param {string} event
   * @param {Function} callback
   */
  on(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  },

  /**
   * Remove um listener de um evento
   * @param {string} event
   * @param {Function} callback
   */
  off(event, callback) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(cb => cb !== callback);
  },

  /**
   * Emite um evento para todos os listeners registrados
   * @param {string} event
   * @param {*} data
   */
  emit(event, data) {
    if (!listeners[event]) return;
    listeners[event].forEach(cb => cb(data));
  }
};
