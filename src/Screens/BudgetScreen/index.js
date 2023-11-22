import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, FlatList, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue, getDatabase, push, set } from 'firebase/database';
import { auth } from '../../../firebaseConection';
import { Container, Header, CustomAlert, Text } from '../../Components';
import { Input, Btn } from './style'

export const BudgetScreem = () => {
  const navigation = useNavigation();
  const [metas, setMetas] = useState([]);
  const [novaMetaNome, setNovaMetaNome] = useState('');
  const [novaMetaValor, setNovaMetaValor] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchMetas = async () => {
      try {
        const database = getDatabase();
        const metasRef = ref(database, `metas/${auth.currentUser.uid}`);
        onValue(metasRef, (snapshot) => {
          const metasData = snapshot.val();

          if (metasData) {
            const metasArray = Object.values(metasData);
            setMetas(metasArray);
          } else {
            // Caso não haja metas, limpe o estado
            setMetas([]);
          }
        });
      } catch (error) {
        console.error('Erro ao obter metas:', error.message);
      }
    };

    fetchMetas();
  }, []);

  const handleApagarMeta = async (meta) => {
    try {
      const metasRef = ref(getDatabase(), `metas/${auth.currentUser.uid}`);
      const metaRef = ref(metasRef, meta.id); // Adicionei um campo "id" para identificar cada meta
      await set(metaRef, null); // Remove a meta do banco de dados

      setAlertTitle('Sucesso');
      setAlertMessage('Meta apagada com sucesso!');
      setAlertVisible(true);

      // Atualizar a lista de metas
      fetchMetas();
    } catch (error) {
      console.error('Erro ao apagar meta:', error.message);
      setAlertTitle('Erro');
      setAlertMessage('Erro ao apagar meta. Tente novamente.');
      setAlertVisible(true);
    }
  };



  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMetaPress(item)} style={{ marginBottom: 10}}>
      <Container bg="home" w={375} h={90} justify="center" align="center">
        <Text size={20}>{item.nome}</Text>
        <Text size={20}>Valor: R$ {item.valor}</Text>
        <TouchableOpacity title="Apagar" onPress={() => handleApagarMeta(item)}>
          <Text size={18} color="red"> Apagar </Text>
        </TouchableOpacity>
      </Container>
    </TouchableOpacity>
  );

  const handleMetaPress = (meta) => {
    setAlertTitle('Detalhes da Meta');
    setAlertMessage(`Nome: ${meta.nome}\nValor: R$ ${meta.valor}`);
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const handleAdicionarMeta = async () => {
    try {
      if (!novaMetaNome || !novaMetaValor) {
        setAlertTitle('Erro');
        setAlertMessage('Preencha o nome e o valor da meta.');
        setAlertVisible(true);
        return;
      }

      const novaMetaData = {
        nome: novaMetaNome,
        valor: parseFloat(novaMetaValor),
      };

      const metasRef = ref(getDatabase(), `metas/${auth.currentUser.uid}`);
      const novaMetaRef = push(metasRef);
      await set(novaMetaRef, novaMetaData);

      setNovaMetaNome('');
      setNovaMetaValor('');

      setAlertTitle('Sucesso');
      setAlertMessage('Meta adicionada com sucesso!');
      setAlertVisible(true);

      // Atualizar a lista de metas
      fetchMetas();
    } catch (error) {
      console.error('Erro ao adicionar meta:', error.message);
      setAlertTitle('Erro');
      setAlertMessage('Erro ao adicionar meta. Tente novamente.');
      setAlertVisible(true);
    }
  };

  return (
    <Container>
      <Header>Metas de Orçamento</Header>
      <Container h={200} justify="center" align="center">
        <Text size={20}>Adicionar Nova Meta</Text>
        <Input
          placeholder="Nome"
          value={novaMetaNome}
          onChangeText={(text) => setNovaMetaNome(text)}
        />
        <Input
          placeholder="Valor"
          keyboardType="numeric"
          value={novaMetaValor}
          onChangeText={(text) => setNovaMetaValor(text)}
        />
        <Btn title="Adicionar Meta" onPress={handleAdicionarMeta}>
          <Text size={18} color="white"> Adicionar </Text>
        </Btn>
      </Container>
      <FlatList
        data={metas}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={closeAlert}
      />
    </Container>
  );
};
