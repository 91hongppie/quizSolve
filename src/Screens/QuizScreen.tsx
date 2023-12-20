import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {RootStackParamList} from '../../App';
import LocalStorage from '../utils/LocalStorage';
import {useEffect, useState} from 'react';
import {decode} from 'html-entities';
import NavigationBar from '../Components/NavigationBar';

type QuizScreenProps = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

export interface Quiz {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
}

const QuizScreen = ({navigation, route}: QuizScreenProps) => {
  const [quizCount, setQuizCount] = useState<number>();
  const [quiz, setQuiz] = useState<Quiz>();
  const quizNum = route.params.quizNum;
  const randomNumber = Math.floor(Math.random() * 4);
  const [questions, setQuestions] = useState<[]>();
  const [selectQuestion, setSelectQuestion] = useState<string>();
  const [isSelect, setIsSelect] = useState<boolean>(false);

  useEffect(() => {
    initQuizs();
    startTimer();
  }, []);

  const startTimer = async () => {
    if (quizNum === 0) {
      const startAt = new Date();
      await LocalStorage.setItem('startAt', startAt);
    }
  };
  const initQuizs = async () => {
    const nextQuizs = await LocalStorage.getItem('quizs');
    setQuizCount(nextQuizs.length);
    setQuiz(nextQuizs[quizNum]);
    const nextQuestions = nextQuizs[quizNum].incorrect_answers;
    nextQuestions.splice(randomNumber, 0, nextQuizs[quizNum].correct_answer);
    setQuestions(nextQuestions);
  };

  const goToMain = () => {
    Alert.alert('첫 화면으로 돌아갑니다.', '문제 풀기를 그만하시겠습니까?', [
      {text: '돌아가기', onPress: () => navigation.popToTop()},
      {text: '취소', onPress: () => {}, style: 'destructive'},
    ]);
  };

  const goToNext = async () => {
    if (quizNum === 0) {
      await LocalStorage.setItem('answers', [selectQuestion]);
    } else {
      const answers = await LocalStorage.getItem('answers');
      console.log(answers);
      await LocalStorage.setItem('answers', [...answers, selectQuestion]);
    }
    if (quizCount && quizNum === quizCount - 1) {
      const endAt = new Date();
      await LocalStorage.setItem('endAt', endAt);
      navigation.navigate('Result');
    } else {
      navigation.push('Quiz', {quizNum: quizNum + 1});
    }
  };

  const handleSelectQuestion = (question: string) => {
    if (isSelect) {
      return;
    }
    setSelectQuestion(question);
  };

  const selectAnswer = () => {
    if (!selectQuestion) {
      Alert.alert('정답을 선택해주세요');
      return;
    }
    setIsSelect(true);
  };

  return (
    <SafeAreaView>
      <NavigationBar
        rightFunction={goToNext}
        rightTitle="다음"
        title={`${quizNum + 1} / ${quizNum}`}
        leftFunction={goToMain}
        leftTitle="홈으로"
      />

      <ScrollView style={styles.scrollView}>
        <View style={styles.questionContainer}>
          <Text style={{fontSize: 22}}>{decode(quiz?.category)}</Text>

          <View style={{height: 16}} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={{fontSize: 26, color: 'green'}}>
              Quiz {quizNum + 1}
            </Text>
          </View>
          <View style={{height: 10}} />
          <Text style={{fontSize: 26}}>{decode(quiz?.question)}</Text>
          <View style={{height: 16}} />
          <View style={{justifyContent: 'flex-start', gap: 10}}>
            {questions?.map((question, index) => {
              return (
                <TouchableOpacity
                  disabled={isSelect}
                  key={`question_${index}`}
                  style={
                    selectQuestion === question
                      ? styles.selectQuestion
                      : styles.unselectQuestion
                  }
                  onPress={() => {
                    handleSelectQuestion(question);
                  }}>
                  <Text
                    style={
                      selectQuestion === question
                        ? styles.selectQuestionText
                        : styles.unselectQuestionText
                    }>
                    {index + 1}. {decode(question)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{height: 40}} />
          <View>
            <TouchableOpacity
              style={isSelect ? styles.hide : styles.selectButton}
              onPress={selectAnswer}>
              <Text style={styles.selectButtonText}>선택하기</Text>
            </TouchableOpacity>
            <View style={isSelect ? styles.resultText : styles.hide}>
              <Text
                style={
                  selectQuestion === quiz?.correct_answer
                    ? styles.correctText
                    : styles.failedText
                }>
                {selectQuestion === quiz?.correct_answer
                  ? '정답입니다!'
                  : '틀렸습니다'}
              </Text>
            </View>
          </View>
        </View>
        <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  hide: {
    display: 'none',
  },
  scrollView: {height: '100%'},
  questionContainer: {paddingHorizontal: 10, alignItems: 'center'},
  selectQuestion: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: 'gray',
    backgroundColor: 'green',
  },
  unselectQuestion: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: 'gray',
    backgroundColor: 'transparent',
  },
  selectQuestionText: {
    fontSize: 22,
    color: 'white',
  },
  unselectQuestionText: {
    fontSize: 22,
    color: 'black',
  },
  selectButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'green',
    borderRadius: 10,
  },
  selectButtonText: {fontSize: 22, color: 'white'},
  resultText: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  correctText: {
    fontSize: 22,
    color: 'green',
  },
  failedText: {
    fontSize: 22,
    color: 'red',
  },
});

export default QuizScreen;
