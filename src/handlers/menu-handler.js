// handlers/menu-handler.js

import { openPerfilModal } from './perfil-modal-handler.js';

/**
 * Fecha o menu lateral
 */
function closeMenu() {
  const sideMenu = document.getElementById('sideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  
  sideMenu.classList.remove('active');
  menuOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

/**
 * Abre o menu lateral
 */
function openMenu() {
  const sideMenu = document.getElementById('sideMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  
  sideMenu.classList.add('active');
  menuOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Inicializa o menu sanduíche
 */
export function initializeMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const menuClose = document.getElementById('menuClose');
  const menuOverlay = document.getElementById('menuOverlay');
  const menuPerfil = document.getElementById('menuPerfil');
  const menuTema = document.getElementById('menuTema');
  const sideMenu = document.getElementById('sideMenu');

  // Abrir menu
  menuToggle?.addEventListener('click', openMenu);

  // Fechar menu
  menuClose?.addEventListener('click', closeMenu);
  menuOverlay?.addEventListener('click', closeMenu);

  // Abrir modal de perfil
  menuPerfil?.addEventListener('click', () => {
    closeMenu();
    setTimeout(() => openPerfilModal(), 300);
  });

  // Alterar tema
  menuTema?.addEventListener('click', closeMenu);

  // ESC fecha o menu
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sideMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}