import 'react-native';
import React, {ReactElement} from 'react';

// Note: import explicitly to use the types shipped with jest.
import {it, describe} from '@jest/globals';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import MainScreen from '../src/Screens/MainScreen';
import {render} from '@testing-library/react-native';

let props;
let component: ReactElement;

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

function getTempComponent(props: any) {
  return <MainScreen {...props} />;
}
describe('Main', () => {
  props = {};
  component = getTempComponent(props);
  it('renders without crashing', () => {
    const renderResult = render(component);
    const renderedJson = renderResult.toJSON();
    expect(renderedJson).toMatchSnapshot();
    expect(renderedJson).toBeTruthy();
  });

  it('닉네임 입력창 존재 확인', () => {
    const renderResult = render(component);

    expect(renderResult.getByTestId('nicknameInput')).toBeDefined();
  });
  it('문항 수 입력창 존재 확인', () => {
    const renderResult = render(component);

    expect(renderResult.getByTestId('quizNumInput')).toBeDefined();
  });
  it('문제풀기 버튼 존재 확인', () => {
    const renderResult = render(component);

    expect(renderResult.getByTestId('quizSolveButton')).toBeDefined();
  });
});
