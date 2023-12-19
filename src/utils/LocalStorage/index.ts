import AsyncStorage from '@react-native-async-storage/async-storage';

const LocalStorage = {
  setItem: async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return await LocalStorage.getItem(key);
    } catch (e) {
      throw new Error('set localStorage failed');
    }
  },

  getItem: async (key: string) => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      if (!keys.includes(key)) {
        return undefined;
      }
      const userInfoStr = await AsyncStorage.getItem(key);
      if (!userInfoStr?.length) {
        return undefined;
      }

      return key !== '@userId' ? JSON.parse(userInfoStr) : userInfoStr;
    } catch (e) {
      throw new Error('get localStorage failed');
    }
  },

  delete: async (key: string) => {
    try {
      AsyncStorage.removeItem(key);
    } catch (e) {
      throw new Error('delete localStorage failed');
    }
  },
  clear: async () => {
    try {
      AsyncStorage.clear();
    } catch (e) {
      throw new Error('clear localStorage failed');
    }
  },
};

export default LocalStorage;
