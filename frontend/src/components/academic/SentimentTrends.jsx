import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSentimentTrends } from '../../redux/slices/academicSlice';
import { Formik, Form, Field } from 'formik';
import { FaSpinner, FaExclamationCircle, FaChartBar, FaCalendarAlt } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SentimentTrends = () => {
  const dispatch = useDispatch();
  const { 
    sentimentTrends, 
    loading,  // This is state.academic.loading (always false in your slice)
    error 
  } = useSelector((state) => state.academic);

  // But we should use the sentiment-specific loading state
  const sentimentLoading = useSelector((state) => state.academic.operations.sentiment.loading);
  const sentimentError = useSelector((state) => state.academic.operations.sentiment.error);

  const chartData = sentimentTrends
    ? [
        { name: 'Positive', value: sentimentTrends.positive || 0, fill: '#10b981' },
        { name: 'Negative', value: sentimentTrends.negative || 0, fill: '#ef4444' },
        { name: 'Neutral', value: sentimentTrends.neutral || 0, fill: '#6b7280' },
      ]
    : [];

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg mb-4">
            <FaChartBar className="text-2xl text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Sentiment Trends Analysis
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Analyze feedback sentiment patterns over time to identify areas for improvement
          </p>
        </div>

        {/* Form */}
        <div className="mb-10 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaCalendarAlt className="text-blue-600" />
            Select Date Range
          </h3>
          <Formik
            initialValues={{ startDate: '', endDate: '' }}
            onSubmit={(values, { setSubmitting }) => {
              console.log("Form submitted with values:", values);
              dispatch(fetchSentimentTrends(values))
                .finally(() => setSubmitting(false));
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <div className="w-full md:w-auto flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <Field
                    name="startDate"
                    type="date"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
                <div className="w-full md:w-auto flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <Field
                    name="endDate"
                    type="date"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>
                <div className="w-full md:w-auto mt-6 md:mt-0">
                  <button
                    type="submit"
                    disabled={isSubmitting || sentimentLoading}
                    className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    {(isSubmitting || sentimentLoading) ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <FaChartBar />
                        <span>Generate Trends</span>
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Loading State */}
        {sentimentLoading && (
          <div className="flex flex-col items-center justify-center py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mb-8">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mb-4" />
            <p className="text-lg font-semibold text-gray-700">Analyzing Sentiment Data</p>
            <p className="text-gray-600 text-sm mt-2">Please wait while we process the feedback data...</p>
          </div>
        )}

        {/* Error State */}
        {sentimentError && (
          <div className="mb-8 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
            <FaExclamationCircle className="text-red-500 text-xl mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">Unable to Load Data</p>
              <p className="text-red-700 text-sm mt-1">{sentimentError}</p>
              <p className="text-red-600 text-xs mt-2">Please check your dates and try again.</p>
            </div>
          </div>
        )}

        {/* Empty State - No data selected */}
        {!sentimentLoading && !sentimentError && !sentimentTrends && (
          <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
            <FaChartBar className="text-5xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to Analyze</h3>
            <p className="text-gray-600 text-center max-w-md mb-6">
              Select a date range above to analyze feedback sentiment trends for that period.
            </p>
            <div className="text-sm text-gray-500 text-center">
              <p>💡 Tips:</p>
              <p className="mt-1">• Analyze weekly, monthly, or custom date ranges</p>
              <p>• Use the insights to improve student experience</p>
            </div>
          </div>
        )}

        {/* Chart Display */}
        {!sentimentLoading && !sentimentError && sentimentTrends && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Sentiment Distribution</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Feedback analysis based on {chartData.reduce((sum, item) => sum + item.value, 0)} total responses
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-gray-700">Positive</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-gray-700">Negative</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-gray-700">Neutral</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {chartData.every(item => item.value === 0) ? (
                <div className="text-center py-12">
                  <FaExclamationCircle className="text-4xl text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-700">No Data Found</h4>
                  <p className="text-gray-600 mt-2">
                    No feedback data available for the selected date range.
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    Try selecting a different date range.
                  </p>
                </div>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis 
                        dataKey="name"
                        tick={{ fill: '#4b5563', fontSize: 14, fontWeight: 500 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                      />
                      <YAxis 
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        axisLine={{ stroke: '#e5e7eb' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        }}
                        formatter={(value) => [value, 'Feedback Count']}
                        labelFormatter={(label) => `Sentiment: ${label}`}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="circle"
                        iconSize={10}
                      />
                      <Bar
                        dataKey="value"
                        name="Feedback Count"
                        radius={[8, 8, 0, 0]}
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              {/* Statistics Summary */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-800">Positive</p>
                      <p className="text-2xl font-bold text-green-900">{chartData[0]?.value || 0}</p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <FaChartBar className="text-green-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg border border-red-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-800">Negative</p>
                      <p className="text-2xl font-bold text-red-900">{chartData[1]?.value || 0}</p>
                    </div>
                    <div className="p-2 bg-red-100 rounded-lg">
                      <FaChartBar className="text-red-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-800">Neutral</p>
                      <p className="text-2xl font-bold text-gray-900">{chartData[2]?.value || 0}</p>
                    </div>
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <FaChartBar className="text-gray-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SentimentTrends;