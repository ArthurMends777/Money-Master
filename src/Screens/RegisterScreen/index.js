import React, { useState } from 'react';
import { Container, Text, InputLogin, BtnLogin, ScrollContainer } from '../../Components';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, getDatabase } from 'firebase/database';
import { auth } from '../../../firebaseConection';
import { isEmail } from 'validator';

export const SignupScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmePass, setConfirmePass] = useState('');
  const [error, setError] = useState('');

  const database = getDatabase(); 
const handleSignup = () => {
    const isStrongPassword = (password) => {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
      return passwordRegex.test(password);
    };

    if (name.length < 3) {
      setError('O nome deve ter no mínimo 3 letras');
      return;
    }

    if (!isEmail(email)) {
      setError('E-mail inválido');
      return;
    }

    if (!isStrongPassword(password)) {
      setError('A senha deve ter no mínimo 6 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula e um número');
      return;
    }

    if (password !== confirmePass) {
      setError('As senhas não coincidem');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const uid = user.uid;

        const userRef = ref(database, 'users/' + uid);

        set(userRef, {
          name: name,

        }).then(() => {
          console.log('Nome associado ao UID com sucesso!');
          navigation.navigate('Home');
        }).catch((error) => {
          console.error('Erro ao associar nome ao UID:', error);
        });

        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        
        console.log(errorMessage);
      });
  }

  return (
    <ScrollContainer>
      <Container bg="roxo" justify="center" align="center" mt={80}>
        <Text color="roxoText" weight="bold">Criar uma conta</Text>
        <Container h={500} w={300} bg="white" align="center" mt={20} br={20}>
          <Container h={350} justify="center" align="center">
            <InputLogin
              placeholder="Nome"
              value={name}
              onChangeText={(text) => setName(text)}
              placeholderTextColor="white"
              bg="roxo"
              color="white"
            />
            <InputLogin
              placeholder="E-mail"
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor="white"
              bg="roxo"
              color="white"
            />
            <InputLogin
              placeholder="Senha"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
              placeholderTextColor="white"
              bg="roxo"
              color="white"
            />
            <InputLogin
              placeholder="Confirme a senha"
              value={confirmePass}
              onChangeText={(text) => setConfirmePass(text)}
              secureTextEntry
              placeholderTextColor="white"
              bg="roxo"
              color="white"
            />
            {error ? <Text color="red" size={20}>{error}</Text> : null}
          </Container>
          <BtnLogin w={160} mt={50} onPress={handleSignup}>
            <Text color="roxoText"> Cadastrar</Text>
          </BtnLogin>
        </Container>
      </Container>
    </ScrollContainer>
  );
};