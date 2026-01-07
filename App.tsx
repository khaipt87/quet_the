
import React, { useState } from 'react';
import { Student, ViewState, Answer } from './types';
import StudentManager from './components/StudentManager';
import Scanner from './components/Scanner';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.IMPORT);
  const [students, setStudents] = useState<Student[]>([]);
  const [results, setResults] = useState<Record<string, Answer>>({});

  const handleScanResults = (newResults: { id: string, answer: Answer }[]) => {
    setResults(prev => {
      const updated = { ...prev };
      newResults.forEach(res => {
        updated[res.id] = res.answer;
      });
      return updated;
    });
    // Auto switch to dashboard after scan to show progress
    setCurrentView(ViewState.RESULTS);
  };

  const resetAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ dữ liệu và kết quả không?")) {
      setStudents([]);
      setResults({});
      setCurrentView(ViewState.IMPORT);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <nav className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg">
                <i className="fas fa-qrcode text-indigo-700 text-2xl"></i>
              </div>
              <h1 className="text-xl font-black tracking-tight">PLICKERS SCAN PRO</h1>
            </div>
            <div className="flex space-x-1 sm:space-x-4">
              <button 
                onClick={() => setCurrentView(ViewState.IMPORT)}
                className={`px-3 py-2 rounded-md text-sm font-bold flex items-center space-x-2 transition-colors ${
                  currentView === ViewState.IMPORT ? 'bg-indigo-800 text-white' : 'hover:bg-indigo-600'
                }`}
              >
                <i className="fas fa-users"></i>
                <span className="hidden sm:inline">Học sinh</span>
              </button>
              <button 
                onClick={() => setCurrentView(ViewState.SCAN)}
                className={`px-3 py-2 rounded-md text-sm font-bold flex items-center space-x-2 transition-colors ${
                  currentView === ViewState.SCAN ? 'bg-indigo-800 text-white' : 'hover:bg-indigo-600'
                }`}
              >
                <i className="fas fa-camera"></i>
                <span className="hidden sm:inline">Quét thẻ</span>
              </button>
              <button 
                onClick={() => setCurrentView(ViewState.RESULTS)}
                className={`px-3 py-2 rounded-md text-sm font-bold flex items-center space-x-2 transition-colors ${
                  currentView === ViewState.RESULTS ? 'bg-indigo-800 text-white' : 'hover:bg-indigo-600'
                }`}
              >
                <i className="fas fa-poll"></i>
                <span className="hidden sm:inline">Kết quả</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {currentView === ViewState.IMPORT && (
          <StudentManager 
            students={students} 
            onImport={(newStudents) => {
              setStudents(newStudents);
              if (newStudents.length > 0) setCurrentView(ViewState.SCAN);
            }} 
          />
        )}

        {currentView === ViewState.SCAN && (
          <div className="space-y-6">
            {students.length === 0 ? (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg text-center">
                <i className="fas fa-info-circle text-amber-500 text-4xl mb-4"></i>
                <h3 className="text-xl font-bold text-amber-900 mb-2">Chưa có danh sách học sinh</h3>
                <p className="text-amber-800 mb-6">Bạn cần nhập danh sách học sinh từ file Excel trước khi bắt đầu quét.</p>
                <button 
                  onClick={() => setCurrentView(ViewState.IMPORT)}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700"
                >
                  Nhập danh sách ngay
                </button>
              </div>
            ) : (
              <Scanner onScanResult={handleScanResults} />
            )}
          </div>
        )}

        {currentView === ViewState.RESULTS && (
          <Dashboard students={students} results={results} />
        )}
      </main>

      {/* Footer / Status bar */}
      <footer className="bg-white border-t border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-sm">
          <div className="flex space-x-6 mb-4 sm:mb-0">
            <span><i className="fas fa-user-graduate mr-1"></i> {students.length} Học sinh</span>
            <span><i className="fas fa-check-circle mr-1"></i> {Object.keys(results).length} Đã quét</span>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={resetAll}
              className="text-red-400 hover:text-red-600 flex items-center space-x-1"
            >
              <i className="fas fa-trash-alt"></i>
              <span>Cài đặt lại</span>
            </button>
            <span className="text-slate-300">|</span>
            <span>Ứng dụng hỗ trợ giảng dạy © 2024</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
