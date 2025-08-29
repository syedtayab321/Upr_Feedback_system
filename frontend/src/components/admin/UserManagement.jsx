import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser, deleteUser } from './../../redux/slices/adminSlice';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FaSpinner, FaTrash, FaEdit } from 'react-icons/fa';

const UserSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  role: Yup.string().required('Role is required'),
});

const UserManagement = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteUser(id));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  return (
    <div className='overflow-scroll'>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 ">
        <h2 className="text-xl font-semibold mb-4">{editingUser ? 'Edit User' : 'Create User'}</h2>
        <Formik
          enableReinitialize
          initialValues={
            editingUser
              ? { firstName: editingUser.firstName, lastName: editingUser.lastName, email: editingUser.email, password: '', role: editingUser.role }
              : { firstName: '', lastName: '', email: '', password: '', role: '' }
          }
          validationSchema={UserSchema}
          onSubmit={(values, { resetForm }) => {
            if (editingUser) {
              // Assuming updateUser action exists, otherwise implement it
              // dispatch(updateUser({ id: editingUser.id, data: values }));
              setEditingUser(null);
            } else {
              dispatch(createUser(values));
            }
            resetForm();
          }}
        >
          {({ errors, touched }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <Field name="firstName" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                {errors.firstName && touched.firstName && <div className="mt-1 text-red-500 text-sm">{errors.firstName}</div>}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <Field name="lastName" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                {errors.lastName && touched.lastName && <div className="mt-1 text-red-500 text-sm">{errors.lastName}</div>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <Field name="email" type="email" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                {errors.email && touched.email && <div className="mt-1 text-red-500 text-sm">{errors.email}</div>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <Field name="password" type="password" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                {errors.password && touched.password && <div className="mt-1 text-red-500 text-sm">{errors.password}</div>}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <Field as="select" name="role" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                  <option value="">Select Role</option>
                  <option value="student">Student</option>
                  <option value="academic_staff">Academic Staff</option>
                  <option value="non_academic_staff">Non-Academic Staff</option>
                  <option value="alumni">Alumni</option>
                  <option value="admin">Admin</option>
                </Field>
                {errors.role && touched.role && <div className="mt-1 text-red-500 text-sm">{errors.role}</div>}
              </div>
              <div className="md:col-span-2">
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                  {editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold bg-indigo-50 p-4 border-b border-indigo-100">Users List</h2>
        {loading && (
          <div className="flex justify-center items-center h-32">
            <FaSpinner className="animate-spin text-4xl text-indigo-500" />
          </div>
        )}
        {error && <p className="bg-red-50 text-red-700 p-4">{error}</p>}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-indigo-100 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-indigo-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${user.firstName} ${user.lastName}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button onClick={() => handleEdit(user)} className="text-indigo-600 hover:text-indigo-800 mr-4">
                      <FaEdit className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800">
                      <FaTrash className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && <p className="p-4 text-center text-gray-500">No users available</p>}
      </div>
    </div>
  );
};

export default UserManagement;