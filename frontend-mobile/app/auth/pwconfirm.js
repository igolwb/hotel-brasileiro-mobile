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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputs = useRef([]);
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email || "";

  const handleChangeText = (text, index) => {
    // Permite apenas letras e números, limita a 1 caractere
    const newText = text.replace(/[^A-Z0-9]/gi, "").slice(0, 1).toUpperCase();
    const newCodigo = [...codigo];
    newCodigo[index] = newText;
    setCodigo(newCodigo);
    if (newText && index < 3) {
      inputs.current[index + 1].focus();
    }
    if (!newText && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !codigo[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  // Reenviar código
  const handleResend = async () => {
    setError("");
    setResendLoading(true);
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://172.16.1.234:3000";
      const response = await fetch(`${API_URL}/api/clientes/send-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        setError(data.message || "Erro ao reenviar código.");
      }
    } catch (err) {
      setError("Erro de conexão ao reenviar código.");
    } finally {
      setResendLoading(false);
    }
  };

  // Verificar código
  const handleVerify = async () => {
    setError("");
    setLoading(true);
    const codeInput = codigo.join("");
    if (codeInput.length !== 4) {
      setError("Digite o código completo.");
      setLoading(false);
      return;
    }
    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://172.16.1.234:3000";
      // Buscar usuário pelo email para verificar token e expiração
      const response = await fetch(`${API_URL}/api/clientes/send-token-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: codeInput })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        router.push({ pathname: "/auth/newpw", params: { email } });
      } else {
        setError(data.message || "Código inválido ou expirado.");
      }
    } catch (err) {
      setError("Erro de conexão ao verificar código.");
    } finally {
      setLoading(false);
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
            <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
              <Text style={styles.reenviarText}>{resendLoading ? "Enviando..." : "Reenviar código"}</Text>
            </TouchableOpacity>
          </View>

          {/* Botão Enviar */}
          <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? "Verificando..." : "Enviar"}</Text>
          </TouchableOpacity>

          {error ? (
            <Text style={{ color: "red", textAlign: "center", marginVertical: 8 }}>{error}</Text>
          ) : null}
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
  reenviarContainer: {
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