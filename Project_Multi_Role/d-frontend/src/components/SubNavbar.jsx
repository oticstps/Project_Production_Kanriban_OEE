// src/components/SubNavbar.jsx
export default function SubNavbar({ tabs = [], activeTab = '' }) {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <a
              key={tab.id}
              href={tab.href}
              className={`py-4 px-1 text-sm font-medium whitespace-nowrap border-b-2 ${
                tab.id === activeTab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}