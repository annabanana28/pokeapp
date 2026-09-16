import ShowPokemon from "@/components/ShowPokemon/ShowPokemon";
import Pokemon from "@/interface/Pokemon";
import Requests from "@/service/PokemonsRequests";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PokemonDetail() {
    const params = useLocalSearchParams<{ id: string }>();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!params.id) return;

        const loadPokemonData = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const data = await Requests.fetchPokemonData(params.id);

                if (data && data.pokemon_info) {
                    const type1 = data.pokemon_info.types[0]?.type.name || "normal";
                    const type2 = data.pokemon_info.types[1]?.type.name;

                    setPokemon({
                        pokemon_name: data.pokemon_info.name,
                        pokemon_image: data.pokemon_image,
                        pokemon_id: data.pokemon_id,
                        types: {
                            type1,
                            type2,
                        },
                        stats: data.pokemon_info.stats,
                        height: data.pokemon_info.height,
                        weight: data.pokemon_info.weight,
                        abilities: data.pokemon_info.abilities,
                    });
                } else {
                    setError("Não foi possível carregar os detalhes do Pokémon.");
                }
            } catch (err) {
                console.error("Error loading pokemon detail:", err);
                setError("Erro ao carregar os dados.");
            } finally {
                setIsLoading(false);
            }
        };

        loadPokemonData();
    }, [params.id]);

    if (isLoading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color="#FF3E3E" />
                <Text style={styles.loadingText}>Carregando detalhes...</Text>
            </SafeAreaView>
        );
    }

    if (error || !pokemon) {
        return (
            <SafeAreaView style={styles.center}>
                <Text style={styles.errorText}>{error || "Pokémon não encontrado"}</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ShowPokemon pokemon={pokemon} />
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
        backgroundColor: "#F7FAFC",
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#718096",
        fontWeight: "500",
    },
    errorText: {
        fontSize: 16,
        color: "#E53E3E",
        fontWeight: "500",
        textAlign: "center",
    },
});