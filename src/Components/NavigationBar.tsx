import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface NavigationBarProps {
  rightFunction?: () => void;
  rightTitle?: string;
  title?: string;
  leftFunction?: () => void;
  leftTitle?: string;
}

const NavigationBar = ({
  rightFunction,
  rightTitle,
  title,
  leftFunction,
  leftTitle,
}: NavigationBarProps) => {
  return (
    <View style={styles.navigationBar}>
      <TouchableOpacity style={styles.buttonToHome} onPress={leftFunction}>
        <Text style={styles.homeButtonText}>{leftTitle}</Text>
      </TouchableOpacity>
      <View style={styles.title}>
        <Text>{title}</Text>
      </View>
      <TouchableOpacity style={styles.buttonToNext} onPress={rightFunction}>
        <Text style={styles.nextButtonText}>{rightTitle}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navigationBar: {
    height: 50,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonToHome: {position: 'absolute', left: 10},
  buttonToNext: {
    position: 'absolute',
    right: 10,
  },
  homeButtonText: {
    color: 'blue',
    fontSize: 16,
  },
  nextButtonText: {
    color: 'green',
    fontSize: 16,
  },
  title: {alignItems: 'center'},
});

export default NavigationBar;
