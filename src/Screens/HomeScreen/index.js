import React, { useState, useEffect } from 'react';
import { TouchableOpacity, FlatList, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Container, Header, Text } from '../../Components';
import { useNavigation } from '@react-navigation/native';
import { SaldoContainer, ContainerMovimentacao, UltimasMovis, CustomText, Filter, Totais } from './style';
import { ref, onValue, getDatabase } from 'firebase/database';
import { auth } from '../../../firebaseConection';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const [saldoVisivel, setSaldoVisivel] = useState(true);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [saldoAtual, setSaldoAtual] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const renderItem = ({ item }) => {
    // Converte a string de data para um objeto Date
    const data = new Date(item.timestamp);

    // Formata a data para "dia/mês/ano"
    const formattedDate = new Intl.DateTimeFormat('pt-BR').format(data);

    return (
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

  return (
    <Container>
      <Header> Minhas movimentações </Header>
      <Container h={150} justify="center" align="center" mt={20}>
        <SaldoContainer>
          <Text> Saldo da conta </Text>
          {saldoVisivel ? <Text> R$ {saldoAtual.toFixed(2)} </Text> : null}
          <TouchableOpacity onPress={() => setSaldoVisivel(!saldoVisivel)}>
            <Text size={18}>{saldoVisivel ? 'Esconder' : 'Mostrar'} saldo</Text>
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

      <Container h={320} justify="center" align="center" mt={20}>
        <ContainerMovimentacao>
          <Container mt={10} h={30} dir="row" justify="space-between">
            <Text size={20}> Minhas movimentações</Text>
            <Filter onPress={openDatePicker}>
              <Text size={20}> Filtrar </Text>
            </Filter>
            {selectedDate && (
              <TouchableOpacity onPress={clearDateFilter}>
                <Text size={20}> Limpar Filtro </Text>
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