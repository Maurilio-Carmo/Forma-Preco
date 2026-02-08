// utils/logger.js

/**
 * Sistema centralizado de logging com níveis e formatação consistente
 */

const LOG_LEVELS = {
  INFO: { emoji: 'ℹ️', color: '#5aa2ff', console: 'log' },
  SUCCESS: { emoji: '✅', color: '#57b86a', console: 'log' },
  WARN: { emoji: '⚠️', color: '#f6a623', console: 'warn' },
  ERROR: { emoji: '❌', color: '#e53935', console: 'error' },
  DEBUG: { emoji: '🔍', color: '#9c27b0', console: 'log' }
};

class Logger {
  constructor() {
    this.enabled = true;
    this.debugMode = this.isDebugMode();
  }

  /**
   * Verifica se o modo debug está ativo (via URL ou localStorage)
   */
  isDebugMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const debugParam = urlParams.get('debug') === 'true';
    const debugStorage = localStorage.getItem('debug_mode') === 'true';
    return debugParam || debugStorage;
  }

  /**
   * Formata mensagem com contexto e timestamp
   */
  formatMessage(level, module, message, data) {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const levelInfo = LOG_LEVELS[level];
    
    return {
      prefix: `${levelInfo.emoji} [${timestamp}] [${module}]`,
      message,
      data,
      style: `color: ${levelInfo.color}; font-weight: bold;`,
      consoleMethod: levelInfo.console
    };
  }

  /**
   * Log genérico
   */
  log(level, module, message, data = null) {
    if (!this.enabled) return;
    
    // Logs de DEBUG só aparecem em modo debug
    if (level === 'DEBUG' && !this.debugMode) return;
    
    const formatted = this.formatMessage(level, module, message, data);
    
    if (data) {
      console[formatted.consoleMethod](
        `%c${formatted.prefix}`,
        formatted.style,
        formatted.message,
        data
      );
    } else {
      console[formatted.consoleMethod](
        `%c${formatted.prefix}`,
        formatted.style,
        formatted.message
      );
    }
  }

  /**
   * Log de informação
   */
  info(module, message, data = null) {
    this.log('INFO', module, message, data);
  }

  /**
   * Log de sucesso
   */
  success(module, message, data = null) {
    this.log('SUCCESS', module, message, data);
  }

  /**
   * Log de aviso
   */
  warn(module, message, data = null) {
    this.log('WARN', module, message, data);
  }

  /**
   * Log de erro
   */
  error(module, message, error = null) {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      ...error
    } : null;
    
    this.log('ERROR', module, message, errorData);
  }

  /**
   * Log de debug (só aparece em modo debug)
   */
  debug(module, message, data = null) {
    this.log('DEBUG', module, message, data);
  }

  /**
   * Agrupa logs relacionados
   */
  group(label) {
    if (!this.enabled) return;
    console.group(`🔹 ${label}`);
  }

  /**
   * Fecha grupo de logs
   */
  groupEnd() {
    if (!this.enabled) return;
    console.groupEnd();
  }

  /**
   * Tabela formatada (útil para arrays de objetos)
   */
  table(module, message, data) {
    if (!this.enabled) return;
    console.log(`📊 [${module}] ${message}`);
    console.table(data);
  }

  /**
   * Mede tempo de execução
   */
  time(label) {
    if (!this.enabled) return;
    console.time(`⏱️ ${label}`);
  }

  /**
   * Finaliza medição de tempo
   */
  timeEnd(label) {
    if (!this.enabled) return;
    console.timeEnd(`⏱️ ${label}`);
  }

  /**
   * Habilita/desabilita todos os logs
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Habilita/desabilita modo debug
   */
  setDebugMode(enabled) {
    this.debugMode = enabled;
    localStorage.setItem('debug_mode', enabled.toString());
  }
}

// Exporta instância singleton
export const logger = new Logger();

// Exporta para uso global no console (debug)
if (typeof window !== 'undefined') {
  window.logger = logger;
}