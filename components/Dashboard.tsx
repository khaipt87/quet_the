
import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Student, Answer, StudentWithResult } from '../types';
import { exportToExcel } from '../utils/excel';

interface DashboardProps {
  students: Student[];
  results: Record<string, Answer>;
}

const Dashboard: React.FC<DashboardProps> = ({ students, results }) => {
  const [selectedFilter, setSelectedFilter] = useState<Answer | 'ALL'>('ALL');

  const studentsWithResults: StudentWithResult[] = students.map(s => ({
    ...s,
    answer: results[s.id] || 'No Answer'
  }));

  const stats = [
    { name: 'A', count: studentsWithResults.filter(s => s.answer === 'A').length, color: '#3B82F6' },
    { name: 'B', count: studentsWithResults.filter(s => s.answer === 'B').length, color: '#10B981' },
    { name: 'C', count: studentsWithResults.filter(s => s.answer === 'C').length, color: '#F59E0B' },
    { name: 'D', count: studentsWithResults.filter(s => s.answer === 'D').length, color: '#EF4444' },
    { name: 'Chưa quét', count: studentsWithResults.filter(s => s.answer === 'No Answer').length, color: '#94A3B8' },
  ];

  const filteredStudents = selectedFilter === 'ALL' 
    ? studentsWithResults 
    : studentsWithResults.filter(s => s.answer === (selectedFilter === 'Chưa quét' ? 'No Answer' : selectedFilter));

  const handleExport = () => {
    exportToExcel(studentsWithResults);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Statistics Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold mb-6 flex items-center">
            <i className="fas fa-chart-bar text-indigo-600 mr-2"></i>
            Thống kê đáp án
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count">
                  {stats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedFilter(s.name as any)}
              className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center space-y-1 ${
                selectedFilter === s.name ? 'ring-2 ring-indigo-500 scale-105' : 'bg-white hover:border-indigo-300'
              }`}
              style={{ borderLeftColor: s.color, borderLeftWidth: '6px' }}
            >
              <span className="text-slate-500 text-sm font-medium">Đáp án {s.name}</span>
              <span className="text-3xl font-black" style={{ color: s.color }}>{s.count}</span>
              <span className="text-xs text-slate-400">học sinh</span>
            </button>
          ))}
          <button
            onClick={handleExport}
            className="col-span-2 p-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg transition-transform active:scale-95"
          >
            <i className="fas fa-file-excel"></i>
            <span>XUẤT BÁO CÁO EXCEL</span>
          </button>
        </div>
      </div>

      {/* Details Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-bold text-slate-700">
            {selectedFilter === 'ALL' ? 'Tất cả học sinh' : `Danh sách học sinh chọn ${selectedFilter}`}
          </h3>
          <button 
            onClick={() => setSelectedFilter('ALL')}
            className={`text-sm font-medium ${selectedFilter === 'ALL' ? 'text-slate-400' : 'text-blue-600 hover:underline'}`}
          >
            Hiện tất cả
          </button>
        </div>
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                <th className="px-6 py-3 border-b">ID</th>
                <th className="px-6 py-3 border-b">Họ tên</th>
                <th className="px-6 py-3 border-b">Lớp</th>
                <th className="px-6 py-3 border-b">Đáp án</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">
                    Không tìm thấy kết quả nào cho tiêu chí này.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-mono font-bold text-slate-700">{student.id}</td>
                    <td className="px-6 py-3 font-medium">{student.name}</td>
                    <td className="px-6 py-3 text-slate-500 text-sm">{student.className}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${
                        student.answer === 'A' ? 'bg-blue-100 text-blue-700' :
                        student.answer === 'B' ? 'bg-green-100 text-green-700' :
                        student.answer === 'C' ? 'bg-amber-100 text-amber-700' :
                        student.answer === 'D' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {student.answer}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
