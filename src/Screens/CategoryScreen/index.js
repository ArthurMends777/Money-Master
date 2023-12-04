import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import { ref, push, set, get, getDatabase, remove, update } from 'firebase/database';
import { CustomAlert, Header } from '../../Components';
import styled from 'styled-components/native';

const CategoryItemContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const EditButton = styled(TouchableOpacity)`
  background-color: #3498db;
  padding: 5px 10px;
  border-radius: 5px;
  margin-right: 10px;
`;

const EditButtonText = styled(Text)`
  color: white;
`;

const DeleteButton = styled(TouchableOpacity)`
  background-color: #e74c3c;
  padding: 5px 10px;
  border-radius: 5px;
`;

const DeleteButtonText = styled(Text)`
  color: white;
`;


const ModalContainer = styled(Modal)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled(View)`
  padding: 20px;
  background-color: white;
  width: 80%;
  border-radius: 10px;
`;

const ModalInput = styled(TextInput)`
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ModalButtonsContainer = styled(View)`
  flex-direction: row;
  justify-content: space-around;
  margin-top: 10px;
`;

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
    <View>
      <Header />
      <TextInput
        placeholder="Nome da Categoria"
        value={nomeCategoria}
        onChangeText={(text) => setNomeCategoria(text)}
      />

      {/* Botões para escolher o tipo de categoria */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
        <TouchableOpacity onPress={() => setTipoCategoria('receita')}>
          <Text style={{ color: tipoCategoria === 'receita' ? 'blue' : 'black' }}>Receita</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTipoCategoria('gasto')}>
          <Text style={{ color: tipoCategoria === 'gasto' ? 'red' : 'black' }}>Gasto</Text>
        </TouchableOpacity>
      </View>

      <Button title="Adicionar Categoria" onPress={() => handleAddCategoria(tipoCategoria)} />

      <FlatList
        data={categorias}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CategoryItemContainer>
            <Text>{item.nome}</Text>
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

<ModalContainer
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={closeEditModal}
      >
        <ModalContent>
          <Text>Editar Categoria</Text>
          <ModalInput
            placeholder="Novo Nome"
            value={editCategoriaName}
            onChangeText={(text) => setEditCategoriaName(text)}
          />

          {/* Adicione a seleção de tipo na modal */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <TouchableOpacity onPress={() => setEditCategoriaTipo('receita')}>
              <Text style={{ color: editCategoriaTipo === 'Receita' ? 'blue' : 'black' }}>Receita</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditCategoriaTipo('Gasto')}>
              <Text style={{ color: editCategoriaTipo === 'Gasto' ? 'red' : 'black' }}>Gasto</Text>
            </TouchableOpacity>
          </View>

          <ModalButtonsContainer>
            <TouchableOpacity onPress={closeEditModal}>
              <Text>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEditCategoria}>
              <Text>Salvar</Text>
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
    </View>
  );
};
