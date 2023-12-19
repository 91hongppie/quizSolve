import axios from 'axios';
import LocalStorage from '../utils/LocalStorage';
import {Alert, Platform} from 'react-native';

const seconds = 1000;
const baseInstance = axios.create({
  baseURL:
    'https://opentdb.com',
  timeout: 5 * seconds,
  headers: {
    'content-type': 'application/json',
  },
});

const requests = {
  get: async (path: string) => {
    try {
      return await baseInstance.get(path);
    } catch (e) {
      throw new Error(`${path} get failed`);
    }
  },
};

const Quiz = {
    getQuiz: async ({ amount }: { amount: number }) => {
        return await requests.get(`/api.php?type=multiple&amount=${amount}`).then(res => {
            return res.data
        }).catch(() => {
            Alert.alert('잠시후 다시 시도해주세요.')
        })
    }
}

const api = {
    Quiz
}

export default api