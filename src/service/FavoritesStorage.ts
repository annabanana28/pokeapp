import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

const WEB_KEY = "pokeapp_favoritos";
const NATIVE_FILE_PATH = `${FileSystem.documentDirectory ?? ""}favoritos.json`;

interface FavoritesData {
  favoritos: number[];
}

// ==========================================
// FUNÇÕES DE LEITURA E ESCRITA INTERNAS
// ==========================================

async function lerFavoritosWeb(): Promise<number[]> {
  try {
    const dados = localStorage.getItem(WEB_KEY);
    if (!dados) return [];
    const parsed: FavoritesData = JSON.parse(dados);
    return Array.isArray(parsed.favoritos) ? parsed.favoritos : [];
  } catch (error) {
    console.error("Erro ao ler favoritos no Web:", error);
    return [];
  }
}

async function salvarFavoritosWeb(ids: number[]): Promise<void> {
  try {
    const payload: FavoritesData = { favoritos: ids };
    localStorage.setItem(WEB_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error("Erro ao salvar favoritos no Web:", error);
  }
}

async function lerFavoritosNativo(): Promise<number[]> {
  try {
    const fileInfo = await FileSystem.getInfoAsync(NATIVE_FILE_PATH);
    if (!fileInfo.exists) {
      return [];
    }
    const conteudo = await FileSystem.readAsStringAsync(NATIVE_FILE_PATH);
    const parsed: FavoritesData = JSON.parse(conteudo);
    return Array.isArray(parsed.favoritos) ? parsed.favoritos : [];
  } catch (error) {
    console.error("Erro ao ler favoritos no dispositivo móvel:", error);
    return [];
  }
}

async function salvarFavoritosNativo(ids: number[]): Promise<void> {
  try {
    const payload: FavoritesData = { favoritos: ids };
    await FileSystem.writeAsStringAsync(
      NATIVE_FILE_PATH,
      JSON.stringify(payload)
    );
  } catch (error) {
    console.error("Erro ao salvar favoritos no dispositivo móvel:", error);
  }
}

// ==========================================
// INTERFACE PÚBLICA DO SERVIÇO
// ==========================================

/**
 * Retorna a lista de IDs de Pokémon armazenados nos favoritos.
 */
export async function buscarFavoritos(): Promise<number[]> {
  if (Platform.OS === "web") {
    return lerFavoritosWeb();
  }
  return lerFavoritosNativo();
}

/**
 * Salva a lista de favoritos no local correto conforme a plataforma.
 */
async function salvarFavoritos(ids: number[]): Promise<void> {
  if (Platform.OS === "web") {
    await salvarFavoritosWeb(ids);
  } else {
    await salvarFavoritosNativo(ids);
  }
}

/**
 * Adiciona um Pokémon aos favoritos.
 * Desafio 4: Evita duplicados filtrando ou garantindo via Set/Includes.
 */
export async function adicionarFavorito(id: number): Promise<void> {
  const favoritos = await buscarFavoritos();
  if (!favoritos.includes(id)) {
    favoritos.push(id);
    await salvarFavoritos(favoritos);
  }
}

/**
 * Remove um Pokémon dos favoritos pelo ID.
 */
export async function removerFavorito(id: number): Promise<void> {
  const favoritos = await buscarFavoritos();
  const novosFavoritos = favoritos.filter((favId) => favId !== id);
  await salvarFavoritos(novosFavoritos);
}

/**
 * Verifica se um Pokémon específico é favorito.
 */
export async function ehFavorito(id: number): Promise<boolean> {
  const favoritos = await buscarFavoritos();
  return favoritos.includes(id);
}

/**
 * Alterna o estado de favorito de um Pokémon (se existir remove, senão adiciona).
 */
export async function alternarFavorito(id: number): Promise<boolean> {
  const isFav = await ehFavorito(id);
  if (isFav) {
    await removerFavorito(id);
    return false;
  } else {
    await adicionarFavorito(id);
    return true;
  }
}

// ==========================================
// RESOLUÇÃO DOS DESAFIOS
// ==========================================

/**
 * Desafio 1 — Limpar favoritos
 * Remove todos os favoritos salvando uma lista vazia.
 */
export async function limparFavoritos(): Promise<void> {
  await salvarFavoritos([]);
}

/**
 * Desafio 2 — Contador
 * Retorna a quantidade total de Pokémon favoritados.
 */
export async function obterQuantidadeFavoritos(): Promise<number> {
  const favoritos = await buscarFavoritos();
  return favoritos.length;
}