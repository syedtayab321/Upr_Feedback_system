import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSentimentTrends } from '../../redux/slices/academicSlice';
import { Formik, Form, Field } from 'formik';
import { FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SentimentTrends = () => {
  const dispatch = useDispatch();
  const { sentimentTrends, loading, error } = useSelector((state) => state.academic);

  const chartData = sentimentTrends
    ? [
        { name: 'Positive', value: sentimentTrends.positive, fill: '#10b981' },
        { name: 'Negative', value: sentimentTrends.negative, fill: '#ef4444' },
        { name: 'Neutral', value: sentimentTrends.neutral, fill: '#6b7280' },
      ]
    : [];

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Sentiment Trends
        </h2>

        {/* Form */}
        <Formik
          initialValues={{ startDate: '', endDate: '' }}
          onSubmit={(values) => dispatch(fetchSentimentTrends(values))}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <Field
                  name="startDate"
                  type="date"
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              </div>
              <div className="w-full md:w-auto">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <Field
                  name="endDate"
                  type="date"
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                />
              </div>
              <div className="self-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:bg-blue-300 flex items-center"
                >
                  {isSubmitting ? (
                    <FaSpinner className="animate-spin mr-2" />
                  ) : (
                    'Generate Trends'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
            <FaExclamationCircle className="mr-2 text-xl" />
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !sentimentTrends && (
          <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
            <FaExclamationCircle className="text-5xl text-gray-400 mb-4" />
            <p className="text-lg font-semibold text-gray-600">
              No Sentiment Data Available
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Select a date range and generate trends to view sentiment data.
            </p>
          </div>
        )}

        {/* Chart */}
        {!loading && !error && sentimentTrends && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#4b5563', fontSize: 14 }}
                />
                <YAxis
                  tick={{ fill: '#4b5563', fontSize: 14 }}
                  label={{
                    value: 'Count',
                    angle: -90,
                    position: 'insideLeft',
                    fill: '#4b5563',
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar
                  dataKey="value"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default SentimentTrends;