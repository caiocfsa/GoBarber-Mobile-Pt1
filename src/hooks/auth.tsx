import React, { createContext, useCallback, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface AuthState {
  token: string;
  user: object;
};

interface signInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: object;
  signIn(credentials: signInCredentials): Promise<void>;
  SignOut(): void;
}

 const AuthContext = createContext<AuthContextData>({} as AuthContextData);

 const AuthProvider: React.FC = ({ children }) => {

  const [data, setData] = useState<AuthState>({} as AuthState);

  useEffect(() => {
    async function loadStoragedData(): Promise<void>{
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBaber:token',
        '@GoBaber:user'
      ]);

      if(token[1] && user[1]) {
        setData({ token: token[1], user: JSON.parse(user[1])})
      }
    }
    loadStoragedData();
  }, [])

  const signIn = useCallback( async ({ email, password }) => {
    const response = await api.post('sessions', {
      email,
      password,
    });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber:tokken', token],
      ['@GoBarber:user', JSON.stringify(user)]
    ]);

    setData({ token, user })
  }, []);

  const SignOut = useCallback(async () => {

    await AsyncStorage.multiRemove([
      '@GoBarber:user',
      '@GoBarber:tokken'
    ]);

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ user: data.user, signIn, SignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if(!context){
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
}


export { AuthProvider, useAuth }
