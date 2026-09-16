import { StyleSheet } from "react-native";

export const estilos = StyleSheet.create({
    container: {
        padding: 20,
        alignItems: "center",
        backgroundColor: "#F7FAFC",
    },

    pokemonDisplayName: {
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 10,
        textAlign: "center",
    },

    pokemonId: {
        fontSize: 16,
        color: "#718096",
        marginBottom: 10,
        textAlign: "center",
    },

    pokemonDisplayImage: {
        width: 250,
        height: 250,
    },

    types: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
        marginBottom: 20,
    },

    infoCard: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 12,
        marginBottom: 15,
        alignItems: "center",
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },

    infoText: {
        fontSize: 16,
        marginBottom: 5,
        textAlign: "center",
    },

    pokemonTypeImage: {
        width: 50,
        height: 50,
        marginHorizontal: 40,
    },

    pokemonInfo: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },

    logotipo: {
        width: "75%",
        margin: 20,
    },
});