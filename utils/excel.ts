
import * as XLSX from 'xlsx';
import { Student, StudentWithResult } from '../types';

export function parseStudentExcel(file: File): Promise<Student[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        const students: Student[] = jsonData.map(row => ({
          id: String(row.ID || row.Id || row['Số thứ tự'] || ''),
          name: String(row['Họ tên'] || row.Name || row.FullName || ''),
          className: String(row['Lớp'] || row.Class || '')
        })).filter(s => s.id && s.name);

        resolve(students);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

export function exportToExcel(data: StudentWithResult[]) {
  const worksheet = XLSX.utils.json_to_sheet(data.map(s => ({
    'ID': s.id,
    'Họ tên': s.name,
    'Lớp': s.className,
    'Kết quả': s.answer
  })));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Kết quả quét");
  XLSX.writeFile(workbook, `Ket_qua_quet_${new Date().toLocaleDateString()}.xlsx`);
}
