import Pokemon from "@/interface/Pokemon";
import { Image } from "expo-image";
import { ScrollView, Text, View } from "react-native";
import { estilos } from "../../layout/layout";

export const typeIcons: Record<string, any> = {
    normal: require('@/assets/icons/normal.svg'),
    fire: require('@/assets/icons/fire.svg'),
    water: require('@/assets/icons/water.svg'),
    electric: require('@/assets/icons/electric.svg'),
    grass: require('@/assets/icons/grass.svg'),
    ice: require('@/assets/icons/ice.svg'),
    fighting: require('@/assets/icons/fighting.svg'),
    poison: require('@/assets/icons/poison.svg'),
    ground: require('@/assets/icons/ground.svg'),
    flying: require('@/assets/icons/flying.svg'),
    psychic: require('@/assets/icons/psychic.svg'),
    bug: require('@/assets/icons/bug.svg'),
    rock: require('@/assets/icons/rock.svg'),
    ghost: require('@/assets/icons/ghost.svg'),
    dragon: require('@/assets/icons/dragon.svg'),
    dark: require('@/assets/icons/dark.svg'),
    steel: require('@/assets/icons/steel.svg'),
    fairy: require('@/assets/icons/fairy.svg'),
};

interface ShowPokemonProps {
    pokemon: Pokemon;
}

export default function ShowPokemon({ pokemon }: ShowPokemonProps) {
    const Type1Icon = pokemon.types
        ? typeIcons[pokemon.types.type1]?.default || typeIcons[pokemon.types.type1]
        : null;

    const Type2Icon = pokemon.types?.type2
        ? typeIcons[pokemon.types.type2]?.default || typeIcons[pokemon.types.type2]
        : null;

    const getStat = (name: string) => {
        return pokemon.stats?.find(
            (stat) => stat.stat.name === name
        )?.base_stat;
    };

    return (
        <ScrollView contentContainerStyle={estilos.container}>
            <Text style={estilos.pokemonDisplayName}>
                {pokemon.pokemon_name
                    .split("-")
                    .map(
                        (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1)
                    )
                    .join(" ")}
            </Text>

            <Text style={estilos.pokemonId}>
                Pokédex #{pokemon.pokemon_id}
            </Text>

            <Image
                source={{ uri: pokemon.pokemon_image }}
                style={estilos.pokemonDisplayImage}
                contentFit="contain"
            />

            <View style={estilos.types}>
                {Type1Icon && (
                    <Type1Icon
                        width={50}
                        height={50}
                    />
                )}

                {Type2Icon && (
                    <Type2Icon
                        width={50}
                        height={50}
                    />
                )}
            </View>

            <View style={estilos.infoCard}>
                <Text style={estilos.sectionTitle}>
                    Informações
                </Text>

                <Text style={estilos.infoText}>
                    Altura: {pokemon.height! / 10} m
                </Text>

                <Text style={estilos.infoText}>
                    Peso: {pokemon.weight! / 10} kg
                </Text>
            </View>

            <View style={estilos.infoCard}>
                <Text style={estilos.sectionTitle}>
                    Status
                </Text>

                <Text style={estilos.infoText}>
                    HP: {getStat("hp")}
                </Text>

                <Text style={estilos.infoText}>
                    Ataque: {getStat("attack")}
                </Text>

                <Text style={estilos.infoText}>
                    Defesa: {getStat("defense")}
                </Text>

                <Text style={estilos.infoText}>
                    Ataque Especial: {getStat("special-attack")}
                </Text>

                <Text style={estilos.infoText}>
                    Defesa Especial: {getStat("special-defense")}
                </Text>

                <Text style={estilos.infoText}>
                    Velocidade: {getStat("speed")}
                </Text>
            </View>

            <View style={estilos.infoCard}>
                <Text style={estilos.sectionTitle}>
                    Habilidades
                </Text>

                {pokemon.abilities?.map((ability, index) => (
                    <Text
                        key={index}
                        style={estilos.infoText}
                    >
                        • {ability.ability.name}
                    </Text>
                ))}
            </View>
        </ScrollView>
    );
}