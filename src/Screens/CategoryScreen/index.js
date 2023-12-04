import React, { useState, useEffect } from 'react';
import { View, Button, TouchableOpacity, FlatList, Modal } from 'react-native';
import { ref, push, set, get, getDatabase, remove, update } from 'firebase/database';
import { Container, CustomAlert, Header, Text } from '../../Components';
import { Input,CategoryItemContainer, DeleteButton, DeleteButtonText, EditButton, EditButtonText, ModalButtonsContainer, ModalContainer, ModalContent, ModalInput } from './style'

export const CategoryScreen = () => {
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [tipoCategoria, setTipoCategoria] = useState('receita');
  const [categorias, setCategorias] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editCategoriaName, setEditCategoriaName] = useState('');
  const [editCategoriaTipo, setEditCategoriaTipo] = useState('');

  const fetchCategorias = async () => {
    try {
      const categoriasRef = ref(getDatabase(), `categorias`);
      const snapshot = await get(categoriasRef);

      if (snapshot.exists()) {
        const categoriasArray = Object.entries(snapshot.val()).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setCategorias(categoriasArray);
      }
    } catch (error) {
      console.error('Erro ao buscar categorias:', error.message);
    }
  };
  useEffect(() => {

    fetchCategorias();
  }, []);

  const handleAddCategoria = async (tipo) => {
    try {
      if (!nomeCategoria) {
        setAlertTitle('Erro');
        setAlertMessage('Preencha o nome da categoria.');
        setAlertVisible(true);
        return;
      }

      const categoriasRef = ref(getDatabase(), `categorias`);
      const novaCategoriaRef = push(categoriasRef);
      
      // Adicionado o tipo de categoria aos dados
      const categoriaData = {
        nome: nomeCategoria,
        tipo: tipo,
      };

      await set(novaCategoriaRef, categoriaData);

      setAlertTitle('Sucesso');
      setAlertMessage('Categoria adicionada com sucesso!');
      setAlertVisible(true);
      setNomeCategoria('');
      setTipoCategoria('receita'); // Resetar o tipo de categoria para o padrão
    } catch (error) {
      console.error('Erro ao adicionar categoria:', error.message);
      setAlertTitle('Erro');
      setAlertMessage('Erro ao adicionar categoria. Tente novamente.');
      setAlertVisible(true);
    }
  };

  const handleDeleteCategoria = async (id) => {
    try {
      const categoriaRef = ref(getDatabase(), `categorias/${id}`);
      await remove(categoriaRef);

      setCategorias((prevCategorias) => prevCategorias.filter((categoria) => categoria.id !== id));

      setAlertTitle('Sucesso');
      setAlertMessage('Categoria removida com sucesso!');
      setAlertVisible(true);
    } catch (error) {
      console.error('Erro ao remover categoria:', error.message);
      setAlertTitle('Erro');
      setAlertMessage('Erro ao remover categoria. Tente novamente.');
      setAlertVisible(true);
    }
  };

  const handleEditCategoria = async () => {
    try {
      const categoriaRef = ref(getDatabase(), `categorias/${editCategoryId}`);
      await update(categoriaRef, { nome: editCategoriaName, tipo: editCategoriaTipo });

      setCategorias((prevCategorias) =>
        prevCategorias.map((categoria) =>
          categoria.id === editCategoryId ? { ...categoria, nome: editCategoriaName, tipo: editCategoriaTipo } : categoria
        )
      );

      setAlertTitle('Sucesso');
      setAlertMessage('Categoria editada com sucesso!');
      setAlertVisible(true);
      setEditModalVisible(false);
    } catch (error) {
      console.error('Erro ao editar categoria:', error.message);
      setAlertTitle('Erro');
      setAlertMessage('Erro ao editar categoria. Tente novamente.');
      setAlertVisible(true);
    }
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  const openEditModal = (id, nome) => {
    setEditCategoryId(id);
    setEditCategoriaName(nome);
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
  };


  return (
    <Container>
      <Header />
      <Text size={20} weight="bold" mt={5} ml={10}> Categorização</Text>
      <Container h={120} justify="center" align="center">
        <Input
          placeholder="Nome da Categoria"
          value={nomeCategoria}
          onChangeText={(text) => setNomeCategoria(text)}
        />

        <Container h={70} dir="row" justify="center" align="center">
          <TouchableOpacity style={{ margin: 10, backgroundColor: '#D9D9D9', padding: 10}} onPress={() => setTipoCategoria('receita')}>
            <Text size={20} style={{ color: tipoCategoria === 'receita' ? 'blue' : 'black' }}>Receita</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ margin: 10, backgroundColor: '#D9D9D9', padding: 10}} onPress={() => setTipoCategoria('gasto')}>
            <Text size={20} style={{ color: tipoCategoria === 'gasto' ? 'red' : 'black' }}>Gasto</Text>
          </TouchableOpacity>
        </Container>

      </Container>

      <Container h={60} justify="center" align="center">
        <TouchableOpacity style={{ flex:1 , backgroundColor: '#502779', padding: 8, width: '80%', alignItems: 'center', justifyContent: 'center'}} onPress={() => handleAddCategoria(tipoCategoria)}>
            <Text size={20} color="white">Adiconar categoria</Text>
          </TouchableOpacity>
      </Container>

      <Container justify="center" align="center">
        <FlatList
          data={categorias}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryItemContainer>
              <Text color="white" size={20} mb={10}>{item.nome}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <EditButton onPress={() => openEditModal(item.id, item.nome)}>
                  <EditButtonText>Editar</EditButtonText>
                </EditButton>
                <DeleteButton onPress={() => handleDeleteCategoria(item.id)}>
                  <DeleteButtonText>Excluir</DeleteButtonText>
                </DeleteButton>
              </View>
            </CategoryItemContainer>
          )}
        />
      </Container>

      
      <ModalContainer
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={closeEditModal}
      >
        <ModalContent>
          <Text size={18}>Editar Categoria</Text>
          <ModalInput
            placeholder="Novo Nome"
            value={editCategoriaName}
            onChangeText={(text) => setEditCategoriaName(text)}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <TouchableOpacity onPress={() => setEditCategoriaTipo('Receita')}>
              <Text size={18} ml={10} style={{ color: editCategoriaTipo === 'receita' ? 'green' : 'black' }}>Receita</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditCategoriaTipo('Gasto')}>
              <Text size={18} ml={10} style={{ color: editCategoriaTipo === 'Gasto' ? 'red' : 'black' }}>Gasto</Text>
            </TouchableOpacity>
          </View>

          <ModalButtonsContainer>
            <TouchableOpacity onPress={closeEditModal}>
              <Text size={18}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEditCategoria}>
              <Text size={18}>Salvar</Text>
            </TouchableOpacity>
          </ModalButtonsContainer>
        </ModalContent>
      </ModalContainer>


      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={closeAlert}
      />
    </Container>
  );
};
