
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { analyzeCardsInImage } from '../services/gemini';
import { Answer, GeminiResponsePart } from '../types';

interface ScannerProps {
  onScanResult: (results: { id: string, answer: Answer }[]) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScanResult }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setError(null);
    } catch (err) {
      setError("Không thể truy cập camera. Vui lòng kiểm tra quyền thiết bị.");
      console.error(err);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(true);
    setError(null);

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

      try {
        const results: GeminiResponsePart[] = await analyzeCardsInImage(base64Image);
        
        const mappedResults = results.map(r => ({
          id: String(r.id),
          answer: (r.direction === 'Up' ? 'A' : r.direction === 'Right' ? 'B' : r.direction === 'Down' ? 'C' : 'D') as Answer
        }));

        onScanResult(mappedResults);
      } catch (err) {
        setError("Lỗi khi xử lý hình ảnh. Hãy thử chụp lại ở nơi đủ sáng.");
      } finally {
        setIsScanning(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-full max-w-2xl bg-black rounded-xl overflow-hidden shadow-2xl aspect-video">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {isScanning && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white space-y-3 z-10">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-medium">AI đang quét thẻ...</p>
          </div>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-4">
          <button 
            onClick={captureAndScan}
            disabled={isScanning}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-500 text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center space-x-2 transition-all transform active:scale-95"
          >
            <i className="fas fa-camera text-xl"></i>
            <span>CHỤP VÀ QUÉT LỚP</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded w-full max-w-2xl flex items-center space-x-3">
          <i className="fas fa-exclamation-circle"></i>
          <p>{error}</p>
        </div>
      )}

      <div className="text-slate-500 text-sm max-w-xl text-center">
        <p><i className="fas fa-lightbulb text-yellow-500 mr-2"></i>Mẹo: Hãy đảm bảo học sinh cầm thẻ ngay ngắn, không che mất phần tam giác và ID. Ánh sáng phòng học nên đồng đều.</p>
      </div>
    </div>
  );
};

export default Scanner;
