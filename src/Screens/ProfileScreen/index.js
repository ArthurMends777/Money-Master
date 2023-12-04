import React, { useState, useEffect } from "react";
import { Header, Container, Text } from "../../Components";
import { TouchableOpacity, View, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from '../../../firebaseConection';
import { ref, get, getDatabase, updateProfile } from 'firebase/database';
import { updateEmailAuth, updatePassword, sendEmailVerification  } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';

export const ProfileScreen = () => {
    const navigation = useNavigation();
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [newName, setNewName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigation.navigate('Login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error.message);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const user = auth.currentUser;
            const db = getDatabase();

            // Atualizar o nome de exibição
            if (newName) {
                await updateProfile(user, { displayName: newName });
                setDisplayName(newName);
            }

            // Atualizar o e-mail
            if (newEmail) {
                // Enviar e-mail de verificação antes de alterar o e-mail
                await sendEmailVerification(user);

                // Atualizar apenas se o e-mail já estiver verificado
                let verificade = user.emailVerified;
                verificade = true;
                if (verificade) {
                    await updateEmailAuth(user, newEmail);
                    setEmail(newEmail);
                } else {
                    alert("Um e-mail de verificação foi enviado. Verifique seu novo e-mail antes de continuar.");
                    return;
                }
            }

            // Atualizar a senha
            if (newPassword) {
                await updatePassword(user, newPassword);
            }

            // Atualizar os dados do usuário no Realtime Database
            const userRef = ref(db, `users/${user.uid}`);
            await update(userRef, { name: newName });

            alert("Perfil atualizado com sucesso!");
            setIsEditingName(false); // Desativar o modo de edição após a atualização
        } catch (error) {
            console.error("Erro ao atualizar o perfil:", error.message);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    const uid = user.uid;
                    const db = getDatabase();
                    const userRef = ref(db, `users/${uid}`);
                    const userEmail = user.email;

                    const snapshot = await get(userRef);

                    if (snapshot.exists()) {
                        // Obtém a propriedade 'name' do nó 'users/UID'
                        const userName = snapshot.val().name;
                        setDisplayName(userName || 'Nome de usuário não definido');
                        setEmail(userEmail || 'E-mail não definido');
                    } else {
                        console.error('Nó de usuário não encontrado no Realtime Database.');
                    }
                } else {
                    console.error('Usuário não está logado.');
                    navigation.navigate('Login');
                }
            } catch (error) {
                console.error('Erro ao buscar dados do usuário:', error.message);
            }
        };

        fetchUserData();
    }, [navigation]);

    return (
        <Container>
            <Header />
            <Container bg="home" h={50} dir="row" align="center" mt={10}>
                <Text mr={10}> </Text>
                <MaterialIcons name="people" size={28} color="black" />
                <Text size={20} ml={10} > Tela de Perfil do usuário</Text>
            </Container>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {isEditingName ? (
                    <TextInput
                        style={{ flex: 1, padding: 5, fontSize: 18 }}
                        placeholder="Novo nome"
                        value={newName}
                        onChangeText={(text) => setNewName(text)}
                    />
                ) : (
                    <>
                        <Text size={18} mt={10} style={{ flex: 1 }}>
                            Bem-vindo, {displayName}!
                        </Text>
                        <TouchableOpacity onPress={() => setIsEditingName(true)}>
                            <MaterialIcons name="edit" size={24} color="black" />
                        </TouchableOpacity>
                    </>
                )}
            </View>
            <Text size={16} mt={5}>
                E-mail: {email}
            </Text>
            <View>
                <TextInput
                    placeholder="Novo e-mail"
                    value={newEmail}
                    onChangeText={(text) => setNewEmail(text)}
                />
                <TextInput
                    placeholder="Nova senha"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={(text) => setNewPassword(text)}
                />
                <TouchableOpacity onPress={handleUpdateProfile}>
                    <Container bg="green" w={200} h={40} justify="center" align="center" style={{ alignSelf: 'center' }}>
                        <Text size={18} color="white">Atualizar Perfil</Text>
                    </Container>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleLogout}>
                <Container bg="red" w={200} h={40} justify="center" align="center" style={{ alignSelf: 'center' }}>
                    <Text size={18} color="white">Logout</Text>
                </Container>
            </TouchableOpacity>
        </Container>
    );
};
