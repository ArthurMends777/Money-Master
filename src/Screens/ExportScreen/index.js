import React from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Container, Text, Header } from '../../Components';
import * as FileSystem from 'expo-file-system';
import { getDatabase, ref, get } from 'firebase/database';
import { auth } from '../../../firebaseConection';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

const ExportTitle = styled(Text)`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 10px;
  margin-left: 10px;
`;

const ExportButton = styled(TouchableOpacity)`
  background-color: #4CAF50;
  padding: 15px;
  border-radius: 8px;
  align-items: center;
`;

const ExportButtonText = styled(Text)`
  color: white;
  font-size: 18px;
  font-weight: bold;
`;

export const ExportScreen = () => {
    const exportData = async () => {
        try {
            // Caminho para as transações do usuário
            const transactionsPath = `transactions/${auth.currentUser.uid}`;

            // Busque os dados da Firebase Realtime Database
            const snapshot = await get(ref(getDatabase(), transactionsPath));
            const data = snapshot.val();

            // Formate os dados conforme necessário
            const formattedData = formatData(data);

            // Crie um arquivo temporário para armazenar os dados
            const fileUri = FileSystem.cacheDirectory + 'dados_exportados.pdf';

            console.log(formattedData)

            // Crie um HTML simples para o conteúdo do PDF
            const htmlContent = `
                <html>
                <head></head>
                <body>
                    <pre>${formattedData}</pre>
                </body>
                </html>
            `;

            // Gere o PDF usando o expo-print
            const pdfOptions = { html: htmlContent };
            const { uri } = await Print.printToFileAsync(pdfOptions);

            // Mova o arquivo para o diretório desejado
            await FileSystem.moveAsync({ from: uri, to: fileUri });

            // Compartilhe o arquivo usando o Expo Sharing
            await Sharing.shareAsync(fileUri, { mimeType: 'application/pdf', dialogTitle: 'Exportar Dados' });
        

        } catch (error) {
        console.error('Erro ao exportar dados:', error);
        }
    };
    

    const formatData = (data) => {
        if (!data) {
        return '';
        }
    
    // Obtém as chaves das transações (cada chave é uma UID única)
    const transactionKeys = Object.keys(data);

    // Inicializa o saldo total
    let totalBalance = 0;

    // Cria o conteúdo HTML com um título, o saldo atual e uma tabela para os dados
    const tableRows = transactionKeys.map((key) => {
        const transaction = data[key];

        // Formata a data usando toLocaleDateString
        const formattedDate = new Date(transaction.timestamp).toLocaleDateString('pt-BR');

        // Verifica o tipo da transação
        if (transaction.type === 'Receita') {
        totalBalance += transaction.amount; // Receita: soma ao saldo
        } else if (transaction.type === 'Despesa') {
        totalBalance -= transaction.amount; // Despesa: subtrai do saldo
        }

        return `<tr><td>${transaction.type}</td>
        <td>${transaction.category}</td>
        <td>${transaction.amount}</td>
        <td>${formattedDate}</td></tr>`;
        }).join('');
    
        const table = `<table>
                        <thead>
                            <tr>
                            <th>Tipo</th>
                            <th>Categoria</th>
                            <th>Valor</th>
                            <th>Data</th>
                            </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                    </table>`;
    
        return `
        <html>
            <head>
            <style>
                table {
                width: 100%;
                border-collapse: collapse;
                }
                th, td {
                border: 1px solid black;
                padding: 8px;
                text-align: left;
                }
                thead {
                background-color: #f2f2f2;
                }
                .title {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 10px;
                }
            </style>
            </head>
            <body>
            <div class="title">Tabela de Transações - Saldo Atual: R$ ${totalBalance.toFixed(2)}</div>
            ${table}
            </body>
        </html>
        `;
    };
  

  return (
    <Container>
        <Header />
        <ExportTitle>Exportar PDF</ExportTitle>
        <Container align="center">
            <ExportButton onPress={exportData}>
                <ExportButtonText>Exportar e Compartilhar PDF</ExportButtonText>
            </ExportButton>

        </Container>
    </Container>
  );
};