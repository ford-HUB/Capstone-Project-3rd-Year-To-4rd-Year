import React from 'react';
import { Search } from 'lucide-react';
import CertificateCard from '../../components/common/certificate/cards/CertificateCard';
import { useCertificateStore } from '../../store/common/useCertificateStore.js';

const CertificatePage = () => {
    const { certificateData, getCertificates } = useCertificateStore();

    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortOption, setSortOption] = React.useState("Latest");

    React.useEffect(() => {
        if (certificateData.length > 0) return;

        const fetchData = async () => {
            await getCertificates();
        };
        fetchData();
    }, [certificateData?.length]);

    console.log('debugging data if naa', certificateData);

    // Filtering
    const filteredCertificateData = certificateData.filter((cert) => {
        const query = searchQuery.toLowerCase();
        return (
            cert.title?.toLowerCase().includes(query) ||
            cert.organizer?.toLowerCase().includes(query) ||
            cert.event?.toLowerCase().includes(query)
        );
    });

    // Sorting
    const sortedCertificates = [...filteredCertificateData].sort((a, b) => {
        switch (sortOption) {
            case "Latest":
                return new Date(b.issued_at) - new Date(a.issued_at);
            case "Oldest":
                return new Date(a.issued_at) - new Date(b.issued_at);
            case "A-Z":
                return a.title.localeCompare(b.title);
            case "Z-A":
                return b.title.localeCompare(a.title);
            default:
                return 0;
        }
    });

    return (
        <div className="flex-col w-full space-y-6 p-2 bg-white">
            <header className="flex items-center justify-between w-full">
                <div className="flex items-center">
                    <input
                        className="input border px-3 py-2 rounded-md"
                        type="text"
                        placeholder="Search by name, event"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="btn ml-2">
                        <Search className="text-gray-600" />
                    </button>
                </div>

                <div className="flex items-center space-x-1.5">
                    <label htmlFor="Sort">Sort</label>
                    <select
                        className="border select border-gray-300 py-2 rounded-md"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                    >
                        <option>Latest</option>
                        <option>Oldest</option>
                        <option>A-Z</option>
                        <option>Z-A</option>
                    </select>
                </div>
            </header>

            <main className="grid grid-cols-4 gap-2 pb-12">
                {sortedCertificates.length > 0 ? (
                    sortedCertificates.map((cert) => (
                        <CertificateCard key={cert.id} certificateData={cert} />
                    ))
                ) : (
                    <p className="col-span-4 text-center text-gray-500">
                        No certificates found.
                    </p>
                )}
            </main>
        </div>
    );
};

export default CertificatePage;
