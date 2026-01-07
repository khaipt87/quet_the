
import React from 'react';
import { parseStudentExcel } from '../utils/excel';
import { Student } from '../types';

interface StudentManagerProps {
  students: Student[];
  onImport: (students: Student[]) => void;
}

const StudentManager: React.FC<StudentManagerProps> = ({ students, onImport }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const importedStudents = await parseStudentExcel(file);
        onImport(importedStudents);
      } catch (err) {
        alert("Lỗi khi đọc file Excel. Vui lòng kiểm tra định dạng file (ID, Họ tên, Lớp).");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <i className="fas fa-file-excel text-green-600 mr-2"></i>
          Nhập danh sách học sinh
        </h2>
        <p className="text-slate-600 mb-6">
          Tải lên file Excel (.xlsx) chứa các cột: <code className="bg-slate-100 px-1 rounded text-pink-600 font-bold">ID</code>, 
          <code className="bg-slate-100 px-1 rounded text-pink-600 font-bold">Họ tên</code>, 
          <code className="bg-slate-100 px-1 rounded text-pink-600 font-bold">Lớp</code>.
        </p>
        
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <i className="fas fa-cloud-upload-alt text-3xl text-slate-400 mb-2"></i>
              <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Nhấn để chọn file</span> hoặc kéo thả</p>
              <p className="text-xs text-slate-400">Excel (.xlsx)</p>
            </div>
            <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileChange} />
          </label>
        </div>
      </div>

      {students.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">Danh sách đã nhập ({students.length} học sinh)</h3>
            <button 
              onClick={() => onImport([])}
              className="text-red-500 hover:text-red-700 text-sm font-medium"
            >
              Xóa tất cả
            </button>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white shadow-sm">
                <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold">
                  <th className="px-6 py-3 border-b">ID</th>
                  <th className="px-6 py-3 border-b">Họ tên</th>
                  <th className="px-6 py-3 border-b">Lớp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-3 font-mono text-blue-600 font-bold">{student.id}</td>
                    <td className="px-6 py-3">{student.name}</td>
                    <td className="px-6 py-3 text-slate-500">{student.className}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManager;
