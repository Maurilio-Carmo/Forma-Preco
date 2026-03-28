// utils/logger.js

/**
 * Sistema centralizado de logging com níveis e formatação consistente
 */

const LOG_LEVEL_STYLES = {
  INFO:    { emoji: 'ℹ️', color: '#5aa2ff', console: 'log' },
  SUCCESS: { emoji: '✅', color: '#57b86a', console: 'log' },
  WARN:    { emoji: '⚠️', color: '#f6a623', console: 'warn' },
  ERROR:   { emoji: '❌', color: '#e53935', console: 'error' },
  DEBUG:   { emoji: '🔍', color: '#9c27b0', console: 'log' }
};

const LOG_LEVELS = { DEBUG: 0, INFO: 1, SUCCESS: 2, WARN: 3, ERROR: 4 };

class Logger {
  constructor() {
    this.enabled = true;
    // Padrão: INFO e acima (INFO, SUCCESS, WARN, ERROR visíveis; DEBUG oculto)
    this.minLevel = LOG_LEVELS.INFO;
    this.debugMode = this.isDebugMode();

    // Ativa DEBUG se ?debug=true ou localStorage debug_mode=true
    if (this.debugMode) {
      this.minLevel = LOG_LEVELS.DEBUG;
    }
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
   * Define o nível mínimo de log
   * @param {string} level - 'DEBUG' | 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR'
   */
  setMinLevel(level) {
    this.minLevel = LOG_LEVELS[level] ?? LOG_LEVELS.WARN;
  }

  /**
   * Formata mensagem com contexto e timestamp
   */
  formatMessage(level, module, message, data) {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const levelInfo = LOG_LEVEL_STYLES[level];

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

    const levelValue = LOG_LEVELS[level] ?? LOG_LEVELS.INFO;

    // ERROR sempre exibido; demais respeitam minLevel
    if (level !== 'ERROR' && levelValue < this.minLevel) return;

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

  /** @param {string} module @param {string} message @param {*} [data] */
  info(module, message, data = null) {
    this.log('INFO', module, message, data);
  }

  /** @param {string} module @param {string} message @param {*} [data] */
  success(module, message, data = null) {
    this.log('SUCCESS', module, message, data);
  }

  /** @param {string} module @param {string} message @param {*} [data] */
  warn(module, message, data = null) {
    this.log('WARN', module, message, data);
  }

  /** @param {string} module @param {string} message @param {*} [error] */
  error(module, message, error = null) {
    const errorData = error ? {
      message: error.message,
      stack: error.stack,
      ...error
    } : null;

    this.log('ERROR', module, message, errorData);
  }

  /** @param {string} module @param {string} message @param {*} [data] */
  debug(module, message, data = null) {
    this.log('DEBUG', module, message, data);
  }

  /** Agrupa logs relacionados */
  group(label) {
    if (!this.enabled || this.minLevel > LOG_LEVELS.INFO) return;
    console.group(`🔹 ${label}`);
  }

  /** Fecha grupo de logs */
  groupEnd() {
    if (!this.enabled || this.minLevel > LOG_LEVELS.INFO) return;
    console.groupEnd();
  }

  /** Tabela formatada (útil para arrays de objetos) */
  table(module, message, data) {
    if (!this.enabled || this.minLevel > LOG_LEVELS.INFO) return;
    console.log(`📊 [${module}] ${message}`);
    console.table(data);
  }

  /** Mede tempo de execução */
  time(label) {
    if (!this.enabled || this.minLevel > LOG_LEVELS.INFO) return;
    console.time(`⏱️ ${label}`);
  }

  /** Finaliza medição de tempo */
  timeEnd(label) {
    if (!this.enabled || this.minLevel > LOG_LEVELS.INFO) return;
    console.timeEnd(`⏱️ ${label}`);
  }

  /** Habilita/desabilita todos os logs */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /** Habilita/desabilita modo debug */
  setDebugMode(enabled) {
    this.debugMode = enabled;
    this.minLevel = enabled ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;
    localStorage.setItem('debug_mode', enabled.toString());
  }
}

// Exporta instância singleton
export const logger = new Logger();

// Exporta para uso global no console (debug)
if (typeof window !== 'undefined') {
  window.logger = logger;
}
