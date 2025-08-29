import { FaSignOutAlt } from 'react-icons/fa';

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Logout</h3>
        <p className="text-sm text-gray-600 mb-6">Are you sure you want to log out?</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center px-4 py-2 bg-navy-600 text-white bg-red-800 rounded-md hover:bg-navy-700 transition-colors"
          >
            <FaSignOutAlt className="mr-2 h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;