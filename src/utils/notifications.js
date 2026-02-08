// utils/notifications.js

/**
 * Sistema de notificações toast para feedback visual ao usuário
 */

const NOTIFICATION_TYPES = {
  SUCCESS: {
    icon: '✅',
    class: 'notification-success',
    duration: 3000
  },
  ERROR: {
    icon: '❌',
    class: 'notification-error',
    duration: 5000
  },
  WARNING: {
    icon: '⚠️',
    class: 'notification-warning',
    duration: 4000
  },
  INFO: {
    icon: 'ℹ️',
    class: 'notification-info',
    duration: 3000
  }
};

class NotificationSystem {
  constructor() {
    this.container = null;
    this.notifications = [];
    this.initialize();
  }

  /**
   * Inicializa container de notificações
   */
  initialize() {
    if (this.container) return;

    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    this.container.className = 'notification-container';
    document.body.appendChild(this.container);
    
    // Nota: Os estilos CSS devem ser importados via css/notification.css
  }

  /**
   * Mostra notificação
   */
  show(type, title, message, duration = null) {
    const config = NOTIFICATION_TYPES[type];
    if (!config) {
      console.error('Tipo de notificação inválido:', type);
      return;
    }

    const finalDuration = duration || config.duration;
    const notification = this.createNotification(config, title, message, finalDuration);
    
    this.container.appendChild(notification);
    this.notifications.push(notification);

    // Remove após duração + tempo de fade
    setTimeout(() => {
      this.remove(notification);
    }, finalDuration + 300);

    return notification;
  }

  /**
   * Cria elemento de notificação
   */
  createNotification(config, title, message, duration) {
    const notification = document.createElement('div');
    notification.className = `notification ${config.class}`;
    notification.style.setProperty('--fade-delay', `${duration}ms`);
    notification.style.setProperty('--duration', `${duration}ms`);

    notification.innerHTML = `
      <div class="notification-icon">${config.icon}</div>
      <div class="notification-content">
        ${title ? `<div class="notification-title">${title}</div>` : ''}
        <div class="notification-message">${message}</div>
      </div>
      <button class="notification-close" aria-label="Fechar">&times;</button>
      <div class="notification-progress"></div>
    `;

    // Botão de fechar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      this.remove(notification);
    });

    return notification;
  }

  /**
   * Remove notificação
   */
  remove(notification) {
    if (!notification || !notification.parentElement) return;

    notification.remove();
    this.notifications = this.notifications.filter(n => n !== notification);
  }

  /**
   * Remove todas as notificações
   */
  clear() {
    this.notifications.forEach(n => this.remove(n));
  }

  /**
   * Notificação de sucesso
   */
  success(title, message, duration) {
    return this.show('SUCCESS', title, message, duration);
  }

  /**
   * Notificação de erro
   */
  error(title, message, duration) {
    return this.show('ERROR', title, message, duration);
  }

  /**
   * Notificação de aviso
   */
  warning(title, message, duration) {
    return this.show('WARNING', title, message, duration);
  }

  /**
   * Notificação de informação
   */
  info(title, message, duration) {
    return this.show('INFO', title, message, duration);
  }

  /**
   * Notificação de carregamento (permanece até ser fechada manualmente)
   */
  loading(title, message) {
    const notification = document.createElement('div');
    notification.className = 'notification notification-info';
    notification.innerHTML = `
      <div class="notification-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
          <path d="M12 2 A10 10 0 0 1 22 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <div class="notification-content">
        ${title ? `<div class="notification-title">${title}</div>` : ''}
        <div class="notification-message">${message}</div>
      </div>
    `;

    this.container.appendChild(notification);
    this.notifications.push(notification);

    return {
      close: () => this.remove(notification),
      update: (newTitle, newMessage) => {
        if (newTitle) {
          const titleEl = notification.querySelector('.notification-title');
          if (titleEl) titleEl.textContent = newTitle;
        }
        if (newMessage) {
          const messageEl = notification.querySelector('.notification-message');
          if (messageEl) messageEl.textContent = newMessage;
        }
      }
    };
  }
}

// Exporta instância singleton
export const notify = new NotificationSystem();

// Exporta para uso global no console (debug)
if (typeof window !== 'undefined') {
  window.notify = notify;
}