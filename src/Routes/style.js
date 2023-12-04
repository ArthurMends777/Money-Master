import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { FontAwesome, MaterialIcons, Fontisto  } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../firebaseConection';

const CustomDrawerContent = (props) => {
    const navigation = useNavigation();
    const MoneyMasterLogo = require('../../assets/logo.png');


    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigation.navigate('Login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    const drawerItems = [
        { name: 'Início', icon: 'home', iconType: 'FontAwesome' },
        { name: 'Perfil', icon: 'person', iconType: 'Fontisto' },
        { name: 'Categoria', icon: 'category', iconType: 'MaterialIcons' },
        { name: 'Orçamento', icon: 'money', iconType: 'MaterialIcons' },
        { name: 'Transações', icon: 'list', iconType: 'FontAwesome' },
        { name: 'Exportar', icon: 'cloud-download', iconType: 'MaterialIcons' },
        { name: 'Feedback', icon: 'feedback',  iconType: 'MaterialIcons' },
    ];

    const DrawerItemWithIcon = ({ label, iconName, iconType, onPress }) => {
        const IconComponent = iconType === 'FontAwesome' ? FontAwesome : MaterialIcons;

        return (
            <TouchableOpacity onPress={onPress} style={styles.drawerItem}>
                <IconComponent name={iconName} size={20} color="black" style={styles.icon} />
                <Text style={styles.drawerItemText}>{label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <DrawerContentScrollView {...props} style={{ backgroundColor: '#7A0053' }}>
            <View style={styles.drawerHeader}>
                <Text style={styles.logo}>MoneyMaster</Text>
            </View>
            {drawerItems.map((item) => (
                <DrawerItemWithIcon
                    key={item.name}
                    label={item.name}
                    iconName={item.icon}
                    iconType={item.iconType}
                    onPress={() => props.navigation.navigate(item.name)}
                />
            ))}
            <View style={styles.logoContainer}>
            </View>
            <DrawerItemWithIcon label="Sair da conta" iconName="exit-to-app" iconType="MaterialIcons" onPress={handleLogout}/>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    drawerHeader: {
        backgroundColor: '#D9D9D9',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: '60%',
    },
    logo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#D9D9D9',
        marginTop: 10,
    },
    icon: {
        marginRight: 10,
        width: 30,
        height: 20,
    },
    drawerItemText: {
        fontSize: 16,
    },
    logoContainer: {
        flex: 1,
        
        marginTop: '98%',
        width: "100%",
    },
    logoImage: {
        width: 160,
        height: 160,
        resizeMode: 'contain',
    },
});

export default CustomDrawerContent;
