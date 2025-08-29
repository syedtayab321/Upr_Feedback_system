import { useDispatch } from 'react-redux';
import { respondToFeedback } from './../../redux/slices/academicSlice';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { FaPaperPlane } from 'react-icons/fa';

const ResponseSchema = Yup.object().shape({
  response: Yup.string().required('Response is required')
});

const FeedbackResponseForm = ({ feedbackId }) => {
  const dispatch = useDispatch();

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Respond to Feedback</h3>
      <Formik
        initialValues={{ response: '' }}
        validationSchema={ResponseSchema}
        onSubmit={(values) => {
          dispatch(respondToFeedback({ feedbackId, response: values.response }));
        }}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4">
            <Field
              as="textarea"
              name="response"
              placeholder="Your response"
              className="border p-2 w-full rounded h-24"
            />
            {errors.response && touched.response && <div className="text-red-500">{errors.response}</div>}
            <button
              type="submit"
              className="flex items-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              <FaPaperPlane className="mr-2" /> Submit Response
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FeedbackResponseForm;