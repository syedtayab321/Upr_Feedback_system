import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitFeedback, fetchQuestionnaires } from './../../redux/slices/studentSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaSpinner, FaPaperPlane, FaComments, FaChevronDown, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const FeedbackSchema = Yup.object().shape({
  questionnaireId: Yup.string(),
  content: Yup.string()
    .min(10, 'Feedback must be at least 10 characters')
    .required('Feedback is required')
});

const FeedbackForm = () => {
  const dispatch = useDispatch();
  const { questionnaires, loading, error, submitSuccess } = useSelector((state) => state.student);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchQuestionnaires());
  }, [dispatch]);

  useEffect(() => {
    if (submitSuccess) {
      setShowSuccess(true);
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          {/* <div className="inline-flex items-center justify-center p-4 bg-white rounded-full shadow-lg mb-4">
            <FaComments className="text-3xl text-indigo-600 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Submit Feedback</h1>
          </div> */}
          <p className="text-lg text-gray-600">
            Share your thoughts to help us improve the academic experience
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg shadow-md flex items-start">
            <FaCheckCircle className="text-xl mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium">Thank you for your feedback!</p>
              <p className="text-sm">Your submission has been received and will be reviewed.</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md flex items-start">
            <FaExclamationTriangle className="text-xl mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium">Something went wrong</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-1 bg-gradient-to-r from-indigo-500 to-blue-600"></div>
          
          <div className="p-6 md:p-8">
            <Formik
              initialValues={{ questionnaireId: '', content: '' }}
              validationSchema={FeedbackSchema}
              onSubmit={(values, { resetForm }) => {
                dispatch(submitFeedback({ ...values, portal: 'student' }));
                resetForm();
              }}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Questionnaire Selection */}
                  <div>
                    <label htmlFor="questionnaireId" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Questionnaire (Optional)
                    </label>
                    <div className="relative">
                      <Field
                        as="select"
                        name="questionnaireId"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white cursor-pointer"
                      >
                        <option value="">Choose a questionnaire...</option>
                        {questionnaires.map((q) => (
                          <option key={q.id} value={q.id}>{q.title}</option>
                        ))}
                      </Field>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                        <FaChevronDown className="text-sm" />
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Selecting a questionnaire helps categorize your feedback
                    </p>
                  </div>

                  {/* Feedback Content */}
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Feedback *
                    </label>
                    <Field
                      as="textarea"
                      name="content"
                      placeholder="Share your thoughts, suggestions, or concerns..."
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-40 resize-y ${
                        errors.content && touched.content ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <ErrorMessage
                      name="content"
                      component="div"
                      className="mt-1 text-sm text-red-600 flex items-start"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Please provide detailed feedback to help us understand your perspective
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || isSubmitting}
                    className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {loading || isSubmitting ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <FaComments className="text-indigo-600 mr-2" />
            About Feedback Submission
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                <span className="text-xs font-bold">1</span>
              </div>
              <span>Your feedback is anonymous unless you choose to identify yourself</span>
            </li>
            <li className="flex items-start">
              <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                <span className="text-xs font-bold">2</span>
              </div>
              <span>Constructive feedback helps us improve our services</span>
            </li>
            <li className="flex items-start">
              <div className="w-5 h-5 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                <span className="text-xs font-bold">3</span>
              </div>
              <span>You may receive a response from our staff within 3-5 business days</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;