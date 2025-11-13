import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useReactToPrint } from "react-to-print";
import { useQrStore } from "../../store/event/useQrStore.js";

const QRCodeModal = ({ event, isOpen, onClose }) => {
  const attendanceRef = useRef();
  const endEventRef = useRef();

  const { timeInQrCode, timeOutQrCode, generateBothQr } = useQrStore()

  useEffect(() => {
    if (isOpen) {
      if (!timeInQrCode || !timeOutQrCode) {
        
        const fetching = async () => {
            await generateBothQr(event?.id)
            console.log('event id', event?.id)
        }

        fetching()

      }
    }
  }, [isOpen, timeInQrCode, timeOutQrCode]);

  const handleDownloadQrCode = (base64Image, filename) => {
    const link = document.createElement("a");
    link.href = base64Image;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-6 text-center">
          Event Attendance QR Codes
        </h2>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <div ref={attendanceRef} className="flex flex-col items-center">
              <img src={
                timeInQrCode
                    ? timeInQrCode
                    : "Generating..."
                } alt={timeInQrCode ? timeInQrCode : 'generating...'} />
              <span className="mt-2 font-semibold text-gray-700">
                Time In Attendance
              </span>
            </div>
            <button
              onClick={() => handleDownloadQrCode(timeInQrCode, `${event.title}-time-in-qrCode.png`)}
              className="mt-3 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm"
            >
              Download QR
            </button>
          </div>

          <div className="flex flex-col items-center">
            <div ref={endEventRef} className="flex flex-col items-center">
              <img src={
                timeOutQrCode ? timeOutQrCode : "Generating..."
              } alt={timeOutQrCode ? timeOutQrCode : "Generating..."} />
              <span className="mt-2 font-semibold text-gray-700">
                Time Out Attendance
              </span>
            </div>
            <button
              onClick={() => handleDownloadQrCode(timeOutQrCode, `${event.title}-time-out-qrCode.png`)}
              className="mt-3 px-3 py-1C rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm"
            >
              Download QR
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default QRCodeModal;
