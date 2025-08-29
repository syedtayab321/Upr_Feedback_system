import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import RegisterForm from '../../components/auth/RegisterForm';

const RegisterPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    }
  }, [isAuthenticated]);

  return (
    <>
       <RegisterForm />
    </>
  );
};

export default RegisterPage;