import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  submitFeedback,
  fetchQuestionnaires,
} from "../../redux/slices/academicSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  FaSpinner,
  FaPaperPlane,
  FaComments,
  FaChevronDown,
  FaCheckCircle,
  FaExclamationTriangle,
  FaClipboardList,
  FaQuestionCircle,
} from "react-icons/fa";

const FeedbackSchema = Yup.object().shape({
  questionnaireId: Yup.string(),
  content: Yup.string()
    .min(10, "Feedback must be at least 10 characters")
    .required("Feedback is required"),
});

const AcademicFeedbackForm = () => {
  const dispatch = useDispatch();
  const { questionnaires, loading, error, submitSuccess } = useSelector(
    (state) => state.academic
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchQuestionnaires());
  }, [dispatch]);

  useEffect(() => {
    if (submitSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitSuccess]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleQuestionnaireSelect = (q, setFieldValue) => {
    setSelectedQuestionnaire(q);
    setFieldValue("questionnaireId", q.id);
    setIsDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 animate-fade-in-up">
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl shadow-sm flex items-center">
              <FaCheckCircle className="text-green-500 text-xl mr-3" />
              <div>
                <p className="font-medium text-green-800">
                  Feedback submitted successfully!
                </p>
                <p className="text-green-600 text-sm">
                  Thank you for your valuable input.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 animate-shake">
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl shadow-sm flex items-center">
              <FaExclamationTriangle className="text-red-500 text-xl mr-3" />
              <div>
                <p className="font-medium text-red-800">Submission Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-indigo-500 to-blue-600"></div>

          <div className="p-6 md:p-8">
            <Formik
              initialValues={{ questionnaireId: "", content: "" }}
              validationSchema={FeedbackSchema}
              onSubmit={(values, { resetForm }) => {
                const submissionData = {
                  ...values,
                  portal: "academic",
                  questionnaireTitle: selectedQuestionnaire?.title,
                };
                dispatch(submitFeedback(submissionData));
                resetForm();
                setSelectedQuestionnaire(null);
              }}
            >
              {({ errors, touched, isSubmitting, setFieldValue }) => (
                <Form className="space-y-6">
                  {/* Questionnaire Selection */}
                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Questionnaire (Optional)
                    </label>

                    <div className="relative">
                      <div
                        className={`w-full px-4 py-3 border rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between ${
                          isDropdownOpen
                            ? "border-indigo-500 ring-1 ring-indigo-300"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      >
                        {selectedQuestionnaire ? (
                          <div className="flex items-center gap-3">
                            <FaClipboardList className="text-gray-500" />
                            <span className="font-medium">
                              {selectedQuestionnaire.title}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500">
                            Select questionnaire...
                          </span>
                        )}
                        <FaChevronDown
                          className={`text-gray-400 transition-transform duration-200 ${
                            isDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {isDropdownOpen && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                          <div className="py-1">
                            {loading ? (
                              <div className="flex items-center justify-center py-4">
                                <FaSpinner className="animate-spin text-gray-400" />
                              </div>
                            ) : questionnaires.length > 0 ? (
                              questionnaires.map((q) => (
                                <div
                                  key={q.id}
                                  className={`px-4 py-3 cursor-pointer hover:bg-gray-50 ${
                                    selectedQuestionnaire?.id === q.id
                                      ? "bg-blue-50"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleQuestionnaireSelect(q, setFieldValue)
                                  }
                                >
                                  <div className="flex items-center gap-3">
                                    <FaClipboardList className="text-gray-500 text-sm" />
                                    <div>
                                      <p className="font-medium text-gray-800">
                                        {q.title}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {q.questions?.length || 0} questions
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-center text-gray-500">
                                <FaQuestionCircle className="mx-auto mb-2 text-gray-400" />
                                <p className="text-sm">
                                  No questionnaires available
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Questions Preview */}
                  {selectedQuestionnaire && selectedQuestionnaire.questions && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <FaClipboardList className="text-blue-600" />
                        Questions in this questionnaire:
                      </h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {selectedQuestionnaire.questions.map(
                          (question, index) => (
                            <div
                              key={index}
                              className="bg-white rounded p-3 border border-blue-100"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium">
                                  {index + 1}
                                </div>
                                <div>
                                  <p className="text-sm text-gray-800">
                                    {question.text || question}
                                  </p>
                                  {question.type && (
                                    <span className="text-xs text-gray-500 mt-1">
                                      Type: {question.type}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Feedback Content */}
                  <div>
                    <label
                      htmlFor="content"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Your Feedback about Questioner *
                    </label>

                    <div className="relative">
                      <Field
                        as="textarea"
                        name="content"
                        placeholder="Share your detailed feedback here..."
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-40 resize-y transition-colors duration-200 ${
                          errors.content && touched.content
                            ? "border-red-300"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      />

                      <div className="absolute bottom-2 right-2">
                        <div className="text-xs text-gray-400 bg-white/90 px-2 py-1 rounded">
                          Min. 10 characters
                        </div>
                      </div>
                    </div>

                    <ErrorMessage
                      name="content"
                      component="div"
                      className="mt-1 text-sm text-red-600 bg-red-50 p-2 rounded"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading || isSubmitting}
                      className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading || isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane />
                          Submit Feedback
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-500 mt-2">
                      Your feedback is anonymous and will be reviewed promptly
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
              <FaCheckCircle className="text-blue-600" />
              Privacy Protected
            </h3>
            <p className="text-sm text-gray-600">
              All submissions are completely anonymous. No personal data is
              stored.
            </p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-medium text-gray-800 mb-2 flex items-center gap-2">
              <FaComments className="text-blue-600" />
              Why Your Feedback Matters
            </h3>
            <p className="text-sm text-gray-600">
              Your input helps us improve services and create better experiences
              for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
  .animate-fade-in-up {
    animation: fadeInUp 0.3s ease-out;
  }
  .animate-shake {
    animation: shake 0.3s ease-in-out;
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-3px); }
    75% { transform: translateX(3px); }
  }
`}</style>
    </div>
  );
};

export default AcademicFeedbackForm;
