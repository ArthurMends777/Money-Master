import React, { useState } from 'react';
import { ref, push, set, getDatabase } from 'firebase/database';
import { Container, Text, CustomAlert, Header } from '../../Components';
import { Input, Botao } from './style'
import { MaterialIcons } from '@expo/vector-icons';
import { auth } from '../../../firebaseConection';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const FeedbackScreen = () => {
  const [feedback, setFeedback] = useState('');

  const handleSendFeedback = async () => {
    try {
      if (!feedback) {
        CustomAlert.showAlert({
          title: 'Erro',
          message: 'Por favor, insira seu feedback antes de enviar.',
        });
        return;
      }

      const feedbackData = {
        message: feedback,
        userId: auth.currentUser.uid,
        timestamp: new Date().toISOString(),
      };

      const feedbacksRef = ref(getDatabase(), 'feedbacks');
      const newFeedbackRef = push(feedbacksRef);
      await set(newFeedbackRef, feedbackData);

      CustomAlert.showAlert({
        title: 'Sucesso',
        message: 'Feedback enviado com sucesso! Obrigado por sua contribuição.',
      });
      setFeedback('');
    } catch (error) {
      console.error('Erro ao enviar feedback:', error.message);
      CustomAlert.showAlert({
        title: 'Erro',
        message: 'Erro ao enviar feedback. Tente novamente mais tarde.',
      });
    }
  };

  return (
    <Container align="center">
        <Header>
            Feedback
        </Header>
        <Container bg="home" h={50} dir="row" align="center" mt={10}>
                <Text mr={10}> </Text>
                <MaterialIcons name="feedback" size={26} color="black" />
                <Text size={20} ml={10}>  Enviar Feedback </Text>
        </Container>
        <Container h={30} dir="row" justify="center" align="center" mt={10}>
            <MaterialIcons name="star" size={35} color="yellow" />
            <MaterialIcons name="star" size={35} color="yellow" />
            <MaterialIcons name="star" size={35} color="yellow" />
            <MaterialIcons name="star" size={35} color="yellow" />
            <MaterialIcons name="star" size={35} color="yellow" />

        </Container>
        
        <Input
            placeholder="Digite seu feedback aqui"
            multiline
            numberOfLines={4}
            value={feedback}
            onChangeText={(text) => setFeedback(text)}
        />
        <Botao title="Enviar Feedback" onPress={handleSendFeedback}>
            <MaterialCommunityIcons name="send-circle" size={24} color="pink" />
            <Text size={20} color="white" ml={5}> Enviar </Text>
        </Botao>
    </Container>
  );
};