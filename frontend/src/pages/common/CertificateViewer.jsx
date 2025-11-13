import React from 'react';
import { Download } from 'lucide-react';
import { GetFirstLetter } from '../../utils/GetFirstLetter.js';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

const CertificateViewer = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const queryData = {
        cert_title: searchParams.get('title'),
        certId: searchParams.get('certId'),
        preview_url: searchParams.get('preview_url'),
        downloadable: searchParams.get('downloadable'),
        issued_at: searchParams.get('issued_at'),
        series_id: searchParams.get('series_id'),
        organizer: searchParams.get('organizer')
    }

    React.useEffect(() => {
        console.log(queryData)
    }, [])


    return (
        <div className="min-h-screen bg-gray-50 p-6 lg:p-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 relative">
                    <div className="bg-white border-2 rounded-md border-gray-300 p-8 relative shadow-lg">
                        <img
                            src={queryData.preview_url}
                            alt={`altribute image${queryData.preview_url}`}
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6 bg-white border border-gray-300 rounded-md p-6">
                    <div className='flex border-b border-gray-300 pb-4'>
                        <h1 className='text-2xl font-semibold'>Certificate Details</h1>
                    </div>
                    <div className="bg-white rounded-lg">
                        <h3 className="font-semibold text-xl text-gray-800 mb-2">
                            Issue Date
                        </h3>
                        <p className="text-gray-600">{dayjs(queryData.issued_at).format(`DD MMMM YYYY`)}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-xl text-gray-800 mb-2">
                            Participated Event
                        </h3>
                        <p className="text-gray-700">{queryData.cert_title}</p>
                    </div>

                    <div className='flex-col items-center pb-16'>
                        <h3 className="font-semibold text-xl text-gray-800 mb-4">
                            Organizer
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-xs font-semibold text-gray-600">
                                    {GetFirstLetter(queryData.organizer)}
                                </span>
                            </div>
                            <span className="text-gray-700">{queryData.organizer}</span>
                        </div>
                    </div>
                    <a
                        href={`${queryData.downloadable}?download=${queryData.cert_title}_certificate.pdf`}
                        download={`${queryData.cert_title}_certificate.pdf`}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors">
                        <Download size={20} />
                        Download PDF
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CertificateViewer;
