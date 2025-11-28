
import AsyncStorage from '@react-native-async-storage/async-storage';

// JWT decode helper
export const decodeToken = (token) => {
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

// Usage:
// await handleCad({ nome, email, telefone, senha, confirmSenha, emailRegex, phoneRegex, passwordRequirements, setError, setSuccess, setShowPasswordRequirements, setLoading, router })
const handleCad = async ({
    nome,
    email,
    telefone,
    senha,
    confirmSenha,
    emailRegex,
    phoneRegex,
    passwordRequirements,
    setError,
    setSuccess,
    setShowPasswordRequirements,
    setLoading,
    router
}) => {
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
        const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.106:3000";
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

export default handleCad;