import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import BottomNav from "../../components/bottomNav";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function QuartoDetalhe() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [quarto, setQuarto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchQuarto = async () => {
        try {
            const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.106:3000";
            const token = await AsyncStorage.getItem("authToken");
            const response = await fetch(`${API_URL}/api/quartos/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
          const data = await response.json();
          if (data.success) {
            setQuarto(data.data);
          } else {
            setError(data.message);
          }
        } catch (err) {
          setError("Erro ao buscar detalhes do quarto.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchQuarto();
    }
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!quarto) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Quarto não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: quarto.imagem_url }}
        style={styles.imagem}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.titulo}>{quarto.nome}</Text>
        <Text style={styles.subtitulo}>{quarto.descricao}</Text>

        <Text style={styles.detalhesTitulo}>Detalhes</Text>
        <Text style={styles.detalhe}>Preço: R$ {quarto.preco} por dia</Text>
        <Text style={styles.detalhe}>Quantidade disponível: {quarto.quantidade}</Text>
        
        <TouchableOpacity onPress={() => router.push({ pathname: '/reservas/reserva', params: { id: id } })} style={styles.botao}>
          <Text style={styles.textoBotao}>Prosseguir para Reserva</Text>
        </TouchableOpacity>
      </View>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#13293D",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
  },
  imagem: {
    width: "100%",
    height: "40%",
  },
  info: {
    flex: 1,
    backgroundColor: "#142c42",
    padding: 20,
    marginTop: -20,
    borderRadius: 20, 
  },
  titulo: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 5,
  },
  subtitulo: {
    color: "#fff",
    marginBottom: 10,
    fontSize: 17,
  },
  detalhesTitulo: {
    color: "#fff",
    fontWeight: "semibold",
    marginTop: 10,
    marginBottom: 8,
    fontSize: 20,
  },
  detalhe: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 25,
    fontWeight: "regular",
  },
  botao: {
    backgroundColor: "#006494",
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 10,
    alignItems: "center",
  },
  textoBotao: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
});