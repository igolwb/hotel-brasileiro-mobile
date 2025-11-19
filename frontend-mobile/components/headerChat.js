import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import { useRouter } from "expo-router";

export default function HeaderChat() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Image
        source={require("../assets/images/Logo.png")}
        style={styles.image}
      />
      <TouchableOpacity
        onPress={() => router.push("/home/home")}
        style={styles.homeButton}
      >
        <Image
          source={require("../assets/images/voltarBtn.png")} // Replace with your actual image path
          style={styles.homeButtonIcon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: verticalScale(90),
    backgroundColor: "#13293D",
    justifyContent: "space-between", // Adjusted to space elements
    alignItems: "center",
    flexDirection: "row", // Added to align items horizontally
    padding: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  image: {
    width: 150,
    height: 60,
    marginTop: verticalScale(20),
    marginLeft: scale(10),
  },
  homeButton: {
    marginTop: verticalScale(29),
    marginRight: scale(10),
    padding: scale(5),
  },
  homeButtonIcon: {
    width: scale(37),
    height: scale(37),
  },
});
