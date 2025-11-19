import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import BottomNav from "../../components/bottomNav";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

// Componente principal da tela de perfil
const ProfileScreen = () => {
  const { UserId } = useLocalSearchParams(); // Captura parâmetros da rota
  const [userId, setUserId] = useState(null); // Estado para armazenar o ID do usuário
  const [userName, setUserName] = useState("Usuário"); // Estado para armazenar o nome do usuário

  // Efeito para buscar informações do usuário ao carregar a tela
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken"); // Recupera o token de autenticação
        const id = await AsyncStorage.getItem("UserId"); // Recupera o ID do usuário
        setUserId(id);
        if (token) {
          const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.106:3000";
          const response = await fetch(`${API_URL}/api/clientes/me`, {
            headers: {
              Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
            },
          });
          const data = await response.json();
          // Verifica se os dados foram retornados com sucesso
          if (data && data.success && data.data && data.data.nome) {
            setUserName(data.data.nome); // Atualiza o nome do usuário
          }
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error); // Log de erro
      }
    };
    fetchUserInfo();
  }, []);

  const router = useRouter(); // Hook para navegação

  // Função para sair da conta: remove dados e redireciona para a home
  const signOut = async () => {
    try {
      await AsyncStorage.multiRemove(["authToken", "UserId"]); // Remove dados do AsyncStorage
      router.replace("/"); // Redireciona para a tela inicial
    } catch (error) {
      console.error("Erro ao sair da conta:", error); // Log de erro
    }
  };

  return (
    <View style={styles.container}>
      {/* Seção do cabeçalho */}
      <View style={styles.header}>
        {/* Botão de voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/user/userPage")}
        >
          <Image
            source={require("../../assets/images/voltarBtn.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        {/* Imagem de perfil */}
        <Image
          source={require("../../assets/images/user_pfp.png")}
          style={styles.profileImage}
        />

        {/* Nome do usuário */}
        <Text style={styles.username}>{userName}</Text>
      </View>

      {/* Seção de opções */}
      <View style={styles.optionsContainer}>
        {/* Botão para ver reservas */}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => router.push("/user/MinhasReservas")}
        >
          <Icon name="event" size={24} color="#fff" />
          <Text style={styles.optionText}>Reservas feitas</Text>
        </TouchableOpacity>

        {/* Botão para editar perfil */}
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => router.push("/user/editUser")}
        >
          <Icon name="edit" size={24} color="#fff" />
          <Text style={styles.optionText}>Editar perfil</Text>
        </TouchableOpacity>

        {/* Botão para sair da conta */}
        <TouchableOpacity style={styles.optionButton} onPress={signOut}>
          <Icon name="logout" size={24} color="#fff" />
          <Text style={styles.optionText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>

      {/* Navegação inferior */}
      <BottomNav />
    </View>
  );
};

// Estilos da tela
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B2A3A", // Cor de fundo
    paddingTop: verticalScale(30),
    paddingHorizontal: 18,
    paddingBottom: 90, // Espaço para não sobrepor a BottomNav
    position: "relative",
  },
  backIcon: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 2,
    marginTop: scale(-20),
  },
  header: {
    alignItems: "center", // Centraliza os elementos
    marginBottom:verticalScale(20),
    marginTop: verticalScale(30), // Espaçamento superior
  },
  backButton: {
    position: "absolute",
    top: 6,
    left: 2,
    padding: 8,
    borderRadius: 20,
  },
  profileImage: {
    width: 140,
    height: 140,
    marginTop: verticalScale(30),
    borderRadius: 70, // Torna a imagem circular
    backgroundColor: "#ccc",
    marginBottom: 16,
  },
  username: {
    fontSize: scale(25),
    color: "#fff",
    fontWeight: "bold",
  },
  optionsContainer: {
    width: "100%",
    marginTop: 20,
    marginBottom: 30,
    alignItems: "center", // Centraliza os botões
  },
  optionButton: {
    width: "100%",
    height: 70,
    flexDirection: "row", // Ícone e texto lado a lado
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginBottom: 18,
    borderRadius: 25,
    backgroundColor: "#29374F",
    justifyContent: "flex-start",
  },
  optionText: {
    fontSize: 18,
    color: "#fff",
    marginLeft: 15, // Espaço entre ícone e texto
  },
});

export default ProfileScreen;