import { FaBars, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = ({ tabs, activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen, setIsLogoutModalOpen }) => {
  return (
    <>
      {/* Sidebar */}
      <aside
        className={` bg-blue-950 fixed inset-y-0 left-0 z-30 w-64 bg-navy-800 border-r border-navy-700 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:block`}
      >
        <nav className="h-full flex flex-col justify-between py-6 px-4">
          <div>
            <h2 className="text-lg font-semibold text-white px-4 mb-6">Navigation</h2>
            <ul className="space-y-1">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors cursor-pointer text-blue ${
                      activeTab === tab.id
                        ? 'bg-navy-600 text-black shadow-md bg-white'
                        : 'text-navy-100 hover:bg-navy-700 text-white hover:text-white'
                    }`}
                  >
                    <tab.icon className="mr-3 h-5 w-5" />
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <button
              onClick={() => {
                setIsLogoutModalOpen(true);
                setIsSidebarOpen(false);
              }}
              className="flex items-center w-full px-4 bg-red-800 text-white py-3 text-sm font-medium text-navy-100 hover:bg-navy-700 hover:text-white rounded-md transition-colors cursor-pointer"
            >
              <FaSignOutAlt className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;