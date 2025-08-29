import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestionnaires, createQuestionnaire, updateQuestionnaire } from './../../redux/slices/adminSlice';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { FaSpinner, FaTrash, FaPlus, FaEdit } from 'react-icons/fa';

const QuestionnaireSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  portal: Yup.string().required('Portal is required'),
  questions: Yup.array()
    .of(
      Yup.object().shape({
        text: Yup.string().required('Question text is required'),
        type: Yup.string().required('Question type is required'),
      })
    )
    .min(1, 'At least one question is required'),
});

const QuestionnaireManager = () => {
  const dispatch = useDispatch();
  const { questionnaires, loading, error } = useSelector((state) => state.admin);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchQuestionnaires());
  }, [dispatch]);

  const handleEdit = (questionnaire) => {
    setEditingId(questionnaire.id);
  };

  return (
    <div className="overflow-scroll">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create / Edit Questionnaire</h2>
        <Formik
          enableReinitialize
          initialValues={
            editingId
              ? questionnaires.find((q) => q.id === editingId) || {
                  title: '',
                  portal: '',
                  questions: [{ text: '', type: 'text' }],
                }
              : { title: '', portal: '', questions: [{ text: '', type: 'text' }] }
          }
          validationSchema={QuestionnaireSchema}
          onSubmit={(values, { resetForm }) => {
            if (editingId) {
              dispatch(updateQuestionnaire({ id: editingId, data: values }));
              setEditingId(null);
            } else {
              dispatch(createQuestionnaire(values));
            }
            resetForm();
          }}
        >
          {({ values, errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <Field
                  name="title"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.title && touched.title && (
                  <div className="mt-1 text-red-500 text-sm">{errors.title}</div>
                )}
              </div>
              <div>
                <label htmlFor="portal" className="block text-sm font-medium text-gray-700 mb-1">
                  Portal
                </label>
                <Field
                  as="select"
                  name="portal"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select Portal</option>
                  <option value="student">Student</option>
                  <option value="academic">Academic</option>
                  <option value="non_academic">Non-Academic</option>
                  <option value="alumni">Alumni</option>
                </Field>
                {errors.portal && touched.portal && (
                  <div className="mt-1 text-red-500 text-sm">{errors.portal}</div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Questions</label>
                <FieldArray name="questions">
                  {({ push, remove }) => (
                    <div className="space-y-2">
                      {values.questions.map((_, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Field
                            name={`questions[${index}].text`}
                            placeholder="Question Text"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <Field
                            as="select"
                            name={`questions[${index}].type`}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          >
                            <option value="text">Text</option>
                            {/* <option value="rating">Rating</option>
                            <option value="multiple_choice">Multiple Choice</option> */}
                          </Field>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-2 text-red-500 hover:text-red-700"
                          >
                            <FaTrash className="h-5 w-5" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => push({ text: '', type: 'text' })}
                        className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        <FaPlus className="mr-1 h-4 w-4" /> Add Question
                      </button>
                    </div>
                  )}
                </FieldArray>
                {errors.questions && touched.questions && (
                  <div className="mt-1 text-red-500 text-sm">
                    {typeof errors.questions === 'string' ? errors.questions : 'Invalid questions format'}
                  </div>
                )}
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                {editingId ? 'Update' : 'Create'} Questionnaire
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold bg-indigo-50 p-4 border-b border-indigo-100">
          Questionnaires List
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-indigo-100 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Portal</th>
                <th className="px-6 py-3">Questions</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-50">
              {questionnaires.map((q) => (
                <tr key={q.id} className="hover:bg-indigo-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{q.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{q.portal}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {Array.isArray(q.questions) && q.questions.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {q.questions.map((question, index) => (
                          <li key={index}>{question.text || 'Unnamed question'}</li>
                        ))}
                      </ul>
                    ) : (
                      'No questions'
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleEdit(q)}
                      className="flex items-center px-3 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors text-xs font-medium"
                    >
                      <FaEdit className="mr-1 h-4 w-4" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {questionnaires.length === 0 && (
          <p className="p-4 text-center text-gray-500">No questionnaires available</p>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireManager;