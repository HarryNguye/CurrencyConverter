import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CurrencyConverter from './components/CurrencyConverter';
import PreviousConversions from './components/PreviousConversions';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Converter" component={CurrencyConverter} />
        <Tab.Screen name="History" component={PreviousConversions} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
