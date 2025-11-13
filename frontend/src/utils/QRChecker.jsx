import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useScanQRAttendanceStore } from '../store/common/useScanQRAttendanceStore.js';
import toast from 'react-hot-toast';

const QRChecker = ({ children }) => {
  const { scanQrTrigger } = useScanQRAttendanceStore();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    const query = {
      type: searchParams.get('type'),
      eventId: searchParams.get('eventId'),
      token: searchParams.get('token'),
    };

    if (!query.type || !query.eventId || !query.token) return

    // Trigger QR scan / attendance check
    const checkAttendance = async () => {
      const success = await scanQrTrigger(query.type, query.eventId, query.token);
      if (!success) {
        toast.error('Attendance scan failed or invalid QR code');
      } else {
        toast.success('Attendance recorded successfully!');
      }
    };

    checkAttendance();
  }, [searchParams, scanQrTrigger]);

  return <>{children}</>;
};

export default QRChecker;
