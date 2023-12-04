import React, { useState, useEffect } from 'react';
import { TouchableOpacity, FlatList, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Container, Header, Text, CustomAlert } from '../../Components';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SaldoContainer, ContainerMovimentacao, UltimasMovis, CustomText, Filter, Totais } from './style';
import { ref, onValue, getDatabase } from 'firebase/database';
import { auth } from '../../../firebaseConection';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const [saldoVisivel, setSaldoVisivel] = useState(true);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [saldoAtual, setSaldoAtual] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filtro, setFiltro ] = useState("Filtrar");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const database = getDatabase();
        const transactionsRef = ref(database, `transactions/${auth.currentUser.uid}`);
        onValue(transactionsRef, (snapshot) => {
          const transactionsData = snapshot.val();
          
          if (transactionsData) {
            const transactionsArray = Object.values(transactionsData);

            transactionsArray.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setMovimentacoes(transactionsArray);

            const saldoCalculado = transactionsArray.reduce((acc, mov) => {
              return mov.type === 'Receita' ? acc + mov.amount : acc - mov.amount;
            }, 0);

            setSaldoAtual(saldoCalculado);
          } else {
            // Caso não haja transações, limpe o estado
            setMovimentacoes([]);
            setSaldoAtual(0);
          }
        });
      } catch (error) {
        console.error('Erro ao obter transações:', error.message);
      }
    };

    fetchTransactions();
  }, []);

  const handleShowAlert = (transaction) => {
    const { description, type, amount, timestamp, category } = transaction;

    // Formata a data para "dia/mês/ano"
    const formattedDate = new Intl.DateTimeFormat('pt-BR').format(new Date(timestamp));

    // Atualiza a mensagem do alerta incluindo a categoria
    const alertMessage = `Descrição: ${description}\nTipo: ${type}\nCategoria: ${category}\nValor: R$ ${amount.toFixed(2)}\nData: ${formattedDate}`;

    setAlertTitle('Detalhes da Transação');
    setAlertMessage(alertMessage);
    setAlertVisible(true);
  };

  const renderItem = ({ item }) => {
    // Converte a string de data para um objeto Date
    const data = new Date(item.timestamp);

    // Formata a data para "dia/mês/ano"
    const formattedDate = new Intl.DateTimeFormat('pt-BR').format(data);

    return (
      <TouchableOpacity onPress={() => handleShowAlert(item)}>
        <UltimasMovis>
          <CustomText bg={item.type === 'Receita' ? 'green' : 'despesas'}>
            <Text size={18} color="white">
              {item.type === 'Receita' ? 'Receitas' : 'Despesas'}
            </Text>
          </CustomText>
          <Container h={30} bg="home" dir="row" justify="space-between">
            <Text> R$ {item.amount ? item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 'Valor indisponível'} </Text>
            <Text size={18} mr={70}> {formattedDate} </Text>
          </Container>
        </UltimasMovis>
      </TouchableOpacity>
    );
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    setSelectedDate(selectedDate);
  };

  const clearDateFilter = () => {
    setShowDatePicker(false);
    setSelectedDate(null);
  };

  const calculateTotalReceitas = (transactions) => {
    const receitas = transactions.filter((transaction) => transaction.type === 'Receita');
    return receitas.reduce((total, transaction) => total + transaction.amount, 0);
  };
  
  const calculateTotalDespesas = (transactions) => {
    const despesas = transactions.filter((transaction) => transaction.type === 'Despesa');
    return despesas.reduce((total, transaction) => total + transaction.amount, 0);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  return (
    <Container>
      <Header> Minhas movimentações </Header>
      <Container h={150} justify="center" align="center" mt={20}>
        <SaldoContainer>
          <Text> Saldo da conta </Text>
          {saldoVisivel ? <Text> R$ {saldoAtual.toFixed(2)} </Text> : null}

          <TouchableOpacity onPress={() => setSaldoVisivel(!saldoVisivel)}>
            {saldoVisivel ? <Ionicons name="eye-off-sharp" size={30} color="black" />:
                            <Ionicons name="eye-sharp" size={30} color="black" />} 
          </TouchableOpacity>
        </SaldoContainer>
      </Container>

      <Container h={90} dir="row" justify="space-between" align="center" mt={20}>
        <Totais>
          <Text size={22}> Receitas: </Text>
          <Text size={22} color="green">
            R$ {calculateTotalReceitas(movimentacoes).toFixed(2)}   
          </Text>
        </Totais>
        <Totais>
          <Text size={22}> Despesas: </Text>
          <Text size={22} color="despesas">
            R$ {calculateTotalDespesas(movimentacoes).toFixed(2)} 
          </Text>
        </Totais>
    
      </Container>

      <Container h={320} justify="center" align="center">
        <ContainerMovimentacao>
          <Container mt={10} h={30} dir="row" justify="space-between">
            <Ionicons name="calendar-outline" size={24} color="black" />
            <Text size={20} ml={-45}> Minhas movimentações</Text>
            <Filter onPress={openDatePicker}>
              <Text size={20}> {filtro} </Text>
            </Filter>
            {selectedDate && (
              <TouchableOpacity onPress={clearDateFilter}>
                <Text size={20}> Limpar </Text>
              </TouchableOpacity>
            )}
          </Container>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}

          <FlatList
            data={filterTransactionsByDate(movimentacoes, selectedDate)}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </ContainerMovimentacao>
      </Container>

      <CustomAlert
            visible={alertVisible}
            title={alertTitle}
            message={alertMessage}
            onClose={closeAlert}
      />
    </Container>
  );
};

const filterTransactionsByDate = (transactions, selectedDate) => {
  if (!selectedDate) {
    return transactions;
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.timestamp);
    const selectedDateStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
    const selectedDateEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);

    return transactionDate >= selectedDateStart && transactionDate < selectedDateEnd;
  });
  
  return filteredTransactions;
};