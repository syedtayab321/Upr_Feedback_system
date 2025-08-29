import React from 'react';
import { FaUniversity } from 'react-icons/fa';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="bg-white shadow-2xl rounded-2xl p-6 md:p-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <FaUniversity className="text-4xl text-indigo-600 mr-3" />
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 text-center bg-gradient-to-r from-indigo-600 to-blue-500  bg-clip-text">
            Terms and Conditions
          </h1>
        </div>

        {/* Content */}
        <div className="prose prose-md md:prose-lg max-w-none text-gray-700 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm overflow-y-auto max-h-[70vh] transition-all duration-300">
          <h2 className="text-2xl font-semibold text-gray-800 mt-0 border-b-2 border-indigo-200 pb-2">
            1. Introduction
          </h2>
          <p>
            Welcome to the University Reputation Management System ("the System"). By accessing or using this System, you agree to be bound by these Terms and Conditions ("Terms"). These Terms govern your use of the System’s portals (Student, Academic, Non-Academic, Alumni, Community, Admin) and its features, including feedback submission, real-time chat, and sentiment analysis. If you do not agree with these Terms, you must not use the System.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-indigo-200 pb-2">
            2. User Responsibilities
          </h2>
          <p>
            As a user, you are expected to:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Provide accurate and truthful information when registering or submitting feedback.</li>
              <li>Use the System respectfully, refraining from posting offensive, defamatory, or inappropriate content in feedback or chats.</li>
              <li>Comply with university policies and all applicable local, national, and international laws.</li>
              <li>Maintain the confidentiality of your account credentials and report any unauthorized access immediately.</li>
            </ul>
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-indigo-200 pb-2">
            3. Role-Based Access
          </h2>
          <p>
            The System offers role-specific portals, each with distinct functionalities:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Student Portal</strong>: Enables students to submit feedback and engage in real-time chats with staff.</li>
              <li><strong>Academic Portal</strong>: Allows academic staff to view and respond to student feedback.</li>
              <li><strong>Non-Academic Portal</strong>: Facilitates management of operational feedback for non-academic staff.</li>
              <li><strong>Alumni Portal</strong>: Provides a platform for alumni to share feedback and engage with the community.</li>
              <li><strong>Community Portal</strong>: Enables external stakeholders to submit feedback.</li>
              <li><strong>Admin Portal</strong>: Grants administrators access to manage users, feedback, and system settings.</li>
            </ul>
            Users must access only the portal(s) corresponding to their assigned role(s).
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-indigo-200 pb-2">
            4. Data Privacy and Security
          </h2>
          <p>
            The University is committed to protecting your personal data:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Your feedback, chat messages, and personal information are stored securely using industry-standard encryption protocols.</li>
              <li>Data may be analyzed for sentiment trends and reporting to enhance university services, with personal identifiers anonymized where feasible.</li>
              <li>Your data will not be shared with third parties without your explicit consent, except as required by law or university policy.</li>
            </ul>
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-indigo-200 pb-2">
            5. Intellectual Property
          </h2>
          <p>
            All content submitted to the System, including feedback and chat messages, becomes the property of the university. The university may use this content for internal purposes, such as service improvement or generating reports. By submitting content, you grant the university a non-exclusive, royalty-free, perpetual license to use, reproduce, and analyze it.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-indigo-200 pb-2">
            6. Termination and Compliance
          </h2>
          <p>
            The university reserves the right to:
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Suspend or terminate access to the System for violations of these Terms or university policies.</li>
              <li>Moderate or remove content deemed inappropriate, offensive, or harmful.</li>
              <li>Monitor system usage to ensure compliance with these Terms and applicable regulations.</li>
            </ul>
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-indigo-200 pb-2">
            7. Limitation of Liability
          </h2>
          <p>
            The System is provided on an "as is" basis without warranties of any kind. The university shall not be liable for any damages arising from your use of the System, including but not limited to data loss, service interruptions, or inaccuracies in sentiment analysis or reporting.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-indigo-200 pb-2">
            8. Changes to Terms
          </h2>
          <p>
            These Terms may be updated periodically to reflect changes in the System or legal requirements. Users will be notified of significant changes via the System or email. Continued use of the System after such updates constitutes acceptance of the revised Terms.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-indigo-200 pb-2">
            9. Contact Information
          </h2>
          <p>
            For questions or concerns regarding these Terms, please contact:
            <br />
            <strong>Email</strong>: support@university-reputation.edu
            <br />
            <strong>Address</strong>: University Reputation Management Office, 123 Academic Lane, Education City
            <br />
            <strong>Phone</strong>: +1 (123) 456-7890
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;