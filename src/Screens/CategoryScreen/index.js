// CategoriaScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { ref, push, set, getDatabase } from 'firebase/database';
import { CustomAlert } from '../../Components';

export const CategoryScreen = () => {
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
  
    const handleAddCategoria = async () => {
      try {
        if (!nomeCategoria) {
          // Utilize o componente de alerta personalizado
          setAlertTitle('Erro');
          setAlertMessage('Preencha o nome da categoria.');
          setAlertVisible(true);
          return;
        }
  
        // Restante do código...
        const categoriasRef = ref(getDatabase(), `categorias`);
        const novaCategoriaRef = push(categoriasRef);
        await set(novaCategoriaRef, categoriaData);
  
        // Utilize o componente de alerta personalizado
        setAlertTitle('Sucesso');
        setAlertMessage('Categoria adicionada com sucesso!');
        setAlertVisible(true);
        setNomeCategoria('');
      } catch (error) {
        console.error('Erro ao adicionar categoria:', error.message);
        // Utilize o componente de alerta personalizado
        setAlertTitle('Erro');
        setAlertMessage('Erro ao adicionar categoria. Tente novamente.');
        setAlertVisible(true);
      }
    };
  
    const closeAlert = () => {
      setAlertVisible(false);
    };
  
    return (
      <View>
        <TextInput
          placeholder="Nome da Categoria"
          value={nomeCategoria}
          onChangeText={(text) => setNomeCategoria(text)}
        />
        <Button title="Adicionar Categoria" onPress={handleAddCategoria} />
  
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={closeAlert}
        />
      </View>
    );
  };