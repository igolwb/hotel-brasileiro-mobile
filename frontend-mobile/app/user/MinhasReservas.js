import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const MinhasReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        // 1. Obter o TOKEN JWT do AsyncStorage. A chave correta é 'authToken'.
        const token = await AsyncStorage.getItem('authToken'); // <-- CORREÇÃO AQUI

        if (!token) {
          setError('Usuário não autenticado.'); // Mensagem corrigida
          setLoading(false);
          // Opcional: redirecionar para a tela de login
          // router.replace('/login');
          return;
        }

        // 2. Usar a rota correta e enviar o token no cabeçalho
        const res = await fetch(`${API_URL}/api/reservas/minhas-reservas`, {
          headers: {
            'Authorization': `Bearer ${token}` // Enviar o token JWT correto
          }
        });

        const data = await res.json();

        // Tratar explicitamente o erro 403 que agora sabemos que pode ocorrer
        if (res.status === 403) {
            setError(data.error || 'Token inválido. Faça login novamente.');
            setLoading(false);
            return;
        }

        if (res.ok) {
          const mappedData = data.map(item => ({
            id: item.reserva_id,
            quarto: {
              nome: item.quarto_nome,
              // Garante que a URL da imagem seja completa
              imagem_url: item.imagem_url.startsWith('http') ? item.imagem_url : `${API_URL}/${item.imagem_url}`,
            },
          }));
          setReservas(mappedData);
        } else {
          setReservas([]);
          setError(data.error || 'Erro ao buscar reservas');
        }
      } catch (err) {
        setError('Erro ao conectar com o servidor.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservas();
  }, []);

  const handleDelete = async (reservaId) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Deseja realmente cancelar esta reserva?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            try {
              // Use a chave correta para o token aqui também
              const token = await AsyncStorage.getItem('authToken'); // <-- CORREÇÃO AQUI
              const response = await fetch(`${API_URL}/api/reservas/${reservaId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });

              if (response.ok) {
                setReservas(prevReservas => prevReservas.filter(r => r.id !== reservaId));
                Alert.alert("Sucesso", "Reserva cancelada com sucesso.");
              } else {
                const errorData = await response.json();
                Alert.alert("Erro", errorData.message || "Não foi possível cancelar a reserva.");
              }
            } catch (error) {
              Alert.alert("Erro", "Ocorreu um erro de conexão.");
            }
          }
        }
      ]
    );
  };


  return (
    // O restante do seu componente JSX permanece o mesmo
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
<Image
            source={require("../../assets/images/voltarBtn.png")}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Minhas Reservas</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <Text style={styles.loading}>Carregando...</Text>
        ) : error ? (
          <Text style={styles.empty}>{error}</Text>
        ) : reservas.length === 0 ? (
          <Text style={styles.empty}>Nenhuma reserva encontrada.</Text>
        ) : (
          reservas.map((reserva) => (
            <View style={styles.card} key={reserva.id}>
              <Image
                source={{ uri: reserva.quarto?.imagem_url}}
                style={styles.roomImage}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <Text style={styles.roomTitle}>{reserva.quarto?.nome || 'Quarto'}</Text>
                <TouchableOpacity style={styles.trashBtn} onPress={() => handleDelete(reserva.id)}>
                  <Icon name="delete" size={24} color="#222" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

    </View>
  );
};

// Seus estilos permanecem os mesmos...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13293D',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#13293D',
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  roomImage: {
    width: '100%',
    height: 140,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  roomTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#222',
  },
  trashBtn: {
    padding: 4,
  },
  loading: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  empty: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});


export default MinhasReservas;