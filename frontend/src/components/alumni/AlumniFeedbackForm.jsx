import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitFeedback } from './../../redux/slices/alumniSlice';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FaSpinner, FaPaperPlane } from 'react-icons/fa';

const FeedbackSchema = Yup.object().shape({
  content: Yup.string().required('Feedback is required')
});

const AlumniFeedbackForm = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.alumni);

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Share Your Feedback</h2>
      <p className="text-gray-600 mb-4">Share your university experience or suggest improvements for alumni engagement programs.</p>
      {loading && <FaSpinner className="animate-spin text-2xl text-blue-500" />}
      {error && <p className="text-red-500">{error}</p>}
      <Formik
        initialValues={{ content: '' }}
        validationSchema={FeedbackSchema}
        onSubmit={(values) => dispatch(submitFeedback({ content: values.content, portal: 'alumni' }))}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <Field
                as="textarea"
                name="content"
                placeholder="Your feedback or suggestions"
                className="border p-2 w-full rounded h-32"
              />
              {errors.content && touched.content && <div className="text-red-500">{errors.content}</div>}
            </div>
            <button
              type="submit"
              className="flex items-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              <FaPaperPlane className="mr-2" /> Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AlumniFeedbackForm;