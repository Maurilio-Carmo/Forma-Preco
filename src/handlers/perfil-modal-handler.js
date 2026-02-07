// handlers/perfil-modal-handler.js

import { fillPerfilForm, initializePerfilForm } from './perfil-form-handler.js';

/**
 * Abre o modal de perfil
 */
export function openPerfilModal() {
  const modal = document.getElementById('perfilModal');
  
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    fillPerfilForm();
  }
}

/**
 * Fecha o modal de perfil
 */
export function closePerfilModal() {
  const modal = document.getElementById('perfilModal');
  
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Inicializa eventos do modal de perfil
 */
export function initializePerfilModal() {
  const modal = document.getElementById('perfilModal');
  const perfilClose = document.getElementById('perfilClose');

  // Botões de fechar
  perfilClose?.addEventListener('click', closePerfilModal);

  // Click fora do modal
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      closePerfilModal();
    }
  });

  // ESC fecha o modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('active')) {
      closePerfilModal();
    }
  });

  // Inicializa formulário (passa callback para fechar após salvar)
  initializePerfilForm(closePerfilModal);
}