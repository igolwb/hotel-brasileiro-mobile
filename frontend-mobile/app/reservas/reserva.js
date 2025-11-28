import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import BottomNav from '../../components/bottomNav';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';

export default function ReservaPage() {
  const { id } = useLocalSearchParams();

  const [quarto, setQuarto] = useState(null);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState('1');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Date picker visibility
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchQuarto = async () => {
        try {
          const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
          const token = await AsyncStorage.getItem('authToken');
          const response = await fetch(`${API_URL}/api/quartos/${id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (data.success) {
            setQuarto(data.data);
          } else {
            setError(data.message);
          }
        } catch (err) {
          setError('Erro ao buscar detalhes do quarto.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchQuarto();
    }
  }, [id]);

  // Util functions
  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
  };

  const getDiarias = () => {
    if (!checkInDate || !checkOutDate || checkInDate.length < 10 || checkOutDate.length < 10) return 0;
    const dataInicio = parseDate(checkInDate);
    const dataFim = parseDate(checkOutDate);
    if (isNaN(dataInicio) || isNaN(dataFim) || dataInicio >= dataFim) return 0;
    const diffTime = dataFim.getTime() - dataInicio.getTime();
    const diarias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diarias;
  };

  const diarias = getDiarias();
  const total = quarto && diarias > 0 ? Number(quarto.preco) * diarias : 0;

  // Handle date selection
  const handleCheckInChange = (event, selectedDate) => {
    setShowCheckInPicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toLocaleDateString('pt-BR');
      setCheckInDate(formatted);
      // Auto-adjust checkout if earlier than check-in
      if (checkOutDate && parseDate(checkOutDate) <= selectedDate) {
        setCheckOutDate('');
      }
    }
  };

  const handleCheckOutChange = (event, selectedDate) => {
    setShowCheckOutPicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toLocaleDateString('pt-BR');
      setCheckOutDate(formatted);
    }
  };

  const handlePaymentCheckout = async () => {
    if (!checkInDate || !checkOutDate || !guests || checkInDate.length < 10 || checkOutDate.length < 10) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const dataInicio = parseDate(checkInDate);
    const dataFim = parseDate(checkOutDate);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (isNaN(dataInicio) || dataInicio < hoje) {
      Alert.alert('Erro', 'A data de início não pode ser no passado.');
      return;
    }

    if (dataInicio >= dataFim) {
      Alert.alert('Erro', 'A data de início deve ser anterior à data de fim.');
      return;
    }

    try {
      const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
      const token = await AsyncStorage.getItem('authToken');

      // Step 1: Create reservation in the database
      const res = await fetch(`${API_URL}/api/reservas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quarto_id: id,
          hospedes: guests,
          inicio: `${dataInicio.toISOString().split('T')[0]}`,
          fim: `${dataFim.toISOString().split('T')[0]}`,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        Alert.alert('Erro', err.error || 'Erro ao criar reserva');
        return;
      }

      const reservaData = await res.json();

      // Step 2: Proceed to payment checkout
      const items = [
        {
          name: quarto.nome,
          quantity: 1,
          unit_amount: Math.round(total * 100), // centavos
        },
      ];

      const customer = {
        name: 'Cliente',
        email: 'cliente@teste.com',
        tax_id: '12345678909',
        phones: [
          { country: '55', area: '11', number: '999999999', type: 'MOBILE' },
        ],
      };

      const redirectUrls = {
        success: 'https://redirecturl-ppv3.onrender.com/reserva/reservaFinish',
        failure: 'https://redirecturl-ppv3.onrender.com/reserva/reservaFinish',
      };

      const paymentRes = await fetch(`${API_URL}/api/payments/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          referenceId: `reserva_${reservaData.data?.id || id}`,
          customer,
          items,
          redirectUrls,
        }),
      });

      const paymentData = await paymentRes.json();

      if (paymentData.success && paymentData.checkoutUrl) {
        Linking.openURL(paymentData.checkoutUrl);
      } else {
        Alert.alert('Erro', 'Erro ao iniciar o pagamento.');
        console.error('Checkout error:', paymentData);
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar reserva ou checkout.');
      console.error(error);
    }
  };

  // Update the handleReserva function to call handlePaymentCheckout
  const handleReserva = () => {
    if (!checkInDate || !checkOutDate || !guests || checkInDate.length < 10 || checkOutDate.length < 10) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    handlePaymentCheckout();
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error || !quarto) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error || 'Quarto não encontrado.'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: quarto.imagem_url }}
        style={styles.imagem}
        resizeMode="cover"
      />

      <ScrollView style={styles.info}>
        <Text style={styles.titulo}>Escolha suas datas</Text>

        {/* Check-in */}
        <Text style={styles.label}>Quando seu descanso começa?</Text>
        <TouchableOpacity onPress={() => setShowCheckInPicker(true)}>
          <View pointerEvents="none">
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#999"
              value={checkInDate}
              editable={false}
            />
          </View>
        </TouchableOpacity>
        {showCheckInPicker && (
          <DateTimePicker
            value={checkInDate ? parseDate(checkInDate) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleCheckInChange}
            minimumDate={new Date()}
          />
        )}

        {/* Check-out */}
        <Text style={styles.label}>Quando a saudade vai bater?</Text>
        <TouchableOpacity onPress={() => setShowCheckOutPicker(true)}>
          <View pointerEvents="none">
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              placeholderTextColor="#999"
              value={checkOutDate}
              editable={false}
            />
          </View>
        </TouchableOpacity>
        {showCheckOutPicker && (
          <DateTimePicker
            value={checkOutDate ? parseDate(checkOutDate) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleCheckOutChange}
            minimumDate={checkInDate ? parseDate(checkInDate) : new Date()}
          />
        )}

        {/* Guests */}
        <Text style={styles.label}>Quantidade de pessoas</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => setGuests((prev) => Math.max(1, Number(prev) - 1))}
          >
            <Text style={styles.circleIcon}>-</Text>
          </TouchableOpacity>

          <Text style={styles.counterValue}>{guests}</Text>

          <TouchableOpacity
            style={styles.circleButton}
            onPress={() => setGuests((prev) => Math.min(10, Number(prev) + 1))}
          >
            <Text style={styles.circleIcon}>+</Text>
          </TouchableOpacity>
        </View>

        {total > 0 && (
          <Text style={styles.totalText}>
            Total: R$ {total.toFixed(2)} ({diarias} diárias)
          </Text>
        )}

        <TouchableOpacity onPress={handleReserva} style={styles.botao}>
          <Text style={styles.textoBotao}>Reservar</Text>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
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
    marginBottom: 20,
  },
  label: {
    color: '#E8F1F2',
    fontSize: 16,
    marginBottom: 6,
    marginTop: 10,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#E8F1F2',
    color: '#333',
    padding: 12,
    borderRadius: 15,
    fontSize: 16,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#006494",
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 20,
    marginTop: 5,
  },
  circleButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#006494",
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  circleIcon: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "semibold",
    textAlign: "center",
    marginTop: -3.7,
  },
  counterValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    minWidth: 40,
  },
  totalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    alignSelf: 'center',
  },
  botao: {
    backgroundColor: '#006494',
    borderRadius: 15,
    paddingVertical: 10,
    marginTop: 3,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
