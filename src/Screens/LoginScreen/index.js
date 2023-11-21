import React, { useState } from 'react';
import { Image, Modal } from 'react-native';
import { Container, Text, InputLogin, BtnLogin, BtnAcont, ScrollContainer } from '../../Components';
import { Ionicons, Octicons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';  
import { auth } from '../../../firebaseConection';

export const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Verificações de validação
    if (!email || !password) {
      setError('Preencha todos os campos');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('Login bem-sucedido');
        navigation.navigate('Home')
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
          setError('Credenciais inválidas. Verifique seu e-mail e senha.');
        } else {
          console.log(errorMessage);
        }
      });
  };
  
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ScrollContainer>
      <Container bg="roxo" align="center">
        <Image source={require('../../../assets/logo.png')} style={{ width: 320, height: 230, marginTop: 50 }} />
        <Container h={50} bg="roxo" dir="row" ml={60}>
          <Text color="white" size={20}> Bem-vindo(a) ao nosso aplicativo</Text>
        </Container>
        <Container bg="roxo" h={200} justify="center" align="center">
          <Container h={100} bg="roxo" ml={60}>
            <Text size={20} color="white"> E-mail </Text>
            <InputLogin
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </Container>
          <Container h={100} bg="roxo" ml={60}>
            <Text size={20} color="white"> Senha </Text>
            <InputLogin
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            />
          </Container>
        </Container>


        <BtnLogin onPress={handleLogin}>
          <Text color="white"> Login </Text>
        </BtnLogin>
        {error ? <Text color="red">{error}</Text> : null}

        <Container mt={20} align="center" bg="roxo">
          <BtnAcont onPress={() => navigation.navigate('Signup')}>
            <Octicons name="people" size={30} color="#502779" />
            <Text color="roxoClaro" size={24}> Criar uma conta</Text>
          </BtnAcont>
          <BtnAcont onPress={openModal}>
            <Ionicons name="md-globe-outline" size={30} color="#502779" />
            <Text color="roxoClaro" size={22}> Continuar de outra forma </Text>
          </BtnAcont>
        </Container>
      </Container>

      <Modal visible={modalVisible}  transparent={true} animationType="slide">
        <Container bg="roxo" align="center">
          <Container h={50} mt={30} bg="roxo" align="center">
            <Text color="roxoText" weight="bold"> Continuar de outra forma </Text>
          </Container>

          <Container h={150} align="center" justify="center" bg="roxo">
            <BtnAcont bg="roxoClaro">
              <AntDesign name="google" size={30} color="white"/>
              <Text color="white" size={25}> Continuar com o Google</Text>
            </BtnAcont>
            <BtnAcont bg="roxoClaro" mt={10}>
              <FontAwesome5 name="facebook" size={30} color="white" />
              <Text color="white" size={25}> Continuar com o Facebook</Text>
            </BtnAcont>
          </Container>

          <Container h={450} bg="roxo" align="center" justify="flex-end">
            <BtnAcont onPress={closeModal}>
              <Text color="white"> Voltar </Text>
            </BtnAcont>
          </Container>
        </Container>
      </Modal>
    </ScrollContainer>
  );
};