import React, { useState } from "react";
import { useEmailStore } from "../../services/emailStore";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ImageBackground,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

// Componente principal da tela de login
export default function Login() {
    // Estados dos campos
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const router = useRouter();
    const email = useEmailStore((state) => state.email);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUpdatePassword = async () => {
        setError("");
        if (!senha || !confirmarSenha) {
            setError("Preencha todos os campos.");
            return;
        }
        if (senha !== confirmarSenha) {
            setError("As senhas não coincidem.");
            return;
        }
        setLoading(true);
        try {
            // Debug log: show email and senha being sent
            console.log("Enviando para backend:", { email, senha });
            const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
            const response = await fetch(`${API_URL}/api/clientes/update-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha }),
            });
            const data = await response.json();
            // Debug log: show backend response
            console.log("Resposta do backend:", data);
            if (response.ok && data.success) {
                setError("Senha redefinida com sucesso.");
                // Navegar para home após sucesso
                setTimeout(() => {
                    router.push("/");
                }, 1200);
            } else {
                setError(data.message || "Erro ao redefinir senha.");
            }
        } catch (_err) {
            setError("Erro de conexão. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
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
                    </View>
                </View>
                <View style={styles.inputs}>
                    {/* Texto acima dos inputs */}
                    <Text style={{ color: '#fff', fontSize: 25, textAlign: 'center', marginBottom: 40, fontWeight: 'intermedium' }}>
                        Digite a sua nova Senha
                    </Text>
                    {/* Campo Senha */}
                    <Text style={styles.label}>Senha</Text>
                    <View style={styles.inputWrapper}>
                        <MaterialIcons
                            name="lock-outline"
                            size={15}
                            color="#000"
                            style={styles.icon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Digite sua senha"
                            placeholderTextColor="#000"
                            value={senha}
                            onChangeText={setSenha}
                            secureTextEntry
                        />
                    </View>

                    {/* Campo Confirmar Senha */}
                    <Text style={styles.label}>Confirmar Senha:</Text>
                    <View style={styles.inputWrapper}>
                        <MaterialIcons
                            name="lock-outline"
                            size={15}
                            color="#000"
                            style={styles.icon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirme sua senha"
                            placeholderTextColor="#000"
                            value={confirmarSenha}
                            onChangeText={setConfirmarSenha}
                            secureTextEntry
                        />
                    </View>
                    {error ? (
                        <Text style={{ color: "red", textAlign: "center", marginVertical: 8 }}>
                            {error}
                        </Text>
                    ) : null}
                </View>

                {/* Botão para recuperar senha */}
                <TouchableOpacity
                    onPress={() => router.push("/auth/RecuperarSenha")}
                    style={styles.sa}
                >
                    {/* ... */}
                </TouchableOpacity>

                {/* Botão para redefinir senha */}
                <TouchableOpacity
                    onPress={handleUpdatePassword}
                    style={styles.button}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? "Redefinindo..." : "Redefinir Senha"}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    topImage: {
        width: "100%",
        height: 381,
        resizeMode: "cover",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    texto: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "intermediate",
        textAlign: "right",
        marginRight: 20,
    },
    formContainer: {
        flex: 1,
        backgroundColor: "#0B2A3A",
        padding: 20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        marginTop: -60,
        paddingTop: 40,
    },
    inputs: {
        padding: 15,
        backgroundColor: "#0B2A3A",
        marginTop: -100,
        marginBottom: -20,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    logo: {
        width: 167,
        height: 170,
        resizeMode: "contain",
        marginRight: 10,
    },
    headerText: {
        color: "#fff",
        fontWeight: "medium",
        fontSize: 22,
        lineHeight: 26,
    },
    label: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
        marginLeft: 2,
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 15.04,
        marginBottom: 18,
        paddingHorizontal: 14,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        backgroundColor: "transparent",
        borderRadius: 10,
        paddingVertical: 12,
        fontSize: 13,
    },
    button: {
        backgroundColor: "#006494",
        paddingVertical: 13,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 20,
        marginBottom: 170,
        marginHorizontal: 14,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "semibold",
    },
    sa: {
        // Adicione estilo para o botão de recuperar senha se quiser
    },
});