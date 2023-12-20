import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MainScreen from './src/Screens/MainScreen';
import QuizScreen from './src/Screens/QuizScreen';
import ResultScreen from './src/Screens/ResultScreen';
import ReviewScreen from './src/Screens/ReviewScreen';

export type RootStackParamList = {
  Main: undefined;
  Quiz: {quizNum: number};
  Result: undefined;
  Review: undefined;
};

function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Main'}>
          <Stack.Screen
            options={{headerShown: false}}
            name="Main"
            component={MainScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="Quiz"
            component={QuizScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="Result"
            component={ResultScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="Review"
            component={ReviewScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default App;
