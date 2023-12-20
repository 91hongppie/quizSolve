import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScrollView, Text, View} from 'react-native';
import {RootStackParamList} from '../../App';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useEffect, useState} from 'react';
import LocalStorage from '../utils/LocalStorage';
import NavigationBar from '../Components/NavigationBar';
import {decode} from 'html-entities';
import {Quiz} from './QuizScreen';

type ReviewScreenProps = NativeStackScreenProps<RootStackParamList, 'Review'>;

const ReviewScreen = ({navigation}: ReviewScreenProps) => {
  const [answers, setAnswers] = useState([]);
  const [quizs, setQuizs] = useState<Quiz[]>([]);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const newQuizs = await LocalStorage.getItem('quizs');
    const newAnswers = await LocalStorage.getItem('answers');
    const newNickname = await LocalStorage.getItem('nickname');

    setQuizs(newQuizs);
    setAnswers(newAnswers);
    setNickname(newNickname);
  };

  const goBack = () => {
    navigation.pop();
  };
  return (
    <SafeAreaView>
      <NavigationBar leftFunction={goBack} leftTitle="뒤로" title="오답노트" />
      <View
        style={{
          flexDirection: 'row',
          borderBottomWidth: 1,
          paddingBottom: 10,
        }}>
        <View
          style={{
            width: '50%',
            alignItems: 'center',
          }}>
          <Text>
            <Text style={{color: 'green'}}>{nickname}</Text>님의 답
          </Text>
        </View>
        <View
          style={{
            width: '50%',
            alignItems: 'center',
          }}>
          <Text>정답</Text>
        </View>
      </View>
      <ScrollView style={{paddingHorizontal: 10, height: '100%'}}>
        <View style={{height: 16}} />
        <View style={{gap: 20}}>
          {quizs.map((quiz, index) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 10,
                }}>
                <View
                  style={{
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{textAlign: 'center'}}>
                    {decode(answers[index])}
                  </Text>
                </View>
                <View
                  style={{
                    width: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text style={{textAlign: 'center'}}>
                    {decode(quiz.correct_answer)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewScreen;
