import React from "react";
import { HeaderContainer } from './style';
import { Text } from '../../atoms';
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

export const Header = ({children, ...props}) => {
    const navigation = useNavigation();
    return (
        <HeaderContainer {...props}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Ionicons name="menu-outline" size={40} color="white" />
            </TouchableOpacity>
            <Text color="white" weight="bold" size={24}> 
                {children} 
            </Text>
        </HeaderContainer>
    )
}