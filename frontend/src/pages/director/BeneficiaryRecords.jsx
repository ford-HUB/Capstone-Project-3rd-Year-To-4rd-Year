import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, CheckSquare, Square, Users, Calendar, MapPin, Printer } from 'lucide-react';
import { useBeneficiaryRecordsStore } from '../../store/director/useBeneficiaryRecordsStore.js';
import { apiInstance } from '../../api/_base.js';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

const BeneficiaryRecords = () => {
    const { 
        records, 
        fetchBeneficiaryRecords,
        isLoading 
    } = useBeneficiaryRecordsStore();

    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState('');
    const [selectedBeneficiaries, setSelectedBeneficiaries] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const reportButtonRef = useRef(null);

    // Fetch events for dropdown
    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoadingEvents(true);
            try {
                const response = await apiInstance.get('/api/event/list-event');
                if (response.data.success) {
                    setEvents(response.data.list || []);
                }
            } catch (error) {
                console.error('Failed to fetch events:', error);
                toast.error('Failed to load events');
            } finally {
                setIsLoadingEvents(false);
            }
        };
        fetchEvents();
    }, []);

    // Fetch beneficiary records
    useEffect(() => {
        fetchBeneficiaryRecords(selectedEventId || null, null);
    }, [selectedEventId, fetchBeneficiaryRecords]);

    // Keyboard shortcut for Ctrl+P
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                if (reportButtonRef.current) {
                    reportButtonRef.current.click();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Filter records by search term
    const filteredRecords = records.filter(record => {
        const searchLower = searchTerm.toLowerCase();
        return (
            record.beneficiary?.firstname?.toLowerCase().includes(searchLower) ||
            record.beneficiary?.lastname?.toLowerCase().includes(searchLower) ||
            record.event?.title?.toLowerCase().includes(searchLower) ||
            record.beneficiary?.account?.email?.toLowerCase().includes(searchLower)
        );
    });

    // Handle beneficiary selection
    const toggleBeneficiarySelection = (registrationId) => {
        const newSelected = new Set(selectedBeneficiaries);
        if (newSelected.has(registrationId)) {
            newSelected.delete(registrationId);
        } else {
            newSelected.add(registrationId);
        }
        setSelectedBeneficiaries(newSelected);
    };

    const selectAll = () => {
        if (selectedBeneficiaries.size === filteredRecords.length) {
            setSelectedBeneficiaries(new Set());
        } else {
            setSelectedBeneficiaries(new Set(filteredRecords.map(r => r.event_registration_id)));
        }
    };

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format date and time
    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Generate PDF Report
    const generatePDFReport = () => {
        if (selectedBeneficiaries.size === 0) {
            toast.error('Please select at least one beneficiary to generate a report');
            return;
        }

        const selectedRecords = filteredRecords.filter(r => 
            selectedBeneficiaries.has(r.event_registration_id)
        );

        if (selectedRecords.length === 0) {
            toast.error('No beneficiaries selected');
            return;
        }

        // Group by event
        const groupedByEvent = {};
        selectedRecords.forEach(record => {
            const eventId = record.event_id;
            if (!groupedByEvent[eventId]) {
                groupedByEvent[eventId] = {
                    event: record.event,
                    beneficiaries: []
                };
            }
            groupedByEvent[eventId].beneficiaries.push(record);
        });

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const margin = 20;
        let yPosition = margin;

        // Helper function to add new page if needed
        const checkNewPage = (requiredHeight) => {
            if (yPosition + requiredHeight > pageHeight - margin) {
                pdf.addPage();
                yPosition = margin;
                return true;
            }
            return false;
        };

        // Header
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Beneficiary Records Report', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 10;

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Generated on: ${new Date().toLocaleString('en-US')}`, pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 15;

        // Process each event
        Object.values(groupedByEvent).forEach((group, eventIndex) => {
            if (eventIndex > 0) {
                checkNewPage(30);
                yPosition += 10;
            }

            const event = group.event;
            const beneficiaries = group.beneficiaries;

            // Event Details Section
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Event Details', margin, yPosition);
            yPosition += 8;

            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');
            
            const eventDetails = [
                `Event Title: ${event?.title || 'N/A'}`,
                `Location: ${event?.location || 'N/A'}`,
                `Start Date: ${formatDateTime(event?.event_started)}`,
                `End Date: ${formatDateTime(event?.event_ended)}`,
                `Description: ${event?.description || 'N/A'}`
            ];

            eventDetails.forEach(detail => {
                checkNewPage(7);
                pdf.text(detail, margin, yPosition);
                yPosition += 6;
            });

            yPosition += 5;

            // Beneficiaries List
            checkNewPage(15);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Beneficiaries (${beneficiaries.length})`, margin, yPosition);
            yPosition += 8;

            // Table Header - Adjusted column positions
            checkNewPage(10);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            const colNo = margin; // 20mm
            const colName = margin + 8; // 28mm
            const colEmail = margin + 50; // 70mm
            const colPhone = margin + 90; // 110mm
            const colDate = margin + 130; // 150mm
            
            pdf.text('No.', colNo, yPosition);
            pdf.text('Name', colName, yPosition);
            pdf.text('Email', colEmail, yPosition);
            pdf.text('Phone', colPhone, yPosition);
            pdf.text('Reg. Date', colDate, yPosition);
            yPosition += 6;

            // Draw line
            pdf.setLineWidth(0.5);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 3;

            // Beneficiaries rows
            beneficiaries.forEach((reg, index) => {
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(8);
                
                const beneficiary = reg.beneficiary;
                const name = `${beneficiary?.firstname || ''} ${beneficiary?.lastname || ''}`.trim() || 'N/A';
                const email = beneficiary?.account?.email || 'N/A';
                const phone = beneficiary?.phone_number || 'N/A';
                const regDate = formatDateTime(reg.registration_date || reg.createdAt);

                // Column widths for text wrapping (in mm)
                const nameWidth = colEmail - colName - 2; // Space between Name and Email columns
                const emailWidth = colPhone - colEmail - 2; // Space between Email and Phone columns
                const phoneWidth = colDate - colPhone - 2; // Space between Phone and Date columns
                const dateWidth = (pageWidth - margin) - colDate - 2; // Remaining space

                // Split text to fit column widths
                const nameLines = pdf.splitTextToSize(name, nameWidth);
                const emailLines = pdf.splitTextToSize(email, emailWidth);
                const phoneLines = pdf.splitTextToSize(phone, phoneWidth);
                const regDateLines = pdf.splitTextToSize(regDate, dateWidth);

                // Find the maximum number of lines needed for this row
                const maxLines = Math.max(nameLines.length, emailLines.length, phoneLines.length, regDateLines.length);
                const lineHeight = 5; // Height per line in mm
                const rowHeight = maxLines * lineHeight + 3; // Total row height + spacing

                // Check if we need a new page before starting this row
                checkNewPage(rowHeight);

                // Draw each line of the row
                for (let lineIndex = 0; lineIndex < maxLines; lineIndex++) {
                    const currentY = yPosition + (lineIndex * lineHeight);
                    
                    // Number (only on first line)
                    if (lineIndex === 0) {
                        pdf.text(`${index + 1}.`, colNo, currentY);
                    }
                    
                    // Name
                    if (nameLines[lineIndex]) {
                        pdf.text(nameLines[lineIndex], colName, currentY);
                    }
                    
                    // Email
                    if (emailLines[lineIndex]) {
                        pdf.text(emailLines[lineIndex], colEmail, currentY);
                    }
                    
                    // Phone
                    if (phoneLines[lineIndex]) {
                        pdf.text(phoneLines[lineIndex], colPhone, currentY);
                    }
                    
                    // Registration Date
                    if (regDateLines[lineIndex]) {
                        pdf.text(regDateLines[lineIndex], colDate, currentY);
                    }
                }
                
                // Move to next row position
                yPosition += rowHeight;
            });

            yPosition += 5;
        });

        // Footer
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'italic');
            pdf.text(
                `Page ${i} of ${totalPages}`,
                pageWidth / 2,
                pageHeight - 10,
                { align: 'center' }
            );
        }

        // Save PDF
        const fileName = `Beneficiary_Records_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
        toast.success('PDF report generated successfully');
    };

    const selectedCount = selectedBeneficiaries.size;
    const totalCount = filteredRecords.length;

    return (
        <div className="p-6 h-screen bg-gray-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Beneficiary Records</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            View and manage beneficiary event registrations
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            ref={reportButtonRef}
                            onClick={generatePDFReport}
                            disabled={selectedCount === 0}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                            Generate Report ({selectedCount})
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                        <select
                            value={selectedEventId}
                            onChange={(e) => {
                                setSelectedEventId(e.target.value);
                                setSelectedBeneficiaries(new Set());
                            }}
                            disabled={isLoadingEvents}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                            <option value="">All Events</option>
                            {events.map(event => (
                                <option key={event.event_id} value={event.event_id}>
                                    {event.title} - {formatDate(event.event_started)}
                                </option>
                            ))}
                        </select>
                        <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search beneficiaries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                </div>

                {/* Selection Info */}
                {totalCount > 0 && (
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={selectAll}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                                {selectedCount === totalCount ? (
                                    <>
                                        <CheckSquare className="w-4 h-4" />
                                        Deselect All
                                    </>
                                ) : (
                                    <>
                                        <Square className="w-4 h-4" />
                                        Select All ({totalCount})
                                    </>
                                )}
                            </button>
                        </div>
                        <p className="text-sm text-gray-600">
                            {selectedCount} of {totalCount} selected
                        </p>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left border-b border-gray-200 bg-gray-50">
                                <th className="pb-3 px-4 font-semibold text-gray-600 w-12">
                                    <input
                                        type="checkbox"
                                        checked={selectedCount === totalCount && totalCount > 0}
                                        onChange={selectAll}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                </th>
                                <th className="pb-3 px-4 font-semibold text-gray-600">Beneficiary</th>
                                <th className="pb-3 px-4 font-semibold text-gray-600">Event</th>
                                <th className="pb-3 px-4 font-semibold text-gray-600">Registration Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center">
                                        <div className="flex justify-center">
                                            <span className="loading loading-spinner loading-md"></span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredRecords.length > 0 ? (
                                filteredRecords.map((record) => (
                                    <tr 
                                        key={record.event_registration_id} 
                                        className="border-b border-gray-100 hover:bg-gray-50"
                                    >
                                        <td className="py-4 px-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedBeneficiaries.has(record.event_registration_id)}
                                                onChange={() => toggleBeneficiarySelection(record.event_registration_id)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            />
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600 font-medium text-sm">
                                                        {record.beneficiary?.firstname?.[0]}{record.beneficiary?.lastname?.[0]}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {record.beneficiary?.firstname} {record.beneficiary?.lastname}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {record.beneficiary?.account?.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {record.event?.title}
                                                </p>
                                                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(record.event?.event_started)}
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <MapPin className="w-4 h-4" />
                                                    {record.event?.location}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">
                                            {formatDateTime(record.registration_date || record.createdAt)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <Users className="w-12 h-12 text-gray-300" />
                                            <p className="text-lg font-medium">No records found</p>
                                            <p className="text-sm">
                                                {searchTerm || selectedEventId 
                                                    ? 'Try adjusting your search or filter criteria'
                                                    : 'No beneficiary records available'
                                                }
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BeneficiaryRecords;

