import { useReducer, useEffect } from 'react';
import Cookies from 'js-cookie';
import { isAxiosError } from 'axios';

import { AuthActionType, AuthContext, authReducer } from './';
import { tesloApi } from '@/api/axios-client';
import { IUser } from '@/interfaces';
import { RegisterReturn } from '../';
import { useRouter } from 'next/router';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const Auth_INIT_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = useReducer(authReducer, Auth_INIT_STATE);
  const { reload } = useRouter();

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const {
        data: { token, user },
      } = await tesloApi.post('/user/login', { email, password });

      Cookies.set('token', token);
      dispatch({ type: AuthActionType.login, payload: user });

      return true;
    } catch (error) {
      // todo: set err msg in [ui]
      dispatch({ type: AuthActionType.logout });
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<RegisterReturn> => {
    try {
      const {
        data: { token, user },
      } = await tesloApi.post('/user/register', { name, email, password });

      Cookies.set('token', token);
      dispatch({ type: AuthActionType.login, payload: user });

      return {
        hasError: false,
      };
    } catch (error) {
      if (isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }

      return {
        hasError: true,
        message:
          'It has not been possible to register the user, please try again',
      };
    }
  };

  const checkAuthToken = async () => {
    if (!Cookies.get('token')) return dispatch({ type: AuthActionType.logout });

    try {
      const {
        data: { token, user },
      } = await tesloApi.get('/user/validate-token');

      Cookies.set('token', token);
      dispatch({ type: AuthActionType.login, payload: user });
    } catch (error) {
      Cookies.remove('token');
      dispatch({ type: AuthActionType.logout });
    }
  };

  const logOut = () => {
    Cookies.remove('token');
    Cookies.remove('cart');

    dispatch({ type: AuthActionType.logout });
    reload();
  };

  useEffect(() => {
    checkAuthToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,

        // methods
        login,
        registerUser,
        logOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
