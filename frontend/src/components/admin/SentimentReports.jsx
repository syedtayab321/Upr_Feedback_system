import { useDispatch, useSelector } from 'react-redux';
import { generateReport } from './../../redux/slices/adminSlice';
import { Formik, Form, Field } from 'formik';
import { FaSpinner } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SentimentReports = () => {
  const dispatch = useDispatch();
  const { report, loading, error } = useSelector((state) => state.admin);

  const chartData = report
    ? [
        { name: 'Positive', value: report.positive, fill: '#4ade80' },
        { name: 'Neutral', value: report.neutral, fill: '#60a5fa' },
        { name: 'Negative', value: report.negative, fill: '#f87171' },
      ]
    : [];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 overflow-scroll">
      <h2 className="text-xl font-semibold mb-4">Sentiment Reports</h2>
      <Formik
        initialValues={{ startDate: '', endDate: '', role: '' }}
        onSubmit={(values) => dispatch(generateReport(values))}
      >
        <Form className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <Field name="startDate" type="date" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <Field name="endDate" type="date" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <Field as="select" name="role" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="academic_staff">Academic Staff</option>
              <option value="non_academic_staff">Non-Academic Staff</option>
              <option value="alumni">Alumni</option>
            </Field>
          </div>
          <div className="flex items-end">
            <button type="submit" className="w-full px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              Generate Report
            </button>
          </div>
        </Form>
      </Formik>
      {loading && (
        <div className="flex justify-center items-center h-32">
          <FaSpinner className="animate-spin text-4xl text-indigo-500" />
        </div>
      )}
      {error && <p className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">{error}</p>}
      {report && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Sentiment Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{report.positive}</p>
              <p className="text-sm text-gray-600">Positive</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{report.neutral}</p>
              <p className="text-sm text-gray-600">Neutral</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-red-600">{report.negative}</p>
              <p className="text-sm text-gray-600">Negative</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentReports;