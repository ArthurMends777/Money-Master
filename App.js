import React from 'react';
import { Routes } from './src/Routes';
import { ThemeProvider } from 'styled-components';
import { theme } from './src/Styles/theme';

/* Limpar todos os dados no Async Storage
import AsyncStorage from '@react-native-async-storage/async-storage';
const limparDados = async () => {
  try {
    await AsyncStorage.clear();
    console.log('Dados limpos com sucesso!');
  } catch (error) {
    console.error('Erro ao limpar dados:', error);
  }
};
limparDados();
*/

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes />
    </ThemeProvider>
  );

}