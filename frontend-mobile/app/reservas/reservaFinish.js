import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import BottomNav from '../../components/bottomNav';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ReservaFinish() {
  const router = useRouter();
  const {
    quartoNome,
    quartoImage,
    checkInDate,
    checkOutDate,
    guests,
  } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Image
          source={{ uri: quartoImage }}
          style={styles.imagem}
          resizeMode="cover"
      />
      <ScrollView style={styles.info}>
          <Text style={styles.titulo}>Reserva confirmada!</Text>
          <Text style={styles.roomName}>{quartoNome}</Text>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Check-in:</Text>
            <Text style={styles.value}>{checkInDate}</Text>
          </View>

          <View style={styles.detailContainer}>
            <Text style={styles.label}>Check-out:</Text>
            <Text style={styles.value}>{checkOutDate}</Text>
          </View>
          
          <View style={styles.detailContainer}>
            <Text style={styles.label}>Hóspedes:</Text>
            <Text style={styles.value}>{guests}</Text>
          </View>

          <TouchableOpacity style={styles.botao} onPress={() => router.push('/home/home')}>
              <Text style={styles.textoBotao}>Voltar para o início</Text>
          </TouchableOpacity>
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#13293D',
  },
  imagem: {
      width: '100%',
      height: '40%',
  },
  info: {
      flex: 1,
      backgroundColor: '#142c42',
      padding: 20,
      marginTop: -20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
  },
  titulo: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 24,
      marginBottom: 8,
  },
  roomName: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  detailContainer: {
    marginBottom: 15,
  },
  label: {
      color: '#a0aec0',
      fontSize: 16,
      marginBottom: 4,
  },
  value: {
      color: '#fff',
      fontSize: 18,
  },
  botao: {
      backgroundColor: '#006494',
      borderRadius: 12,
      paddingVertical: 14,
      marginTop: 40,
      alignItems: 'center',
  },
  textoBotao: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
  },
});