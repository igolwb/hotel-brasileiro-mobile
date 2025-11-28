import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Alert } from "react-native";
import { useRouter } from "expo-router";
import BottomNav from "../../components/bottomNav";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verticalScale, scale } from "react-native-size-matters";

export default function EditUser() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
    const [userId, setUserId] = useState(null);

    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
    // Placeholder for user photo, replace with actual image path or URL if available
    const userPhoto = require("../../assets/images/user_pfp.png");

    useEffect(() => {
        const fetchUserData = async () => {
            const token = await AsyncStorage.getItem('authToken');
            const id = await AsyncStorage.getItem('UserId');
            setUserId(id);

            if (!token || !id) {
                Alert.alert("Erro", "Você não está autenticado.");
                router.push("/auth/Login");
                return;
            }

            try {
                // Using /api/clientes/me which is authenticated by token and gets the current user
                const response = await fetch(`${API_URL}/api/clientes/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();

                if (data.success) {
                    setName(data.data.nome);
                    setEmail(data.data.email);
                    setPhone(data.data.telefone);
                } else {
                    Alert.alert("Erro", "Não foi possível carregar os dados do usuário.");
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                Alert.alert("Erro", "Ocorreu um erro de conexão.");
            }
        };

        fetchUserData();
    }, []);

    const handleSave = async () => {
        const token = await AsyncStorage.getItem('authToken');
        if (!userId || !token) {
            Alert.alert('Erro', 'Não foi possível salvar. Faça login novamente.');
            return;
        }

        try {
            // Update text data
            const response = await fetch(`${API_URL}/api/clientes/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    nome: name,
                    email: email,
                    telefone: phone
                })
            });

            const responseData = await response.json();
            if (!response.ok) {
                 Alert.alert('Erro ao salvar', responseData.message || 'Não foi possível atualizar os dados.');
                 return;
            }

            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
            router.back();

        } catch (error) {
            console.error('Save error:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar as alterações.');
        }
    };

    const handleChangePw = () => {
        router.push('/user/changePw');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Image
                    source={require("../../assets/images/voltarBtn.png")}
                    style={styles.backIcon}
                />
            </TouchableOpacity>

            {/* User photo and name */}
            <View style={styles.profileContainer}>
                <Image source={userPhoto} style={styles.profilePhoto} />
                <Text style={styles.profileName}>{name || "Usuário"}</Text>
            </View>

            {/* Campos de edição */}
            <View style={styles.formContainer}>
                <Text style={styles.label}>nome:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Usuário"
                    placeholderTextColor="#a0aec0"
                    value={name}
                    onChangeText={setName}
                />
                <Text style={styles.label}>e-mail:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="ex:exemplo@email.com"
                    placeholderTextColor="#a0aec0"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Text style={styles.label}>Telefone:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="(55)5555-5555"
                    placeholderTextColor="#a0aec0"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
                <TouchableOpacity style={styles.blueButton} onPress={handleChangePw}>
                    <Text style={styles.blueButtonText}>Alterar senha</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.blueButton} onPress={handleSave}>
                    <Text style={styles.blueButtonText}>Salvar</Text>
                </TouchableOpacity>
            </View>
            <BottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#0B2A3A',
		paddingTop: verticalScale(40),
		paddingHorizontal: 18,
		position: 'relative',
	},
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  backIcon: {
    color: "#fff",
    width: scale(33),
    height: verticalScale(33),
    fontSize: scale(28),
    fontWeight: "bold",
    marginLeft: 2,
    marginTop: scale(5),
  },
    profileContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 10,
    },
    profilePhoto: {
    width: 140,
    height: 140,
    marginTop: verticalScale(-20),
    borderRadius: 70, // Torna a imagem circular
    backgroundColor: "#ccc",
    marginBottom: 16,
    },
    profileName: {
    fontSize: scale(24),
    color: "#fff",
    fontWeight: "bold",
    },
    formContainer: {
        marginTop: 10,
        marginBottom: 30,
    },
    label: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: scale(14),
        marginBottom: 2,
        marginLeft: 6,
    },
    input: {
        backgroundColor: '#23344A',
        color: '#fff',
        borderRadius: 15,
        paddingHorizontal: 16,
        paddingVertical: verticalScale(6),
        fontSize: scale(13),
        marginBottom: 15,
    },
    blueButton: {
        backgroundColor: '#006494',
        borderRadius: 20,
        paddingVertical: verticalScale(9),
        alignItems: 'center',
        marginTop: verticalScale(10),
    },
    blueButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: scale(14),
    },
});
