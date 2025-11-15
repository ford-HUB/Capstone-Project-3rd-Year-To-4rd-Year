import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, RefreshCcw, X } from 'lucide-react';
import QrCodeInstruction from '../../../components/common/scanner/QrCodeInstruction';
import { useScanQRAttendanceStore } from '../../../store/common/useScanQRAttendanceStore';
import { useAuthStore } from '../../../store/participant/useAuthStore.js';
import { useBeneficiaryAuthStore } from '../../../store/beneficiary/useBeneficiaryAuthStore.js';
import CustomToast from '../../../components/toast/attendance/CustomToast';
import { useProfileStore } from '../../../store/participant/useProfileStore.js';
import VolunteerCertificateReminderModal from '../../../components/modal/v2/reminder/VolunteerCertificateReminderModal.jsx';
import '../../../styles/videoSize.css';


const QRScanner = () => {
    const navigate = useNavigate();
    const [isScanning, setIsScanning] = useState(false);
    const [scannedData, setScannedData] = useState('');
    const [error, setError] = useState('');
    const [cameraMode, setCameraMode] = useState('environment');

    const { authenticatedUser, checkAuth } = useAuthStore()

    const scannerRef = useRef(null);
    const containerId = 'qr-scanner-container';

    const { scanQrTrigger, message } = useScanQRAttendanceStore()
    const { currentProfileInfo } = useProfileStore()

    const [showCertificateReminderModal, setShowCertificateReminderModal] = React.useState({
        open: false,
        eventData: null
    })


    const startScanning = async () => {
        if (isScanning) return;
        setError('');
        setScannedData('');

        try {
            if (scannerRef.current) {
                await scannerRef.current.stop().catch(() => {});
                await scannerRef.current.clear().catch(() => {});
                scannerRef.current = null;
            }

            scannerRef.current = new Html5Qrcode(containerId);

            await scannerRef.current.start(
                { facingMode: cameraMode },
                { fps: 10, qrbox: 250 },
                async (decodedText) => {
                    setScannedData(decodedText);
                    stopScanning();
                    if (decodedText.startsWith('/api/attendance/scanQr/attendance?')) { // validating the api endpoint
                       try {
                           // Verify authentication before scanning
                           const isAuthenticated = await checkAuth()
                           if (!isAuthenticated) {
                               toast.error('Your session has expired. Please log in again.')
                               setTimeout(() => {
                                   navigate('/login')
                               }, 2000)
                               return
                           }
                           
                           // Small delay to ensure auth state is updated
                           await new Promise(resolve => setTimeout(resolve, 100))
                           
                           const response = await scanQrTrigger(decodedText)
                           if(!response || !response.success) {
                               const errorMsg = response?.message || 'Failed to scan QR code. Please try again.'
                               
                               // Handle authentication required - check for 401 or auth-related errors
                               if (response?.requiresAuth || 
                                   errorMsg.toLowerCase().includes('session') || 
                                   errorMsg.toLowerCase().includes('expired') || 
                                   errorMsg.toLowerCase().includes('unauthorized') ||
                                   errorMsg.toLowerCase().includes('401')) {
                                   toast.error('Your session has expired. Please log in again.', {
                                       duration: 5000
                                   })
                                   // Redirect to login - checkAuth will clear auth state
                                   setTimeout(() => {
                                       navigate('/login')
                                   }, 2000)
                                   return
                               }
                               
                               return toast.error(errorMsg)
                           }
                           toast.custom((t) => (
                            <CustomToast t={t} message={response.message} userData={currentProfileInfo} eventDetails={response.eventDetails} />
                           ))

                            setTimeout(() => {
                                if(response.eventDetails && response.eventDetails.status === 'Completed' && authenticatedUser?.Role?.name === 'student' || response.eventDetails.status === 'Completed' && authenticatedUser?.Role?.name === 'beneficiary')
                                {
                                    // Show certificate requirements reminder modal after attendance timeout
                                    setShowCertificateReminderModal({ open: true, eventData: response.eventDetails })
                                }
                            }, 8000)
                       } catch (error) {
                           console.error('Error processing QR scan:', error)
                           if (error.response?.status === 401 || error.message?.includes('401')) {
                               toast.error('Your session has expired. Please log in again.')
                               setTimeout(() => {
                                   navigate('/login')
                               }, 2000)
                               return
                           }
                           toast.error('Failed to process QR code. Please try again.')
                       }
                    } else {
                        toast.error('Invalid QR code format. Please scan a valid attendance QR code.')
                    }
                },
                () => {}
            );

            setIsScanning(true);
        } catch (err) {
            console.error('Camera error:', err);
            setError(
                'Failed to access camera. Please allow camera permissions.'
            );
        }
    };

    const stopScanning = async () => {
        if (!scannerRef.current) return;
        try {
            await scannerRef.current.stop();
            await scannerRef.current.clear();
        } catch (err) {
            console.error('Error stopping scanner:', err);
        } finally {
            scannerRef.current = null;
            setIsScanning(false);
        }
    };

    const toggleCamera = async () => {
        // await stopScanning()
        setCameraMode((prev) =>
            prev === 'environment' ? 'user' : 'environment'
        )
        startScanning();
    };

    useEffect(() => {
        return () => stopScanning();
    }, []);

    return (
        <div className='flex justify-evenly bg-white'>
            <div className="min-h-screen bg-white text-gray-50 flex flex-col items-center p-12">
                <h1 className="text-2xl font-bold mb-2 text-black">
                    Scan your QR Code
                </h1>
                <p className="text-gray-600 mb-6">
                    Using {cameraMode === 'environment' ? 'Back' : 'Front'}{' '}
                    Camera
                </p>

                <div className="relative w-80 h-80 mx-auto rounded-2xl overflow-hidden bg-gray-900">
                    <div
                        id={containerId}
                        className={`w-full h-full ${
                            cameraMode === 'user' ? 'scale-x-[-1]' : ''
                        }`}
                        style={{ backgroundColor: '#000' }}></div>
                    {!isScanning && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 pointer-events-none">
                            <Camera className="w-20 h-20 mb-2" />
                            <p>Camera preview will appear here</p>
                        </div>
                    )}
                </div>

                {error && (
                    <div className="text-red-400 text-sm bg-red-900/30 p-4 rounded-xl mt-4 text-center">
                        {error}
                    </div>
                )}

                <div className="flex flex-col space-y-3 mt-6 w-full max-w-sm">
                    <button
                        onClick={startScanning}
                        disabled={isScanning}
                        className={`w-full flex items-center justify-center space-x-2 font-semibold py-3 px-6 rounded-xl ${
                            isScanning
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-green-500 hover:bg-green-600'
                        }`}>
                        <Camera className="w-5 h-5" />
                        <span>{isScanning ? 'Scanning...' : 'Start Scan'}</span>
                    </button>

                    {isScanning && (
                        <button
                            onClick={stopScanning}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center space-x-2">
                            <X className="w-5 h-5" />
                            <span>Stop Scan</span>
                        </button>
                    )}

                    <button
                        onClick={toggleCamera}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center space-x-2">
                        <RefreshCcw className="w-5 h-5" />
                        <span>
                            Switch to{' '}
                            {cameraMode === 'environment' ? 'Front' : 'Back'}{' '}
                            Camera
                        </span>
                    </button>
                </div>

                {/* {scannedData && (
                    <div className="mt-8 w-full max-w-sm">
                    <h3 className="font-semibold text-gray-300 mb-3 text-center">
                        Last Scanned Result: 
                    </h3>
                    <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 text-center">
                        <p className="text-sm text-green-400 break-all">{scannedData}</p>
                    </div>
                    </div>
                )} */}
            </div>
            <div className='flex items-center h-screen'>
                <QrCodeInstruction />
            </div>
            <VolunteerCertificateReminderModal
                open={showCertificateReminderModal.open}
                setOpen={() => setShowCertificateReminderModal(prev => ({...prev, open: false }))}
                eventData={showCertificateReminderModal.eventData}
            />
                
        </div>
    );
};

export default QRScanner;
