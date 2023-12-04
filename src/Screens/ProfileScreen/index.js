import React, { useState, useEffect } from 'react';
import { Header, Container, Text } from '../../Components';
import { TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../../firebaseConection';
import { ref, get, getDatabase, update } from 'firebase/database';
import { MaterialIcons } from '@expo/vector-icons';
import styled from 'styled-components/native';

const MetaContainer = styled.TouchableOpacity`
  margin-bottom: 10px;
`;

const MetaCard = styled(Container)`
  background-color: #7A0053;
  width: 375px;
  height: 90px;
  justify-content: center;
  align-items: center;
`;

const MetaText = styled(Text)`
  font-size: 20px;
  color: white;
`;

const Input = styled.TextInput`
    background-color: #D9D9D9;
    width: 80%;
    margin-left: 10px;
    padding: 10px;
    font-size: 15px;
`

export const ProfileScreen = () => {
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [metas, setMetas] = useState([]);

  const handleUpdateProfile = async () => {
    try {
      const user = auth.currentUser;
      const db = getDatabase();

      // Atualizar os dados do usuário no Realtime Database
      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, { name: newName });

      alert('Perfil atualizado com sucesso!');
      fetchUserData();
      setIsEditingName(false); // Desativar o modo de edição após a atualização
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error.message);
    }
  };

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

        // Buscar as metas do usuário
        const metasRef = ref(db, `metas/${auth.currentUser.uid}`);
        const metasSnapshot = await get(metasRef);

        if (metasSnapshot.exists()) {
          const metasData = metasSnapshot.val();
          const metasArray = Object.values(metasData);
          setMetas(metasArray);
        } else {
          setMetas([]);
        }
      } else {
        console.error('Usuário não está logado.');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigation]);

  const renderMetaItem = ({ item }) => (
    <MetaContainer onPress={() => handleMetaPress(item)} style={{ marginBottom: 10 }}>
      <MetaCard>
        <MetaText size={20}>{item.nome}</MetaText>
        <MetaText size={20}>Valor: R$ {item.valor}</MetaText>
      </MetaCard>
    </MetaContainer>
  );

  const handleMetaPress = (meta) => {
    // Implemente a lógica desejada ao pressionar uma meta
  };

  return (
    <Container>
      <Header />
      <Container bg="home" h={50} dir="row" align="center" mt={10}>
        <Text mr={10}> </Text>
        <MaterialIcons name="people" size={28} color="black" />
        <Text size={20} ml={10}>
          Tela de Perfil do usuário
        </Text>
      </Container>
      <Container dir="row" align="center" h={60}>
        {isEditingName ? (
          <Input
            placeholder="Novo nome"
            value={newName}
            onChangeText={(text) => setNewName(text)}
          />
        ) : (
          <>
            <Text size={22} mt={10} ml={10}weight="bold" style={{ flex: 1 }}>
              Olá, {displayName}!
            </Text>
            <TouchableOpacity style={{ marginRight: 10}} onPress={() => setIsEditingName(true)}>
              <MaterialIcons name="edit" size={25} color="black" />
            </TouchableOpacity>

          </>
        )}

      </Container>
        <Container h={100} justify="center">
            <Text size={20} mt={10} ml={10}>
                E-mail: {email}
            </Text>
            <Container justify="center" align="center">
                <TouchableOpacity onPress={handleUpdateProfile}>
                <Container
                    bg="roxoClaro"
                    w={200}
                    h={40}
                    justify="center"
                    align="center"
                    style={{ alignSelf: 'center' }}
                >
                    <Text size={18} color="white">
                    Atualizar Perfil
                    </Text>
                </Container>
                </TouchableOpacity>
            </Container>
        </Container>
        <Text size={18} mb={20} weight="bold"> Suas metas: </Text>
        <Container align="center">
            <FlatList
                data={metas}
                renderItem={renderMetaItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </Container>
    </Container>
  );
};