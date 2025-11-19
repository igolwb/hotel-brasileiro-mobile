import React, { useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const router = useRouter();

    const [userId, setUserId] = useState(null);

  useEffect(() => {
      const fetchUserId = async () => {
        try {
          const id = await AsyncStorage.getItem("UserId");
          if (id) {
            setUserId(id);
          }
        } catch (error) {
          console.error("Failed to fetch user ID:", error);
        }
      };
  
      fetchUserId();
    }, []);

  // Função chamada ao clicar no botão "Enviar"

  return (
    <View style={{ flex: 1 }}>
      {/* Imagem de topo com overlay para escurecer a imagem */}
      <View>
        <ImageBackground
          source={require("../../assets/images/imagemCadastro.png")} // imagem de fundo
          style={styles.topImage} // estilo para ocupar largura total e altura fixa
        >
          <View style={styles.overlay} /> {/* camada semi-transparente preta */}
        </ImageBackground>
      </View>

      {/* Container principal do conteúdo abaixo da imagem */}
      <View style={styles.container}>
        <Text style={styles.title}>Recuperar senha</Text> {/* Título da tela */}
        <Text style={styles.description}>
          Digite seu e-mail para receber o link {"\n"} de recuperação.
        </Text> {/* Descrição com instruções */}
        <TextInput
          style={styles.input} // estilo do campo texto
          placeholder="Digite seu email" // texto padrão
          placeholderTextColor="#999" // cor do placeholder
          keyboardType="email-address" // teclado otimizado para email
          value={email} // valor do campo conectado ao estado email
          onChangeText={setEmail} // atualiza estado ao digitar
        />
        {/* Botão enviar */}
        <TouchableOpacity style={styles.button} onPress={() => router.push("/user/pwCode")}>
          <Text style={styles.buttonText}>Enviar</Text>
        </TouchableOpacity>

        {/* Link para voltar à tela de login */}
        <TouchableOpacity         onPress={() => {
          if (userId) {
            router.push(`/user/${userId}`);
          } else {
            console.warn(
              "User ID not found. Redirecting to default user page."
            );
            router.push("/user/userPage");
          }
        }}>
          <Text style={styles.voltar}>Voltar para o login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Estilos usados na tela
const styles = StyleSheet.create({
  topImage: {
    width: "100%", // ocupar toda largura da tela
    height: 376, // altura fixa da imagem
    resizeMode: "cover", // imagem cobre área preservando proporção
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // ocupar toda área do pai
    backgroundColor: "rgba(0,0,0,0.4)", // camada preta semi-transparente para escurecer imagem
  },
 container: {
  flex: 1,
  paddingHorizontal: 20,
  backgroundColor: "#0B2A3A",
  justifyContent: "flex-start", // começa do topo, mas podemos usar 'center' ou 'flex-end'
  paddingTop: 50, // também pode manter se quiser um espaçamento extra
},

  title: {
    padding: 20,
    marginTop: 10, // valor maior "desce" mais
    fontSize: 20,
    color: "#FFF",
    marginVertical: 15,
    fontWeight: "intermediate",
  alignSelf: "center",
},

  description: {
    color: "#E8F1F2", // cor do texto da descrição
    fontSize: 15, // tamanho da fonte menor que título
    marginBottom: 30, // espaçamento abaixo da descrição
    textAlign: "center", // centralizado
  },
  input: {
    backgroundColor: "#E8F1F2", // fundo claro para input
    borderRadius: 10, // bordas arredondadas
    paddingHorizontal: 15, // espaçamento interno horizontal
    paddingVertical: 12, // espaçamento interno vertical
    fontSize: 16, // tamanho da fonte do input
    marginBottom: 40, // margem abaixo para espaçamento
    color: "#000", // texto em preto
  },
  button: {
    backgroundColor: "#006494", // cor azul do botão
    borderRadius: 10, // bordas arredondadas
    paddingVertical: 16, // altura do botão
    alignItems: "center", // texto centralizado no botão
    marginBottom: 25, // margem abaixo para espaçamento
  },
  buttonText: {
    color: "#fff", // cor branca do texto do botão
    fontSize: 16, // tamanho da fonte do texto do botão
    fontWeight: "bold", // texto em negrito
  },
  voltar: {
    color: "#FFF", // texto branco
    fontSize: 13, // tamanho menor
    textAlign: "center", // centralizado horizontalmente
  },
});
