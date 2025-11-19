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
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { scale, verticalScale } from 'react-native-size-matters';
import handleLogin from "../../services/handleLogin";

// Componente principal da tela de login
export default function Login() {
    // Estados dos campos
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleLoginPress = () => {
  handleLogin(email, senha, setErrorMsg, setLoading, router);
  };

    return (
        <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={verticalScale(-167)} // Adjusted offset for header height
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
                keyboardShouldPersistTaps="handled" // Ensures taps dismiss the keyboard
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
                    {/* Campo Email */}
                    <Text style={styles.label}>Email</Text>
                    <View style={styles.inputWrapper}>
                        <MaterialIcons
                            name="alternate-email"
                            size={15}
                            color="#000"
                            style={styles.icon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Digite seu email"
                            placeholderTextColor="#000"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />
                    </View>

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
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity
                            onPress={() => setShowPassword((prev) => !prev)}
                            style={{ marginLeft: 8 }}
                        >
                            <MaterialIcons
                                name={showPassword ? "visibility-off" : "visibility"}
                                size={20}
                                color="#000"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Mensagem de erro */}
                {errorMsg ? (
                    <Text style={{ color: 'red', textAlign: 'center', marginVertical: 8 }}>{errorMsg}</Text>
                ) : null}

                {/* Botão para recuperar senha */}
                <TouchableOpacity
                    onPress={() => router.push("/auth/RecuperarSenha")}
                    style={styles.sa}
                >
                    <Text style={styles.texto}>Esqueceu sua senha?</Text>
                </TouchableOpacity>

                {/* Botão para entrar na home */}
                <TouchableOpacity
                    onPress={handleLoginPress}
                    style={styles.button}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? "Entrando..." : "Entrar"}</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    topImage: {
        width: scale(350),
        height: verticalScale(250),
        resizeMode: "cover",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    texto: {
        color: "#fff",
        fontSize: scale(12),
        fontWeight: "semibold",
        textAlign: "right",
        marginRight: 20,
    },
    formContainer: {
        flex: 1,
        backgroundColor: "#0B2A3A",
        padding: 20,
        marginTop: -60,
        paddingTop: verticalScale(25),
    },
    inputs: {
        padding: 15,
        backgroundColor: "#0B2A3A",
        marginTop: verticalScale(-40),
        marginBottom: -20,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    logo: {
        width: scale(100),
        height: verticalScale(100),
        resizeMode: "contain",
        marginRight: 10,
    },
    label: {
        color: "#fff",
        fontSize: scale(13),
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
        paddingVertical: verticalScale(7),
        fontSize: scale(12),
    },
    button: {
        backgroundColor: "#006494",
        paddingVertical: verticalScale(10),
        borderRadius: 14,
        alignItems: "center",
        marginTop: 20,
        marginBottom: verticalScale(177),
        marginHorizontal: 14,
    },
    buttonText: {
        color: "#fff",
        fontSize: scale(15),
        fontWeight: "bold",
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        paddingRight: 20,
        marginBottom: 10,
    },
});
