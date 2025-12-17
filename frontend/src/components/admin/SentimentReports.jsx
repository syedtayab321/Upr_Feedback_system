import { useDispatch, useSelector } from 'react-redux';
import { generateReport } from './../../redux/slices/adminSlice';
import { Formik, Form, Field } from 'formik';
import { FaSpinner, FaCalendarAlt, FaUsers, FaChartBar, FaPercentage, FaArrowUp, FaArrowDown, FaEquals } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const SentimentReports = () => {
  const dispatch = useDispatch();
  const { report, loading, error } = useSelector((state) => state.admin);

  // Calculate additional metrics
  const total = report ? report.positive + report.neutral + report.negative : 0;
  const positivePercentage = total > 0 ? ((report?.positive / total) * 100).toFixed(1) : 0;
  const negativePercentage = total > 0 ? ((report?.negative / total) * 100).toFixed(1) : 0;
  const neutralPercentage = total > 0 ? ((report?.neutral / total) * 100).toFixed(1) : 0;

  // Chart data
  const barChartData = report
    ? [
        { name: 'Positive', value: report.positive, fill: '#10b981', icon: '↑' },
        { name: 'Neutral', value: report.neutral, fill: '#3b82f6', icon: '→' },
        { name: 'Negative', value: report.negative, fill: '#ef4444', icon: '↓' },
      ]
    : [];

  const pieChartData = report
    ? [
        { name: 'Positive', value: report.positive, color: '#10b981' },
        { name: 'Neutral', value: report.neutral, color: '#3b82f6' },
        { name: 'Negative', value: report.negative, color: '#ef4444' },
      ]
    : [];

  // Historical data (mock - you would get this from your API)
  const historicalData = [
    { month: 'Jan', positive: 45, neutral: 30, negative: 25 },
    { month: 'Feb', positive: 52, neutral: 28, negative: 20 },
    { month: 'Mar', positive: 48, neutral: 32, negative: 20 },
    { month: 'Apr', positive: 60, neutral: 25, negative: 15 },
    { month: 'May', positive: 55, neutral: 30, negative: 15 },
    { month: 'Jun', positive: 65, neutral: 25, negative: 10 },
  ];

  // Custom Tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value} ({((entry.value / total) * 100).toFixed(1)}%)
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl p-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Sentiment Analytics</h2>
          <p className="text-gray-600">Analyze sentiment trends and insights across different user roles</p>
        </div>
        <div className="flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full mt-4 md:mt-0">
          <FaChartBar />
          <span className="font-medium">Real-time Analytics</span>
        </div>
      </div>

      {/* Filter Form */}
      <div className="bg-gradient-to-r from-white to-indigo-50 rounded-xl p-6 mb-8 border border-indigo-100">
        <div className="flex items-center mb-4">
          <FaCalendarAlt className="text-indigo-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Filter Reports</h3>
        </div>
        <Formik
          initialValues={{ startDate: '', endDate: '', role: '' }}
          onSubmit={(values) => dispatch(generateReport(values))}
        >
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className=" text-sm font-medium text-gray-700 flex items-center">
                <FaCalendarAlt className="mr-2 text-indigo-500" />
                Start Date
              </label>
              <Field
                name="startDate"
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="endDate" className=" text-sm font-medium text-gray-700 flex items-center">
                <FaCalendarAlt className="mr-2 text-indigo-500" />
                End Date
              </label>
              <Field
                name="endDate"
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-gray-700 flex items-center">
                <FaUsers className="mr-2 text-indigo-500" />
                User Role
              </label>
              <Field
                as="select"
                name="role"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="">All Roles</option>
                <option value="student">Student</option>
                <option value="academic_staff">Academic Staff</option>
                <option value="non_academic_staff">Non-Academic Staff</option>
                <option value="alumni">Alumni</option>
              </Field>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  'Generate Report'
                )}
              </button>
            </div>
          </Form>
        </Formik>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-xl shadow-inner">
          <FaSpinner className="animate-spin text-5xl text-indigo-500 mb-4" />
          <p className="text-gray-600">Crunching the numbers...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-6 rounded-lg mb-8">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <FaArrowDown className="text-red-500 text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Generating Report</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Report Content */}
      {report && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaArrowUp className="text-green-600 text-2xl" />
                </div>
                <span className="text-green-600 text-sm font-semibold bg-green-100 px-3 py-1 rounded-full">
                  +{positivePercentage}%
                </span>
              </div>
              <h4 className="text-3xl font-bold text-gray-800">{report.positive}</h4>
              <p className="text-gray-600 font-medium">Positive Sentiments</p>
              <div className="mt-4 h-2 bg-green-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${positivePercentage}%` }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaEquals className="text-blue-600 text-2xl" />
                </div>
                <span className="text-blue-600 text-sm font-semibold bg-blue-100 px-3 py-1 rounded-full">
                  {neutralPercentage}%
                </span>
              </div>
              <h4 className="text-3xl font-bold text-gray-800">{report.neutral}</h4>
              <p className="text-gray-600 font-medium">Neutral Sentiments</p>
              <div className="mt-4 h-2 bg-blue-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${neutralPercentage}%` }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <FaArrowDown className="text-red-600 text-2xl" />
                </div>
                <span className="text-red-600 text-sm font-semibold bg-red-100 px-3 py-1 rounded-full">
                  {negativePercentage}%
                </span>
              </div>
              <h4 className="text-3xl font-bold text-gray-800">{report.negative}</h4>
              <p className="text-gray-600 font-medium">Negative Sentiments</p>
              <div className="mt-4 h-2 bg-red-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 rounded-full transition-all duration-500"
                  style={{ width: `${negativePercentage}%` }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border border-purple-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaUsers className="text-purple-600 text-2xl" />
                </div>
                <span className="text-purple-600 text-sm font-semibold bg-purple-100 px-3 py-1 rounded-full">
                  Total
                </span>
              </div>
              <h4 className="text-3xl font-bold text-gray-800">{total}</h4>
              <p className="text-gray-600 font-medium">Total Responses</p>
              <div className="mt-4 flex space-x-1">
                <div className="h-2 flex-1 bg-green-500 rounded-full" />
                <div className="h-2 flex-1 bg-blue-500 rounded-full" />
                <div className="h-2 flex-1 bg-red-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bar Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Sentiment Distribution</h3>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>Positive</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span>Neutral</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>Negative</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    radius={[8, 8, 0, 0]}
                    animationDuration={1500}
                  >
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Sentiment Ratio</h3>
              <div className="flex flex-col lg:flex-row items-center">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={1500}
                      animationBegin={0}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-6 lg:mt-0 lg:ml-8 space-y-4">
                  {pieChartData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded mr-3"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-gray-700 font-medium">{item.name}</span>
                      <span className="ml-auto font-bold">{item.value}</span>
                      <span className="ml-2 text-gray-500">
                        ({((item.value / total) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Sentiment Trends (Last 6 Months)</h3>
              <div className="text-sm text-gray-500">
                <FaChartBar className="inline mr-2" />
                Monthly Overview
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="positive" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.3}
                  name="Positive"
                />
                <Area 
                  type="monotone" 
                  dataKey="neutral" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                  name="Neutral"
                />
                <Area 
                  type="monotone" 
                  dataKey="negative" 
                  stackId="1"
                  stroke="#ef4444" 
                  fill="#ef4444" 
                  fillOpacity={0.3}
                  name="Negative"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Insights Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Key Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">Overall Sentiment</h4>
                <p className="text-gray-600 text-sm">
                  {positivePercentage > 50 ? 
                    "Majority positive sentiment indicates overall satisfaction." :
                    positivePercentage > negativePercentage ?
                    "Balanced sentiment with positive leaning." :
                    "Needs attention: Negative sentiment is significant."}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">Engagement Level</h4>
                <p className="text-gray-600 text-sm">
                  {total > 1000 ? "High engagement with significant response volume." :
                   total > 500 ? "Moderate engagement, consider increasing reach." :
                   "Low engagement, consider outreach initiatives."}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gray-800 mb-2">Recommendation</h4>
                <p className="text-gray-600 text-sm">
                  {negativePercentage > 30 ? 
                    "Focus on addressing negative feedback areas." :
                    "Continue current strategies, monitor neutral sentiments."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && !report && (
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="mx-auto w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <FaChartBar className="text-4xl text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">No Report Generated Yet</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Select a date range and user role to generate your first sentiment analysis report.
            Gain insights into feedback trends and user satisfaction levels.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Positive Feedback</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Neutral Feedback</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Negative Feedback</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentReports;