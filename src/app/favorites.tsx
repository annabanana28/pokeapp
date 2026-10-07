import Pokemon from "@/interface/Pokemon";
import {
    buscarFavoritos,
    limparFavoritos,
    obterQuantidadeFavoritos,
    removerFavorito,
} from "@/service/FavoritesStorage";
import Requests from "@/service/PokemonsRequests";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavoritesScreen() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Busca os IDs armazenados e carrega os dados completos de cada Pokémon na PokeAPI
  const carregarDados = async () => {
    setIsLoading(true);
    const ids = await buscarFavoritos();
    const qtd = await obterQuantidadeFavoritos();
    setTotal(qtd);

    if (ids.length === 0) {
      setPokemonList([]);
      setIsLoading(false);
      return;
    }

    // Busca as informações dos Pokémon na PokeAPI para cada ID salvo
    const pokemonsPromises = ids.map(async (id) => {
      try {
        const data = await Requests.fetchPokemonData(id.toString());
        if (data && data.pokemon_info) {
          const type1 = data.pokemon_info.types[0]?.type.name || "normal";
          const type2 = data.pokemon_info.types[1]?.type.name;

          return {
            pokemon_name: data.pokemon_info.name,
            pokemon_image: data.pokemon_image,
            pokemon_id: data.pokemon_id,
            types: { type1, type2 },
            stats: data.pokemon_info.stats,
            height: data.pokemon_info.height,
            weight: data.pokemon_info.weight,
            abilities: data.pokemon_info.abilities,
          } as Pokemon;
        }
      } catch (error) {
        console.error(`Erro ao carregar Pokémon #${id}:`, error);
      }
      return null;
    });

    const resultados = await Promise.all(pokemonsPromises);
    setPokemonList(resultados.filter((p): p is Pokemon => p !== null));
    setIsLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  // Desafio 1: Limpar favoritos
  const handleLimparTudo = async () => {
    await limparFavoritos();
    await carregarDados();
  };

  // Remover um item individual
  const handleRemoverItem = async (id: number) => {
    await removerFavorito(id);
    await carregarDados();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#FF3E3E" />
        <Text style={styles.loadingText}>Carregando Pokémon favoritos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Desafio 2: Contador de favoritos */}
      <View style={styles.header}>
        <Text style={styles.title}>Meus Favoritos</Text>
        <Text style={styles.counter}>⭐ {total} favoritos</Text>
      </View>

      {pokemonList.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            Você ainda não adicionou nenhum Pokémon aos favoritos.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={pokemonList}
            keyExtractor={(item, index) =>
              item.pokemon_id?.toString() ?? index.toString()
            }
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <TouchableOpacity
                  style={styles.cardContent}
                  onPress={() =>
                    item.pokemon_id && router.push(`/pokemon/${item.pokemon_id}`)
                  }
                >
                  <Image
                    source={{ uri: item.pokemon_image }}
                    style={styles.pokemonImage}
                  />
                  <View style={styles.pokemonDetails}>
                    <Text style={styles.pokemonName}>
                      {item.pokemon_name?.toUpperCase()}
                    </Text>
                    <Text style={styles.pokemonId}>#{item.pokemon_id}</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() =>
                    item.pokemon_id && handleRemoverItem(Number(item.pokemon_id))
                  }
                >
                  <Text style={styles.removeButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            )}
          />

          {/* Desafio 1: Botão Limpar Favoritos */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleLimparTudo}
            >
              <Text style={styles.clearButtonText}>🗑 Limpar favoritos</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#718096",
    fontWeight: "500",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2D3748",
  },
  counter: {
    fontSize: 16,
    color: "#718096",
    marginTop: 4,
    fontWeight: "600",
  },
  listContainer: {
    padding: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  pokemonImage: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  pokemonDetails: {
    justifyContent: "center",
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D3748",
  },
  pokemonId: {
    fontSize: 14,
    color: "#A0AEC0",
    marginTop: 2,
  },
  removeButton: {
    padding: 10,
  },
  removeButtonText: {
    fontSize: 18,
  },
  emptyText: {
    fontSize: 16,
    color: "#A0AEC0",
    textAlign: "center",
  },
  footer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  clearButton: {
    backgroundColor: "#FFF5F5",
    borderColor: "#FEB2B2",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  clearButtonText: {
    color: "#E53E3E",
    fontWeight: "bold",
    fontSize: 16,
  },
});