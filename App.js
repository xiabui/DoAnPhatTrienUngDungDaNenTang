import React, {useState, useEffect} from 'react';
import {createStackNavigator} from "@react-navigation/stack"
import {NavigationContainer, DefaultTheme} from "@react-navigation/native"
import {SignUp, Login, TopUp, Transfer, Internet, Wallet, Game, GameResult} from "./screens";
import Tabs from "./navigation/tabs";

const theme = {
  ...DefaultTheme,
  colors:{
    ...DefaultTheme.colors,
    border: "transparent"
  }
}

const Stack = createStackNavigator();

export default function App() {

  return(
    <NavigationContainer theme={theme}>
      <Stack.Navigator
        initiaRouteName = {"Login"}
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name="Login" component = {Login}/>
        <Stack.Screen name="SignUp" component={SignUp}/>
        <Stack.Screen name="Home" component={Tabs}/>
        <Stack.Screen name="TopUp" component={TopUp}/>
        <Stack.Screen name="Transfer" component={Transfer}/>
        <Stack.Screen name="Internet" component={Internet}/>
        <Stack.Screen name="Wallet" component={Wallet}/>
        <Stack.Screen name="Game" component={Game}/>
        <Stack.Screen name="GameResult" component={GameResult}/>

      </Stack.Navigator>
    </NavigationContainer>
  )
};
