import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { TouchableWithoutFeedback, Keyboard, View } from 'react-native';
import { Input, SubmitButton, SubmitText, BtnReceita } from './styles';
import { Container, Text, CustomAlert, Header } from '../../Components';
import { getDatabase, ref, push, set, get } from 'firebase/database';

import { FontAwesome } from '@expo/vector-icons';
import { auth } from '../../../firebaseConection';

export const TransectionScreen = () => {
  const [description, setDescription] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [category, setCategory] = useState(''); // Novo estado para armazenar a categoria selecionada
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [categories, setCategories] = useState([]); // Estado para armazenar as categorias
  const [selectedCategory, setSelectedCategory] = useState(''); 

 // UseEffect para carregar as categorias ao montar o componente
 useEffect(() => {
  const fetchCategories = async () => {
    try {
      const categoriasRef = ref(getDatabase(), `categorias`);
      const snapshot = await get(categoriasRef);

      if (snapshot.exists()) {
        const categoriasArray = Object.entries(snapshot.val()).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setCategories(categoriasArray);
      }
    } catch (error) { 
      console.error('Erro ao buscar categorias:', error.message);
    }
  };

  fetchCategories();
}, []);

const handleRegister = async () => {
  try {
    // Verificar se a descrição e o valor foram preenchidos
    if (!description || !amount) {
      setAlertTitle('Erro');
      setAlertMessage('Preencha todos os campos.');
      setAlertVisible(true);
      return;
    }

    // Verificar se o tipo de transação foi selecionado
    if (!transactionType) {
      setAlertTitle('Erro');
      setAlertMessage('Selecione o tipo de transação (Receita/Despesa).');
      setAlertVisible(true);
      return;
    }

    // Verificar se uma categoria foi selecionada
    if (!selectedCategory) {
      setAlertTitle('Erro');
      setAlertMessage('Selecione uma categoria.');
      setAlertVisible(true);
      return;
    }

    const sanitizedAmount = amount.replace(',', '.');

    const currentDate = new Date();
    const dateString = currentDate.toISOString();

    const transactionData = {
        description,
        amount: parseFloat(sanitizedAmount),
        type: transactionType,
        category: selectedCategory, // Adiciona a categoria à estrutura de dados
        userId: auth.currentUser.uid,
        timestamp: dateString,
      };

      // Referência para a coleção "transactions" no Firebase usando o uid do usuário como parte do caminho
      const transactionsRef = ref(getDatabase(), `transactions/${auth.currentUser.uid}`);

      // Adicionar a transação ao Firebase
      const newTransactionRef = push(transactionsRef);
      await set(newTransactionRef, transactionData);

      // Limpar os campos após o registro
      setDescription('');
      setAmount('');
      setTransactionType('');
      setCategory(''); // Limpa a categoria após o registro

      setAlertTitle('Sucesso');
      setAlertMessage('Transação registrada com sucesso!');
      setAlertVisible(true);
    } catch (error) {
      console.error('Erro ao registrar transação:', error.message);
      setAlertTitle('Erro');
      setAlertMessage('Erro ao registrar transação. Tente novamente.');
      setAlertVisible(true);
    }
};

const closeAlert = () => {
  setAlertVisible(false);
};

  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container bg="white" align="center">
          <Header />
          <Text size={24} mb={15} mt={10} weight="bold">
            Registrar
          </Text>
          <Input
            placeholder="Descrição da transação"
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
          <Input
            placeholder="Valor"
            keyboardType="numeric"
            value={amount}
            onChangeText={(text) => setAmount(text)}
          />

        <Container mt={10} bg='white' h={70} dir="row" justify="space-around">
          <BtnReceita onPress={() => setTransactionType('Receita')}>
            <FontAwesome name="arrow-circle-up" size={28} color="green" />
            <Text size={18} ml={10} color="white">
              Receita
            </Text>
          </BtnReceita>
          <BtnReceita onPress={() => setTransactionType('Despesa')}>
            <FontAwesome name="arrow-circle-down" size={28} color="red" />
            <Text size={18} ml={10} color="white">
              Despesa
            </Text>
          </BtnReceita>
        </Container>

          {/* Adicione o Picker para escolher a categoria */}
          <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={{ height: 50, width: '100%' }}
      >
        <Picker.Item label="Selecione uma categoria" value="" />
        {categories.map((category) => (
          <Picker.Item key={category.id} label={category.nome} value={category.nome} />
        ))}
      </Picker>

        <SubmitButton onPress={handleRegister}>
          <SubmitText>Registrar</SubmitText>
        </SubmitButton>
          <CustomAlert
            visible={alertVisible}
            title={alertTitle}
            message={alertMessage}
            onClose={closeAlert}
          />
        </Container>
    </TouchableWithoutFeedback>
  );
};