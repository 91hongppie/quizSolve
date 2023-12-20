import 'react-native';
import React, {ReactElement} from 'react';

// Note: import explicitly to use the types shipped with jest.

// Note: test renderer must be required after react-native.
import QuizScreen from '../src/Screens/QuizScreen';
import {render, waitFor} from '@testing-library/react-native';
import LocalStorage from '../src/utils/LocalStorage';
import '@testing-library/jest-dom';

let props;
let component: ReactElement;

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

function getTempComponent(props: any) {
  return <QuizScreen {...props} />;
}
describe('Quiz', () => {
  props = {route: {params: {quizNum: 0}}};
  component = getTempComponent(props);

  it('renders without crashing', () => {
    const renderResult = render(component);
    const renderedJson = renderResult.toJSON();
    expect(renderedJson).toMatchSnapshot();
    expect(renderedJson).toBeTruthy();
  });

  it('네비게이션 바 왼쪽 버튼 확인', () => {
    const renderResult = render(component);
    expect(renderResult.getByTestId('navibationLeftButton')).toBeDefined();
  });

  it('네비게이션 바 오른쪽 버튼 확인', () => {
    const renderResult = render(component);
    expect(renderResult.getByTestId('navigationRightButton')).toBeDefined();
  });

  it('선택하기 버튼 확인', () => {
    const renderResult = render(component);
    expect(renderResult.getByTestId('answerSelectButton')).toBeDefined();
  });

  it('보기 확인', async () => {
    await LocalStorage.setItem('quizs', [
      {
        category: 'Entertainment: Video Games',
        correct_answer: 'Golden ',
        difficulty: 'medium',
        incorrect_answers: ['Diamond', 'Iron', 'Obsidian'],
        question:
          'Without enchantments, which pickaxe in minecraft mines blocks the quickest.',
        type: 'multiple',
      },
      {
        category: 'History',
        correct_answer: '1983',
        difficulty: 'medium',
        incorrect_answers: ['1934', '1984', '1822'],
        question:
          'What year did Skoal, a smokeless Tobacco company, release their first line of Pouches, known as &quot;Skoal Bandits&quot;?',
        type: 'multiple',
      },
    ]);
    let renderResult = render(component);
    await waitFor(() => {
      expect(renderResult.getByTestId('question_0')).toBeDefined();
      expect(renderResult.getByTestId('question_1')).toBeDefined();
      expect(renderResult.getByTestId('question_2')).toBeDefined();
      expect(renderResult.getByTestId('question_3')).toBeDefined();
    });
    await LocalStorage.delete('quizs');
  });
});
