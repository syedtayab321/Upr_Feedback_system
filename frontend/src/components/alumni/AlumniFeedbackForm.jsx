import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitFeedback } from './../../redux/slices/alumniSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  FaSpinner, 
  FaPaperPlane, 
  FaCheckCircle, 
  FaLightbulb, 
  FaCommentAlt,
  FaGraduationCap,
  FaThumbsUp,
  FaExclamationTriangle
} from 'react-icons/fa';

const FeedbackSchema = Yup.object().shape({
  content: Yup.string()
    .min(10, 'Feedback must be at least 10 characters')
    .max(1000, 'Feedback must be less than 1000 characters')
    .required('Feedback is required')
});

const AlumniFeedbackForm = () => {
  const dispatch = useDispatch();
  const { loading, error, submitSuccess } = useSelector((state) => state.alumni);
  const [showSuccess, setShowSuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);

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

  const handleSubmit = (values, { resetForm }) => {
    dispatch(submitFeedback({ 
      content: values.content, 
      portal: 'alumni',
      questionnaireId: values.questionnaireId || null 
    }));
    resetForm();
    setCharCount(0);
  };

  const handleContentChange = (e, setFieldValue) => {
    const value = e.target.value;
    setFieldValue('content', value);
    setCharCount(value.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
      

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Tips & Info */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Tips Card */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaLightbulb className="text-yellow-500" />
                  Tips for Great Feedback
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold">1</span>
                    </div>
                    <span>Be specific about your experiences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold">2</span>
                    </div>
                    <span>Suggest actionable improvements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <span className="text-xs font-bold">3</span>
                    </div>
                    <span>Share both positive experiences and areas for growth</span>
                  </li>
                </ul>
              </div>

              {/* Impact Card */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FaThumbsUp className="text-white" />
                  Your Impact
                </h3>
                <p className="text-sm text-blue-100 mb-4">
                  Alumni feedback has helped us:
                </p>
                <ul className="space-y-2 text-sm text-blue-100">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Launch 5+ new alumni programs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Improve career services by 40%</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Connect 500+ alumni mentors</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              
              <div className="p-6 md:p-8">
                {/* Success Message */}
                {showSuccess && (
                  <div className="mb-6 animate-fade-in-up">
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg flex items-start gap-3">
                      <FaCheckCircle className="text-green-500 text-xl mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">Thank you for your feedback!</p>
                        <p className="text-green-700 text-sm">Your insights help shape better alumni experiences.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-6 animate-shake">
                    <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
                      <FaExclamationTriangle className="text-red-500 text-xl mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800">Submission Error</p>
                        <p className="text-red-700 text-sm">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <Formik
                  initialValues={{ content: '', questionnaireId: '' }}
                  validationSchema={FeedbackSchema}
                  onSubmit={handleSubmit}
                >
                  {({ errors, touched, isSubmitting, setFieldValue, values }) => (
                    <Form className="space-y-6">
                      {/* Feedback Content */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          <span className="inline-flex items-center gap-2">
                            <FaCommentAlt className="text-blue-600" />
                            Your Feedback *
                          </span>
                          <span className="text-xs text-gray-500 font-normal ml-2">
                            Share your valuable insights
                          </span>
                        </label>
                        
                        <div className="relative">
                          <Field
                            as="textarea"
                            name="content"
                            value={values.content}
                            onChange={(e) => handleContentChange(e, setFieldValue)}
                            placeholder="Share your alumni experience, suggestions for improvement, or ideas for new programs...

Examples:
• 'The alumni networking events helped me connect with industry professionals...'
• 'I suggest adding more virtual career workshops for alumni living abroad...'
• 'My experience with the mentorship program was transformative because...'"
                            className={`w-full px-4 py-4 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-48 resize-y transition-all duration-200 ${
                              errors.content && touched.content 
                                ? 'border-red-300 focus:ring-red-100' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          />
                          
                          {/* Character Counter */}
                          <div className="absolute bottom-3 right-3 flex items-center gap-2">
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              charCount < 10 
                                ? 'bg-gray-100 text-gray-500' 
                                : 'bg-green-100 text-green-600'
                            }`}>
                              {charCount}/1000
                            </div>
                            <div className="text-xs text-gray-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded">
                              Min. 10 characters
                            </div>
                          </div>
                        </div>
                        
                        <ErrorMessage
                          name="content"
                          component="div"
                          className="mt-2 text-sm text-red-600 flex items-start gap-2 bg-red-50 p-3 rounded-lg"
                        />
                      </div>

                      {/* Optional Questionnaire */}
                      <div className="hidden">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category (Optional)
                        </label>
                        <Field
                          as="select"
                          name="questionnaireId"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Select a category</option>
                          <option value="career">Career Support</option>
                          <option value="networking">Networking</option>
                          <option value="events">Events & Programs</option>
                          <option value="general">General Feedback</option>
                        </Field>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={loading || isSubmitting || charCount < 10}
                          className="group w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                          {loading || isSubmitting ? (
                            <>
                              <FaSpinner className="animate-spin" />
                              <span>Submitting Feedback...</span>
                            </>
                          ) : (
                            <>
                              <div className="relative">
                                <FaPaperPlane className="text-lg group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                              <span className="text-lg">Submit Feedback</span>
                            </>
                          )}
                        </button>
                        
                        <div className="text-center text-sm text-gray-500 mt-4 space-y-2">
                          <p>Your feedback is confidential and will be reviewed within 48 hours</p>
                          <div className="flex items-center justify-center gap-4 text-xs">
                            <span className="flex items-center gap-1">
                              <FaCheckCircle className="text-green-500" />
                              Anonymous submission
                            </span>
                            <span className="flex items-center gap-1">
                              <FaCheckCircle className="text-green-500" />
                              Alumni-focused review
                            </span>
                          </div>
                        </div>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaCommentAlt className="text-blue-600" />
                What Happens Next?
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-1">Review Process</h4>
                  <p className="text-sm text-gray-600">Your feedback is analyzed by our alumni relations team</p>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <div className="w-12 h-12 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-indigo-600 font-bold">2</span>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-1">Action Planning</h4>
                  <p className="text-sm text-gray-600">Actionable insights are prioritized for implementation</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-1">Continuous Updates</h4>
                  <p className="text-sm text-gray-600">You may receive updates on how your feedback is used</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add animations */}
      <style jsx>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default AlumniFeedbackForm;