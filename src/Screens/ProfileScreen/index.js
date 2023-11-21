import React from "react";
import { Header, Container, Text } from "../../Components";
import { MaterialIcons } from '@expo/vector-icons';

export const ProfileScreen = () => {
    return(
        <Container>
            <Header />
            <Container bg="home" h={50} dir="row" align="center" mt={10}>
                <Text mr={10}> </Text>
                <MaterialIcons name="people" size={28} color="black" />
                <Text size={20} ml={10} > Tela de Perfil do usuário</Text>
            </Container>
        </Container>
    )
}