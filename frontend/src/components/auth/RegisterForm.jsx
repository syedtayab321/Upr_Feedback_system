import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from './../../redux/slices/authSlice';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (values) => {
    dispatch(registerUser(values))
      .unwrap()
      .then(() => {
        navigate('/dashboard');
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-6 bg-white p-6 rounded-2xl shadow-2xl transform transition-all duration-500">
        <div>
          <h2 className="text-center text-2xl font-extrabold text-gray-900 tracking-tight">
            Create Your Account
          </h2>
          <p className="mt-1 text-center text-sm text-gray-600">
            Join us today
          </p>
        </div>
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: 'student'
          }}
          validate={(values) => {
            const errors = {};
            if (!values.firstName) errors.firstName = 'First name is required';
            if (!values.lastName) errors.lastName = 'Last name is required';
            if (!values.email) {
              errors.email = 'Email is required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
              errors.email = 'Invalid email address';
            }
            if (!values.password) errors.password = 'Password is required';
            if (values.password.length < 6) errors.password = 'Password must be at least 6 characters';
            if (values.password !== values.confirmPassword) {
              errors.confirmPassword = 'Passwords must match';
            }
            return errors;
          }}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 rounded-lg animate-slide-in text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <div className="mt-1 relative group">
                    <Field
                      name="firstName"
                      type="text"
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md pl-10"
                      placeholder="First name"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-4 w-4 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </div>
                  {touched.firstName && errors.firstName && (
                    <div className="mt-1 text-red-600 text-xs animate-fade-in">{errors.firstName}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <div className="mt-1 relative group">
                    <Field
                      name="lastName"
                      type="text"
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md pl-10"
                      placeholder="Last name"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-4 w-4 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </div>
                  {touched.lastName && errors.lastName && (
                    <div className="mt-1 text-red-600 text-xs animate-fade-in">{errors.lastName}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative group">
                    <Field
                      name="email"
                      type="email"
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md pl-10"
                      placeholder="Enter your email"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="h-4 w-4 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </div>
                  {touched.email && errors.email && (
                    <div className="mt-1 text-red-600 text-xs animate-fade-in">{errors.email}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    I am a
                  </label>
                  <Field
                    as="select"
                    name="role"
                    className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                  >
                    <option value="student">Student</option>
                    <option value="academic_staff">Academic Staff</option>
                    <option value="non_academic_staff">Non-Academic Staff</option>
                    <option value="alumni">Alumni</option>
                    <option value="community">Community Member</option>
                    <option value="admin">Admin</option>
                  </Field>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative group">
                    <Field
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md pl-10 pr-10"
                      placeholder="Create a password"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-4 w-4 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-4 w-4 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
                      ) : (
                        <FaEye className="h-4 w-4 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
                      )}
                    </button>
                  </div>
                  {touched.password && errors.password && (
                    <div className="mt-1 text-red-600 text-xs animate-fade-in">{errors.password}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative group">
                    <Field
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      className="block w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 group-hover:shadow-md pl-10 pr-10"
                      placeholder="Confirm your password"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-4 w-4 text-indigo-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <div className="mt-1 text-red-600 text-xs animate-fade-in">{errors.confirmPassword}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <Field
                  type="checkbox"
                  name="terms"
                  id="terms"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition-colors duration-200"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <Link to='/terms' target='_blank' className="text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                    Terms and Conditions
                  </Link>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating account...
                    </div>
                  ) : (
                    'Create account'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;