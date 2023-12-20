import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import {RootStackParamList} from '../../App';
import {useEffect, useState} from 'react';
import LocalStorage from '../utils/LocalStorage';
import {PieChart} from 'react-native-chart-kit';
import NavigationBar from '../Components/NavigationBar';

type ResultScreenProps = NativeStackScreenProps<RootStackParamList, 'Result'>;

const ResultScreen = ({navigation}: ResultScreenProps) => {
  const [durationOfTime, setDurationOfTime] = useState<string>('');
  const [answers, setAnswers] = useState();
  const [quizs, setQuizs] = useState([]);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [nickname, setNickname] = useState<string>('');
  const data = [
    {
      name: '정답',
      population: correctCount,
      color: 'green',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: '오답',
      population: quizs.length - correctCount,
      color: '#F00',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const startAt = new Date(await LocalStorage.getItem('startAt')).getTime();
    const endAt = new Date(await LocalStorage.getItem('endAt')).getTime();
    const newAnswers = await LocalStorage.getItem('answers');
    const newQuizs = await LocalStorage.getItem('quizs');
    const newNickname = await LocalStorage.getItem('nickname');

    setDurationOfTime(((endAt - startAt) / 1000).toFixed(2));
    let correctNum = 0;
    for (let quizNum in newQuizs) {
      console.log(quizNum, newQuizs[quizNum]);
      let quiz = newQuizs[quizNum];
      if (quiz.correct_answer === newAnswers[quizNum]) {
        correctNum += 1;
      }
    }
    setNickname(newNickname);
    setQuizs(newQuizs);
    setAnswers(newAnswers);
    setCorrectCount(correctNum);
  };

  const goToMain = () => {
    Alert.alert('첫 화면으로 돌아갑니다.', '', [
      {text: '돌아가기', onPress: () => navigation.popToTop()},
      {text: '취소', onPress: () => {}, style: 'destructive'},
    ]);
  };

  const goToAgain = () => {
    Alert.alert('다시 도전합니다.', '', [
      {
        text: '확인',
        onPress: () => {
          navigation.popToTop();
          navigation.navigate('Quiz', {quizNum: 0});
        },
      },
      {text: '취소', onPress: () => {}, style: 'destructive'},
    ]);
  };

  const goToReview = () => {
    navigation.navigate('Review');
  };

  return (
    <SafeAreaView>
      <NavigationBar
        leftFunction={goToMain}
        leftTitle="홈으로"
        title="결과"
        rightFunction={goToReview}
        rightTitle="오답노트"
      />
      <ScrollView style={{height: '100%'}}>
        <View style={{height: 22}} />
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 22}}>
            <Text style={{color: 'green', fontWeight: '700'}}>{nickname}</Text>
            님의 결과
          </Text>
        </View>
        <View style={{height: 16}} />
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 18}}>소요 시간 : {durationOfTime}s</Text>
        </View>
        <View style={{height: 16}} />
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 18}}>
            정답수 : <Text style={{color: 'green'}}>{correctCount}</Text> /{' '}
            {quizs.length}
          </Text>
        </View>
        <View>
          <PieChart
            data={data}
            width={400}
            height={220}
            chartConfig={{
              color: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor={'population'}
            backgroundColor={'transparent'}
            paddingLeft={'15'}
            center={[0, 0]}
            absolute
          />
        </View>
        <View style={{height: 26}} />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 10,
              padding: 8,
              backgroundColor: 'green',
              borderColor: 'transparent',
            }}
            onPress={goToAgain}>
            <Text style={{color: 'white', fontWeight: '700', fontSize: 22}}>
              다시 풀기
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResultScreen;
