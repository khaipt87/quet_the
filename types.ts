
export interface Student {
  id: string;
  name: string;
  className: string;
}

export type Answer = 'A' | 'B' | 'C' | 'D' | 'No Answer';

export interface ScanResult {
  studentId: string;
  answer: Answer;
  timestamp: string;
}

export interface StudentWithResult extends Student {
  answer: Answer;
}

export enum ViewState {
  IMPORT = 'import',
  SCAN = 'scan',
  RESULTS = 'results'
}

export interface GeminiResponsePart {
  id: number;
  direction: 'Up' | 'Right' | 'Down' | 'Left';
}
