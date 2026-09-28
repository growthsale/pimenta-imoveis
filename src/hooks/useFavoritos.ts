"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

const CHAVE = "pimenta:favoritos";
const VAZIO = "[]";

/**
 * Favoritos do visitante, guardados no localStorage.
 *
 * Usa useSyncExternalStore em vez de useEffect + setState: o localStorage nao
 * existe no render do servidor (nem no build do export estatico), entao ele
 * precisa entrar como fonte externa, com snapshot proprio para o servidor. De
 * quebra, todos os cards da pagina reagem juntos ao mesmo clique.
 */

const ouvintes = new Set<() => void>();

function avisar() {
  ouvintes.forEach((ouvinte) => ouvinte());
}

function subscrever(ouvinte: () => void) {
  ouvintes.add(ouvinte);
  // outra aba mexeu no storage
  window.addEventListener("storage", ouvinte);
  return () => {
    ouvintes.delete(ouvinte);
    window.removeEventListener("storage", ouvinte);
  };
}

/** devolve a string crua para o snapshot ser comparavel por identidade */
function snapshot(): string {
  try {
    return window.localStorage.getItem(CHAVE) ?? VAZIO;
  } catch {
    // navegacao anonima ou storage bloqueado
    return VAZIO;
  }
}

function snapshotServidor(): string {
  return VAZIO;
}

function parse(bruto: string): string[] {
  try {
    const lista = JSON.parse(bruto);
    return Array.isArray(lista) ? (lista as string[]) : [];
  } catch {
    return [];
  }
}

export function useFavoritos() {
  const bruto = useSyncExternalStore(subscrever, snapshot, snapshotServidor);
  const ids = useMemo(() => parse(bruto), [bruto]);

  const alternar = useCallback((id: string) => {
    const atual = parse(snapshot());
    const proximo = atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id];

    try {
      window.localStorage.setItem(CHAVE, JSON.stringify(proximo));
    } catch {
      // sem storage o favorito nao persiste; a interface segue funcionando
    }
    avisar();
  }, []);

  return { ids, alternar };
}
