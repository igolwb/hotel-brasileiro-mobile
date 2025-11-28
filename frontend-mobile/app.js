import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import RootLayout from "./app/_layout";

const linking = {
  prefixes: ["hotelbrasileiro://"], // Deep link scheme
  config: {
    screens: {
      "(tabs)/index": "tabs/index",
      "auth/Login": "auth/login",
      "auth/Cadastro": "auth/cadastro",
      "auth/RecuperarSenha": "auth/recuperar-senha",
      "auth/pwconfirm": "auth/pwconfirm",
      "home/home": "home",
      "chat/chatPage": "chat/chat-page",
      "reservas/quartoDesc": "reservas/quarto-desc",
      "reservas/reserva": "reservas/reserva",
      "reservas/reservaConfirm": "reservas/reserva-confirm",
      "reservas/reservaFinish": "reservas/reserva-finish",
      "user/userPage": "user/user-page",
      "user/changepw": "user/change-pw",
      "user/pwCode": "user/pw-code",
      "user/confirmNewPw": "user/confirm-new-pw",
      "+not-found": "not-found",
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <RootLayout />
    </NavigationContainer>
  );
}