import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import studentReducer from './slices/studentSlice';
import academicReducer from './slices/academicSlice';
import nonAcademicReducer from './slices/nonacademicSlice';
import alumniReducer from './slices/alumniSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    student: studentReducer,
    academic: academicReducer,
    nonAcademic: nonAcademicReducer,
    alumni: alumniReducer,
  },
});

export default store;