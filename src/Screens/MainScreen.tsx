import {Ref, useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
} from 'react-native';
import api from '../apis/baseClient';
import LocalStorage from '../utils/LocalStorage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

type MainScreenProps = NativeStackScreenProps<RootStackParamList, 'Main'>;

const MainScreen = ({navigation}: MainScreenProps) => {
  const [nickname, setNickname] = useState('홍길동');
  const [amount, setAmount] = useState<number>();
  const amountInput = useRef<TextInput>(null);

  const handleAmount = (next: string) => {
    const parsedAmount = parseInt(next);
    if (isNaN(parsedAmount)) {
      setAmount(undefined);
    } else if (parsedAmount > 50) {
      setAmount(50);
    } else {
      setAmount(parsedAmount);
    }
  };

  const moveCursor = () => {
    if (!amountInput.current) {
      return;
    }
    amountInput.current.focus();
  };

  const handleNickname = (e: string) => {
    setNickname(e);
  };

  const handleQuiz = async () => {
    try {
      const questionAmount = amount || 10;
      const prevQuizs = await LocalStorage.getItem('quizs');

      let quizs;
      if (prevQuizs) {
        quizs = prevQuizs;
      } else {
        const res = await api.Quiz.getQuiz({amount: questionAmount});
        quizs = res['results'];
      }
      await LocalStorage.setItem('quizs', quizs);
      await LocalStorage.setItem('nickname', nickname);
      navigation.navigate('Quiz', {quizNum: 0});
    } catch (e) {
      console.log(e);
      Alert.alert('잠시 후 다시 시도해주세요.');
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={{flex: 1}}></View>
      <View style={styles.descContainer}>
        <Text style={{fontSize: 23}}>안녕하세요 </Text>
        <TextInput
          style={styles.textInput}
          testID={'nicknameInput'}
          placeholder="홍길동"
          maxLength={5}
          multiline={false}
          textAlign="center"
          onChangeText={handleNickname}
          onSubmitEditing={moveCursor}
        />
        <Text style={{fontSize: 23}}>님</Text>
      </View>
      <View style={{flex: 0.1}}></View>
      <View style={styles.descContainer}>
        <Text style={{fontSize: 23}}>문제</Text>
        <TextInput
          testID={'quizNumInput'}
          style={styles.textInput}
          ref={amountInput}
          placeholder="10"
          value={amount !== undefined ? `${amount}` : ''}
          multiline={false}
          keyboardType="numeric"
          textAlign="center"
          onChangeText={handleAmount}
        />
        <Text style={{fontSize: 23}}>개 풀어보실래요?</Text>
      </View>
      <View style={{flex: 1}}></View>
      <TouchableOpacity
        style={styles.button}
        onPress={handleQuiz}
        testID="quizSolveButton">
        <Text style={{fontSize: 25, color: 'white'}}>문제 풀기</Text>
      </TouchableOpacity>
      <View style={{flex: 0.5}}></View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {height: '100%'},
  descContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textInput: {
    width: 100,
    fontSize: 23,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  button: {
    alignItems: 'center',
    backgroundColor: 'green',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    height: 60,
    justifyContent: 'center',
    borderRadius: 10,
  },
});

export default MainScreen;
