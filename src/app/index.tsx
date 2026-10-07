import ListPokemon from "@/components/ListPokemon/ListPokemon";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Barra superior com botão para ir até os Favoritos */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.favoritesButton}
          onPress={() => router.push("/favorites")}
        >
          <Text style={styles.favoritesButtonText}>⭐ Meus Favoritos</Text>
        </TouchableOpacity>
      </View>

      <ListPokemon />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "flex-end",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  favoritesButton: {
    backgroundColor: "#FFF5F5",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FEB2B2",
  },
  favoritesButtonText: {
    color: "#E53E3E",
    fontWeight: "bold",
    fontSize: 14,
  },
});