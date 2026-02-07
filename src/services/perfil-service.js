// services/perfil-service.js

import { STORAGE_KEYS } from '../config/constants.js';

/**
 * Carrega dados do perfil do localStorage
 */
export function loadPerfilData() {
  const perfilData = localStorage.getItem(STORAGE_KEYS.PERFIL);

  if (!perfilData) {
    return null;
  }

  try {
    return JSON.parse(perfilData);
  } catch (error) {
    console.error('Erro ao carregar dados do perfil:', error);
    return null;
  }
}

/**
 * Salva dados do perfil no localStorage
 */
export function savePerfilData(data) {
  try {
    localStorage.setItem(STORAGE_KEYS.PERFIL, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Erro ao salvar dados do perfil:', error);
    return false;
  }
}

/**
 * Limpa dados do perfil
 */
export function clearPerfilData() {
  try {
    localStorage.removeItem(STORAGE_KEYS.PERFIL);
    return true;
  } catch (error) {
    console.error('Erro ao limpar dados do perfil:', error);
    return false;
  }
}