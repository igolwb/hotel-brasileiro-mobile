import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Poppins: require("../assets/fonts/Poppins-Medium.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/*  Fluxo principal (tabs) */}
        <Stack.Screen name="(tabs)/index" />

        {/*  Fluxo de autenticação */}
        <Stack.Screen name="auth/Login" />
        <Stack.Screen name="auth/Cadastro" />
        <Stack.Screen name="auth/RecuperarSenha" />
        <Stack.Screen name="auth/pwconfirm" />
        <Stack.Screen name="home/home" />
        <Stack.Screen name="chat/chatPage" />
        <Stack.Screen name="reservas/quartoDesc" />
        <Stack.Screen name="reservas/reserva" />
        <Stack.Screen name="reservas/reservaConfirm" />
        <Stack.Screen name="reservas/reservaFinish" />
        <Stack.Screen name="user/userPage" />
        <Stack.Screen name="user/changepw" />
        <Stack.Screen name="user/pwCode" />
        <Stack.Screen name="user/confirmNewPw" />

        {/*  Página de erro */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}