import { useEffect } from 'react';
import {  useSelector } from 'react-redux';
import LoginForm from './../../components/auth/LoginForm';

const LoginPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  return (
     <LoginForm />
  );
};

export default LoginPage;