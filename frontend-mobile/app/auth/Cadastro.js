import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { scale, verticalScale } from 'react-native-size-matters';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Componente principal da tela de cadastro
export default function Cadastro() {
  // Estados dos campos
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Regex para validação de email e telefone
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
  // Requisitos de senha
  const passwordRequirements = [
    { label: 'Mínimo 8 caracteres', test: (s) => s.length >= 8 },
    { label: 'Ao menos uma letra maiúscula', test: (s) => /[A-Z]/.test(s) },
    { label: 'Ao menos uma letra minúscula', test: (s) => /[a-z]/.test(s) },
    { label: 'Ao menos um número', test: (s) => /[0-9]/.test(s) },
    { label: 'Ao menos um caractere especial', test: (s) => /[^A-Za-z0-9]/.test(s) }
  ];

  // Formata o telefone enquanto digita
  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0,2)}) ${digits.slice(2)}`;
    if (digits.length <= 11) return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`;
    return `(${digits.slice(0,2)}) ${digits.slice(2,7)}-${digits.slice(7,11)}`;
  };

  // Atualiza o estado do telefone formatando
  const handleTelefoneChange = (value) => {
    setTelefone(formatPhone(value));
    setError("");
    setSuccess("");
    setShowPasswordRequirements(false);
  };

  // Atualiza outros campos
  const handleNomeChange = (value) => {
    setNome(value);
    setError("");
    setSuccess("");
    setShowPasswordRequirements(false);
  };
  const handleEmailChange = (value) => {
    setEmail(value);
    setError("");
    setSuccess("");
    setShowPasswordRequirements(false);
  };
  const handleSenhaChange = (value) => {
    setSenha(value);
    setError("");
    setSuccess("");
    setShowPasswordRequirements(false);
  };
  const handleConfirmSenhaChange = (value) => {
    setConfirmSenha(value);
    setError("");
    setSuccess("");
    setShowPasswordRequirements(false);
  };

  const decodeToken = (token) => {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
    );
    return JSON.parse(jsonPayload);
  };

  // Envia o formulário para criar um novo cliente
  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    setShowPasswordRequirements(false);
    if (!nome || !email || !telefone || !senha || !confirmSenha) {
        setError("Por favor, preencha todos os campos.");
        return;
    }
    if (!emailRegex.test(email)) {
        setError("Email inválido.");
        return;
    }
    if (!phoneRegex.test(telefone)) {
        setError("Telefone inválido. Use o formato (XX) XXXXX-XXXX.");
        return;
    }
    if (senha !== confirmSenha) {
        setError("As senhas não coincidem.");
        return;
    }
    const failedReqs = passwordRequirements.filter(r => !r.test(senha));
    if (failedReqs.length > 0) {
        setError("Senha inválida. Veja os requisitos abaixo.");
        setShowPasswordRequirements(true);
        return;
    }
    setLoading(true);
    try {
        const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://172.16.1.234:3000";
        const response = await fetch(`${API_URL}/api/clientes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, telefone, senha })
        });

        const data = await response.json();
        console.log("Backend Response:", data); // Debugging

        if (data.success && data.token) {
            await AsyncStorage.setItem('authToken', data.token);
            console.log("Token stored successfully");
            // Decode token and store UserId and UserName
            const decodedToken = decodeToken(data.token);
            console.log("Decoded Token:", decodedToken);
            await AsyncStorage.setItem('UserId', decodedToken.id.toString());
            if (decodedToken.nome) {
                await AsyncStorage.setItem('UserName', decodedToken.nome.toString());
            }
            setSuccess("Cadastro realizado com sucesso!");
            setTimeout(() => router.push("/home/home"), 1500);
        } else {
            setError(data.message || "Erro ao cadastrar. Tente novamente.");
        }
    } catch (err) {
        console.error("Erro ao cadastrar:", err);
        setError("Erro ao cadastrar. Tente novamente.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={verticalScale(-57)} // adjust for your header height
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ backgroundColor: "#0B2A3A" }}
        >
          <View style={styles.formContainer}>
            {/* Logo e nome do hotel */}
            <View style={styles.headerRow}>
              <Image
                source={require("../../assets/images/Logo.png")}
                style={styles.logo}
              />
            </View>
          </View>
          <View style={styles.inputs}>
            {/* Campo Nome */}
            <Text style={styles.label}>Nome</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={scale(14)}
                color="#000"
                style={styles.icon}
              />
              <TextInput
                style={[styles.input, { fontSize: scale(12) }]}
                placeholder="Digite seu nome"
                placeholderTextColor="#000"
                value={nome}
                onChangeText={handleNomeChange}
              />
            </View>

            {/* Campo Email */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="alternate-email"
                size={scale(14)}
                color="#000"
                style={styles.icon}
              />
              <TextInput
                style={[styles.input, { fontSize: scale(12), borderColor: emailRegex.test(email) || !email ? '#fff' : 'red', borderWidth: email && !emailRegex.test(email) ? 1 : 0 }]}
                placeholder="Digite seu email"
                placeholderTextColor="#000"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
              />
            </View>

            {/* Campo Telefone */}
            <Text style={styles.label}>Telefone</Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="call-outline"
                size={scale(14)}
                color="#000"
                style={styles.icon}
              />
              <TextInput
                style={[styles.input, { fontSize: scale(12), borderColor: phoneRegex.test(telefone) || !telefone ? '#fff' : 'red', borderWidth: telefone && !phoneRegex.test(telefone) ? 1 : 0 }]}
                placeholder="Digite seu telefone"
                placeholderTextColor="#000"
                value={telefone}
                onChangeText={handleTelefoneChange}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

            {/* Campo Senha */}
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="lock-outline"
                size={scale(14)}
                color="#000"
                style={styles.icon}
              />
              <TextInput
                style={[styles.input, { fontSize: scale(12), borderColor: passwordRequirements.every(r => r.test(senha)) || !senha ? '#fff' : 'red', borderWidth: senha && !passwordRequirements.every(r => r.test(senha)) ? 1 : 0 }]}
                placeholder="Digite sua senha"
                placeholderTextColor="#000"
                value={senha}
                onChangeText={handleSenhaChange}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={{ marginLeft: scale(8) }}
              >
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={scale(20)}
                  color="#000"
                />
              </TouchableOpacity>
            </View>

            {/* Campo Confirme a Senha */}
            <Text style={styles.label}>Confirme a senha</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons
                name="lock-outline"
                size={scale(14)}
                color="#000"
                style={styles.icon}
              />
              <TextInput
                style={[styles.input, { fontSize: scale(12), borderColor: confirmSenha && senha !== confirmSenha ? 'red' : '#fff', borderWidth: confirmSenha && senha !== confirmSenha ? 1 : 0 }]}
                placeholder="Confirme sua senha"
                placeholderTextColor="#000"
                value={confirmSenha}
                onChangeText={handleConfirmSenhaChange}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={{ marginLeft: scale(8) }}
              >
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={scale(20)}
                  color="#000"
                />
              </TouchableOpacity>
            </View>

            {/* Lista de requisitos da senha só após submit */}
            {showPasswordRequirements && senha && passwordRequirements.some(r => !r.test(senha)) && (
              <View style={{ marginVertical: verticalScale(8), marginLeft: scale(8) }}>
                {passwordRequirements.map((r, idx) => (
                  <Text key={idx} style={{ color: 'red', opacity: r.test(senha) ? 0.5 : 1, fontSize: scale(13) }}>
                    • {r.label}
                  </Text>
                ))}
              </View>
            )}

            {/* Mensagens de erro e sucesso */}
            {error ? (
              <Text style={{ color: 'red', textAlign: 'center', marginVertical: verticalScale(8) }}>{error}</Text>
            ) : null}
            {success ? (
              <Text style={{ color: 'green', textAlign: 'center', marginVertical: verticalScale(8) }}>{success}</Text>
            ) : null}
          </View>
          {/* Botão Criar Conta */}
          <TouchableOpacity onPress={handleSubmit} style={styles.button} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Criar conta'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  topImage: {
    width: scale(350),
    height: verticalScale(200),
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#0B2A3A",
    padding: scale(20),
    borderTopLeftRadius: scale(25),
    borderTopRightRadius: scale(25),
    marginTop: verticalScale(-60),
    marginBottom: verticalScale(10),
    paddingTop: verticalScale(40),
    pardingBottom: verticalScale(-10),
  },
  inputs: {
    padding: scale(15),
    backgroundColor: "#0B2A3A",
    marginTop: verticalScale(-70),
    marginBottom: verticalScale(-20),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  logo: {
    width: scale(100),
    height: verticalScale(100),
    resizeMode: "contain",
    marginRight: scale(10),
  },
  label: {
    color: "#fff",
    fontSize: scale(12),
    marginBottom: verticalScale(4),
    marginLeft: scale(2),
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: scale(15.08),
    marginBottom: verticalScale(22),
    paddingHorizontal: scale(12),
  },
  icon: {
    marginRight: scale(8),
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: scale(10),
    paddingVertical: verticalScale(7),
    fontSize: scale(12),
  },
  button: {
    backgroundColor: "#006494",
    paddingVertical: verticalScale(9),
    borderRadius: scale(14),
    alignItems: "center",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(40),
    marginHorizontal: scale(15),
  },
  buttonText: {
    color: "#fff",
    fontSize: scale(12),
    fontWeight: "bold",
  },
});
