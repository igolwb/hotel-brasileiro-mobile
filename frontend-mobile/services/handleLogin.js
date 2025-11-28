import AsyncStorage from '@react-native-async-storage/async-storage';

// Usage: await handleLogin(email, senha, setErrorMsg, setLoading, router)
const handleLogin = async (email, senha, setErrorMsg, setLoading, router) => {
  setErrorMsg("");
  setLoading(true);
  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.106:3000";
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, senha })
    });

    const data = await response.json();
    console.log("Backend Response:", data); // Debugging

    if (data.success && data.token) {
      await AsyncStorage.setItem('authToken', data.token);
      console.log("Token stored successfully");

      // Decode token and store UserId
      const decodedToken = decodeToken(data.token);
      console.log("Decoded Token:", decodedToken);
      
      await AsyncStorage.setItem('UserId', decodedToken.id.toString());
      setLoading(false);
      if (router) {
        router.push("/home/home");
      }

      return data;
    } else {
      setErrorMsg(data.message || "Credenciais inválidas ou resposta inesperada.");
      setLoading(false);
      return null;
    }
  } catch (error) {
    setErrorMsg("Erro ao realizar login. Tente novamente.");
    setLoading(false);
    console.error("Login error:", error);
    return null;
  }
};

// Optional: JWT decode helper
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

export default handleLogin;
       