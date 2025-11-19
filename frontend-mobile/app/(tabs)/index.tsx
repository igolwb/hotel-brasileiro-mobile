import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ImageBackground
      source={require("../../assets/images/fundo.png")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* CONTEÚDO PRINCIPAL (logo, estrelas, textos) */}
        <View style={styles.contentContainer}>
          <View style={styles.hotel}>
            <Image source={require("../../assets/images/Logo.png")} style={styles.logo} />
          </View>

          <View style={styles.starsContainer}>
            <Image source={require("../../assets/images/star.png")} style={styles.star} />
            <Image source={require("../../assets/images/star.png")} style={styles.star} />
            <Image source={require("../../assets/images/star.png")} style={styles.star} />
            <Image source={require("../../assets/images/star.png")} style={styles.star} />
            <Image source={require("../../assets/images/star.png")} style={styles.star} />
          </View>

          <Text style={styles.slogan}>
            Aqui, o relógio se rende ao seu compasso
          </Text>
          <Text style={styles.subtitle}>
            Um hotel que é menos lugar, mais estado de espírito
          </Text>
        </View>

        {/* DIV SEPARADA PARA OS BOTÕES */}
        <View style={styles.buttonsContainer}>
          {/* Ir para Login */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/auth/Login")}
          >
            <Text style={styles.buttonText}>Prosseguir para login</Text>
          </TouchableOpacity>

          {/* Ir para Cadastro */}
          <TouchableOpacity
            style={styles.buttonRegister}
            onPress={() => router.push("/auth/Cadastro")}
          >
            <Text style={styles.buttonTextRegister}>Criar minha conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    width: scale(350),
    height: verticalScale(700),
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },

  overlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    flex: 1,
    justifyContent: "space-between", // Alterado para distribuir espaço entre as divs
    alignItems: "center",
    padding: 20,
  },

  hotel: {
    marginTop: 0,
    marginBottom: 0,
  },

  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },

  buttonsContainer: {
    width: "100%",
    marginBottom: 30,
  },

  logo: {
    width: scale(150),
    height: verticalScale(150),
    marginLeft: scale(15),
    resizeMode: "contain",
  },

  starsContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: scale(-35), // Ajuste para descer as estrelas
    gap: 8,
    marginLeft: 35,
  },

  star: {
    width: scale(19),
    height: verticalScale(19),
    marginHorizontal: 2,
  },

  slogan: {
    fontSize: scale(16),
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 40,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: scale(13),
    color: "#ddd",
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#006494",
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: scale(13),
    fontWeight: "bold",

  },
  buttonRegister: {
    backgroundColor: "#00405C",
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: scale(35),
  },

  
  buttonTextRegister: {
    color: "#fff",
    fontSize: scale(13),
    fontWeight: "bold",
  },

    buttonRegister2: {
      justifyContent: "center",
    backgroundColor: "#6cadc9ff",
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonTextRegister2: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});