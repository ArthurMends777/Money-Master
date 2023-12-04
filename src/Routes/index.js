import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { LoginScreen, SignupScreen, HomeScreen, TransectionScreen, CategoryScreen, ProfileScreen, BudgetScreem, ExportScreen, FeedbackScreen } from '../Screens';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConection';
import CustomDrawerContent from './style';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const Routes = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  const onAuthStateChange = (user) => {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, onAuthStateChange);

    return () => unsubscribe();
  }, []);

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? (
        <Drawer.Navigator
          initialRouteName="Início"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen name="Início" component={HomeScreen} options={{ headerShown: false}}/>
          <Drawer.Screen name='Perfil' component={ProfileScreen} options={{ headerShown: false}} />
          <Drawer.Screen name='Transações' component={TransectionScreen} options={{ headerShown: false}}/>
          <Drawer.Screen name='Orçamento' component={BudgetScreem} options={{ headerShown: false}}/>
          <Drawer.Screen name='Categoria' component={CategoryScreen} options={{ headerShown: false}}/>
          <Drawer.Screen name='Exportar' component={ExportScreen} options={{ headerShown: false}} />
          <Drawer.Screen name='Feedback' component={FeedbackScreen} options={{ headerShown: false}}/>
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false}} />
          <Stack.Screen name='Signup' component={SignupScreen} options={{ headerShown: false}} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};