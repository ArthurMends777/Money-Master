import React, { useState } from 'react';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Input, SubmitButton, SubmitText, BtnReceita } from './styles';
import { Container, Text, CustomAlert, Header } from '../../Components';
import { getDatabase, ref, push, set } from 'firebase/database';
import { auth } from '../../../firebaseConection';

export const TransectionScreen = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

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

      const sanitizedAmount = amount.replace(',', '.');

      const currentDate = new Date();
      const dateString = currentDate.toISOString();

      // Estrutura de dados para a transação
      const transactionData = {
        description,
        amount: parseFloat(sanitizedAmount),
        type: transactionType,
        userId: auth.currentUser.uid, // Adapte conforme sua autenticação
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
        <Container bg="bg" align="center">
          <Text size={24} mb={15} weight="bold">
            Registrar Transação
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

          <Container mt={10} bg='bg' h={70} dir="row" justify="space-around">
            <BtnReceita onPress={() => setTransactionType('Receita')}>
              <Text size={18} color="white">
                Receita
              </Text>
            </BtnReceita>
            <BtnReceita onPress={() => setTransactionType('Despesa')}>
              <Text size={18} color="white">
                Despesa
              </Text>
            </BtnReceita>
          </Container>

          <SubmitButton onPress={handleRegister}>
            <SubmitText>Registrar</SubmitText>
          </SubmitButton>

          {/* Renderize o componente de alerta personalizado */}
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