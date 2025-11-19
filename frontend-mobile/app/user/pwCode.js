import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function CodigoVerificacao() {
  const [codigo, setCodigo] = useState(["", "", "", ""]);
  const inputs = useRef([]);
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email || "";

  const handleChangeText = (text, index) => {
    // Permite apenas números e limita a 1 caractere
    const newText = text.replace(/[^0-9]/g, "").slice(0, 1);
    
    const newCodigo = [...codigo];
    newCodigo[index] = newText;
    setCodigo(newCodigo);

    // Move para o próximo input automaticamente
    if (newText && index < 3) {
      inputs.current[index + 1].focus();
    }

    // Move para o anterior se apagar
    if (!newText && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !codigo[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1 }}>
        {/* Imagem de topo */}
        <View>
          <ImageBackground
            source={require("../../assets/images/imagemCadastro.png")}
            style={styles.topImage}
          >
            <View style={styles.overlay} />
          </ImageBackground>
        </View>

        {/* Container principal do conteúdo */}
        <View style={styles.container}>
          <Text style={styles.title}>Enviamos o código para</Text>
          <Text style={styles.title}>o seu e-mail</Text>
          
          <Text style={styles.description}>
            Digite o código de verificação que enviamos  {"\n"}  para o seu e-mail
          </Text>
            <Text style={styles.description}>{email}
          </Text>

          {/* Container dos inputs de código */}
          <View style={styles.codigoContainer}>
            {[0, 1, 2, 3].map((index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                style={styles.digitInput}
                keyboardType="numeric"
                maxLength={1}
                value={codigo[index]}
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                selectTextOnFocus
              />
            ))}
          </View>

          {/* Reenviar código POSICIONADO ABAIXO DOS INPUTS */}
          <View style={styles.reenviarContainer}>
            <Text style={styles.reenviarText}>Reenviar código</Text>
          </View>

          {/* Botão Enviar */}
          <TouchableOpacity style={styles.button} onPress={() => router.push("/user/confirmNewPw")}> 
            <Text style={styles.buttonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topImage: {
    width: "100%",
    height: 374, 
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#0B2A3A",
    paddingTop: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    color: "#FFF",
    textAlign: "center",
    fontWeight: "intermediate",
    marginBottom: 5,
  },
  description: {
    color: "#E8F1F2",
    textAlign: "center",
    fontSize: 16,
    marginTop: 15,
    marginBottom: 2,
  },
  codigoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
    gap: 30,
  },
  digitInput: {
    width: 60,
    height: 60,
    backgroundColor: "#E8F1F2",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  reenviarContainer: { // Posiciona logo abaixo dos inputs
    marginBottom: 30,
  },
  reenviarText: {
    color: "#ffffffff",
    fontSize: 16,
    fontWeight: "bold",
  textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#006494",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});