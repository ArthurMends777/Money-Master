import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, FlatList, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ref, onValue, getDatabase, push, set } from 'firebase/database';
import { auth } from '../../../firebaseConection';
import { Container, Header, CustomAlert, Text } from '../../Components';

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

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleMetaPress(item)}>
      <View>
        <Text>{item.nome}</Text>
        <Text>Valor: R$ {item.valor}</Text>
      </View>
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
      <View>
        <Text>Adicionar Nova Meta:</Text>
        <TextInput
          placeholder="Nome"
          value={novaMetaNome}
          onChangeText={(text) => setNovaMetaNome(text)}
        />
        <TextInput
          placeholder="Valor"
          keyboardType="numeric"
          value={novaMetaValor}
          onChangeText={(text) => setNovaMetaValor(text)}
        />
        <Button title="Adicionar Meta" onPress={handleAdicionarMeta} />
      </View>
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
