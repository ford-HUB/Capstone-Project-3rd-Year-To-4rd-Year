import React, { useState, useEffect, useRef } from 'react';
import { Search, Filter, CheckSquare, Square, Users, Calendar, MapPin, Printer } from 'lucide-react';
import { useBeneficiaryRecordsStore } from '../../store/director/useBeneficiaryRecordsStore.js';
import { useEventStore } from '../../store/director/useEventStore.js';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import { formatDate, formatDateTime } from '../../utils/dateUtils.js';
import { asset } from '../../assets/asset.jsx';
import MultiEventReportConfirmationModal from '../../components/modal/v2/director/MultiEventReportConfirmationModal.jsx';
import { logReportGeneration } from '../../services/director/manageBeneficiaryService.js';

const BeneficiaryRecords = () => {
    const { 
        records, 
        fetchBeneficiaryRecords,
        isLoading 
    } = useBeneficiaryRecordsStore();

    const {
        events,
        fetchAllEvents,
        isLoading: isLoadingEvents
    } = useEventStore();

    const [selectedEventId, setSelectedEventId] = useState('');
    const [selectedBeneficiaries, setSelectedBeneficiaries] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [showMultiEventModal, setShowMultiEventModal] = useState(false);
    const [pendingGroupedByEvent, setPendingGroupedByEvent] = useState(null);
    const reportButtonRef = useRef(null);

    // Fetch events for dropdown
    useEffect(() => {
        fetchAllEvents();
    }, [fetchAllEvents]);

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


    // Helper function to convert image to base64
    const getImageBase64 = (imagePath) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                try {
                    const base64 = canvas.toDataURL('image/png');
                    resolve(base64);
                } catch (error) {
                    reject(error);
                }
            };
            img.onerror = () => resolve(null); // Return null on error instead of rejecting
            img.src = imagePath;
        });
    };

    // Helper function to load event image
    const getEventImageBase64 = (imageUrl) => {
        if (!imageUrl) return null;
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                try {
                    const base64 = canvas.toDataURL('image/jpeg');
                    resolve(base64);
                } catch (error) {
                    resolve(null);
                }
            };
            img.onerror = () => resolve(null);
            img.src = imageUrl;
        });
    };

    // Generate a single PDF for one event
    const generateSingleEventPDF = async (event, beneficiaries, logos) => {
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

        // Header with logos
        const headerHeight = 25;
        const logoSize = 15; // mm
        const logoY = yPosition;
        
        // Left logo (UCLMCARES)
        if (logos.uclmCaresLogo) {
            try {
                pdf.addImage(logos.uclmCaresLogo, 'PNG', margin, logoY, logoSize, logoSize);
            } catch (error) {
                console.error('Failed to add UCLMCARES logo:', error);
            }
        }

        // Center title and date
        pdf.setFontSize(18);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Beneficiary Records Report', pageWidth / 2, logoY + 8, { align: 'center' });
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const generatedDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        pdf.text(`Generated on: ${generatedDate}`, pageWidth / 2, logoY + 14, { align: 'center' });

        // Right logo (UC Logo)
        if (logos.uclmLogo) {
            try {
                pdf.addImage(logos.uclmLogo, 'PNG', pageWidth - margin - logoSize, logoY, logoSize, logoSize);
            } catch (error) {
                console.error('Failed to add UC logo:', error);
            }
        }

        // Draw line under header
        yPosition = logoY + headerHeight;
        pdf.setLineWidth(0.5);
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;

        // Section I: Event Details
        checkNewPage(20);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('I. Event Details', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        const startDate = event?.event_started ? formatDate(event.event_started) : 'N/A';
        const endDate = event?.event_ended ? formatDate(event.event_ended) : 'N/A';
        
        const eventDetails = [
            `Event Title: ${event?.title || 'N/A'}`,
            `Location: ${event?.location || 'N/A'}`,
            `Start Date: ${startDate}`,
            `End Date: ${endDate}`,
            `Description: ${event?.description || 'N/A'}`
        ];

        eventDetails.forEach(detail => {
            checkNewPage(7);
            pdf.text(detail, margin, yPosition);
            yPosition += 6;
        });

        yPosition += 8;

        // Separate beneficiaries into individuals and organizations
        const individualBeneficiaries = beneficiaries.filter(reg => 
            !reg.beneficiary?.organization_name || reg.beneficiary.organization_name.trim() === ''
        );
        const organizationBeneficiaries = beneficiaries.filter(reg => 
            reg.beneficiary?.organization_name && reg.beneficiary.organization_name.trim() !== ''
        );

        // Section II: Beneficiary Information (Individuals)
        if (individualBeneficiaries.length > 0) {
            checkNewPage(25);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('II. Beneficiary Information (Individuals)', margin, yPosition);
            yPosition += 8;

            // Table Header
            checkNewPage(10);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            const colNo = margin;
            const colName = margin + 10;
            const colEmail = margin + 55;
            const colPhone = margin + 95;
            const colDate = margin + 135;
            
            pdf.text('No.', colNo, yPosition);
            pdf.text('Full Name', colName, yPosition);
            pdf.text('Email Address', colEmail, yPosition);
            pdf.text('Contact Number', colPhone, yPosition);
            pdf.text('Registration Date', colDate, yPosition);
            yPosition += 6;

            // Draw line
            pdf.setLineWidth(0.5);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 3;

            // Individual beneficiaries rows
            individualBeneficiaries.forEach((reg, index) => {
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(8);
                
                const beneficiary = reg.beneficiary;
                const name = `${beneficiary?.firstname || ''} ${beneficiary?.lastname || ''}`.trim() || 'N/A';
                const email = beneficiary?.account?.email || 'N/A';
                const phone = beneficiary?.phone_number || 'N/A';
                const regDate = reg.registration_date || reg.createdAt;
                const formattedDate = regDate ? formatDate(regDate) : 'N/A';

                // Column widths for text wrapping (in mm)
                const nameWidth = colEmail - colName - 2;
                const emailWidth = colPhone - colEmail - 2;
                const phoneWidth = colDate - colPhone - 2;
                const dateWidth = (pageWidth - margin) - colDate - 2;

                // Split text to fit column widths
                const nameLines = pdf.splitTextToSize(name, nameWidth);
                const emailLines = pdf.splitTextToSize(email, emailWidth);
                const phoneLines = pdf.splitTextToSize(phone, phoneWidth);
                const dateLines = pdf.splitTextToSize(formattedDate, dateWidth);

                // Find the maximum number of lines needed for this row
                const maxLines = Math.max(nameLines.length, emailLines.length, phoneLines.length, dateLines.length);
                const lineHeight = 5;
                const rowHeight = maxLines * lineHeight + 3;

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
                    if (dateLines[lineIndex]) {
                        pdf.text(dateLines[lineIndex], colDate, currentY);
                    }
                }
                
                // Move to next row position
                yPosition += rowHeight;
            });

            yPosition += 8;
        }

        // Section III: Beneficiary Information (Organizations)
        if (organizationBeneficiaries.length > 0) {
            checkNewPage(25);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('III. Beneficiary Information (Organizations)', margin, yPosition);
            yPosition += 8;

            // Table Header
            checkNewPage(10);
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'bold');
            const colNo = margin;
            const colName = margin + 10;
            const colEmail = margin + 55;
            const colPhone = margin + 95;
            const colDate = margin + 135;
            
            pdf.text('No.', colNo, yPosition);
            pdf.text('Full Name', colName, yPosition);
            pdf.text('Email Address', colEmail, yPosition);
            pdf.text('Contact Number', colPhone, yPosition);
            pdf.text('Registration Date', colDate, yPosition);
            yPosition += 6;

            // Draw line
            pdf.setLineWidth(0.5);
            pdf.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 3;

            // Organization beneficiaries rows
            organizationBeneficiaries.forEach((reg, index) => {
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(8);
                
                const beneficiary = reg.beneficiary;
                const orgName = beneficiary?.organization_name || 'N/A';
                const name = `${beneficiary?.firstname || ''} ${beneficiary?.lastname || ''}`.trim() || 'N/A';
                const fullName = `${name} (${orgName})`;
                const email = beneficiary?.account?.email || 'N/A';
                const phone = beneficiary?.phone_number || 'N/A';
                const regDate = reg.registration_date || reg.createdAt;
                const formattedDate = regDate ? formatDate(regDate) : 'N/A';

                // Column widths for text wrapping (in mm)
                const nameWidth = colEmail - colName - 2;
                const emailWidth = colPhone - colEmail - 2;
                const phoneWidth = colDate - colPhone - 2;
                const dateWidth = (pageWidth - margin) - colDate - 2;

                // Split text to fit column widths
                const nameLines = pdf.splitTextToSize(fullName, nameWidth);
                const emailLines = pdf.splitTextToSize(email, emailWidth);
                const phoneLines = pdf.splitTextToSize(phone, phoneWidth);
                const dateLines = pdf.splitTextToSize(formattedDate, dateWidth);

                // Find the maximum number of lines needed for this row
                const maxLines = Math.max(nameLines.length, emailLines.length, phoneLines.length, dateLines.length);
                const lineHeight = 5;
                const rowHeight = maxLines * lineHeight + 3;

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
                    if (dateLines[lineIndex]) {
                        pdf.text(dateLines[lineIndex], colDate, currentY);
                    }
                }
                
                // Move to next row position
                yPosition += rowHeight;
            });

            yPosition += 8;
        }

        // Section III: Supporting Documentation
        if (event?.event_image) {
            checkNewPage(60);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.text('III. Supporting Documentation', margin, yPosition);
            yPosition += 8;

            // Load event image
            const eventImageBase64 = await getEventImageBase64(event.event_image);
            
            if (eventImageBase64) {
                try {
                    // Calculate image dimensions to fit page width
                    const maxImageWidth = pageWidth - (margin * 2);
                    const maxImageHeight = 50; // mm
                    
                    // Add image
                    pdf.addImage(eventImageBase64, 'JPEG', margin, yPosition, maxImageWidth, maxImageHeight);
                    yPosition += maxImageHeight + 5;
                    
                    // Add caption
                    pdf.setFontSize(9);
                    pdf.setFont('helvetica', 'italic');
                    pdf.text('Figure 1: Event Venue & Participants', margin, yPosition);
                    yPosition += 8;
                } catch (error) {
                    console.error('Failed to add event image:', error);
                }
            }
        }

        // Section IV: Concluding Remarks
        checkNewPage(40);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('IV. Concluding Remarks', margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        // Build concluding remarks
        let remarks = `This report documents the beneficiary records for the event "${event?.title || 'N/A'}" held on ${startDate}${endDate !== startDate ? ` to ${endDate}` : ''} at ${event?.location || 'N/A'}. `;
        
        remarks += `A total of ${beneficiaries.length} beneficiary(ies) ${beneficiaries.length === 1 ? 'was' : 'were'} registered for this event. `;
        
        if (individualBeneficiaries.length > 0 && organizationBeneficiaries.length > 0) {
            remarks += `This includes ${individualBeneficiaries.length} individual(s) and ${organizationBeneficiaries.length} organization(s). `;
        } else if (individualBeneficiaries.length > 0) {
            remarks += `All beneficiaries are individuals. `;
        } else if (organizationBeneficiaries.length > 0) {
            remarks += `All beneficiaries are organizations. `;
        }

        // Add donation information
        const donations = [];
        if (event?.funds_donation) {
            donations.push('monetary donations');
        }
        if (event?.goods_donation) {
            donations.push('goods donations');
        }

        if (donations.length > 0) {
            remarks += `The beneficiaries listed in this report have contributed through ${donations.join(' and ')}. `;
            remarks += `These contributions have been received and documented as part of the event's donation tracking system. `;
        }

        remarks += `This report serves as an official record of all registered beneficiaries and their participation in the aforementioned event.`;

        // Split remarks into multiple lines
        const remarksLines = pdf.splitTextToSize(remarks, pageWidth - (margin * 2));
        remarksLines.forEach(line => {
            checkNewPage(6);
            pdf.text(line, margin, yPosition);
            yPosition += 6;
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

        // Generate safe filename
        const safeEventTitle = (event?.title || 'Event').replace(/[^a-z0-9]/gi, '_').substring(0, 30);
        const fileName = `Beneficiary_Records_${safeEventTitle}_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
    };

    // Generate PDF Report
    const generatePDFReport = async () => {
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

        // Check if beneficiaries are from multiple events
        const eventCount = Object.keys(groupedByEvent).length;
        
        if (eventCount > 1) {
            // Show confirmation modal for multiple events
            setPendingGroupedByEvent(groupedByEvent);
            setShowMultiEventModal(true);
            return;
        }

        // Single event - generate directly
        const event = Object.values(groupedByEvent)[0].event;
        const beneficiaries = Object.values(groupedByEvent)[0].beneficiaries;

        // Load images
        const [uclmCaresLogo, uclmLogo] = await Promise.all([
            getImageBase64(asset.logo),
            getImageBase64(asset.uclmLogo)
        ]);

        await generateSingleEventPDF(event, beneficiaries, { uclmCaresLogo, uclmLogo });
        
        // Log report generation activity
        await logReportGeneration('beneficiary', {
            eventTitle: event.title,
            recordCount: beneficiaries.length,
            eventCount: 1
        });
        
        toast.success('PDF report generated successfully');
    };

    // Handle confirmation from modal - generate separate PDFs
    const handleConfirmMultiEventReport = async () => {
        if (!pendingGroupedByEvent) return;

        // Load images once
        const [uclmCaresLogo, uclmLogo] = await Promise.all([
            getImageBase64(asset.logo),
            getImageBase64(asset.uclmLogo)
        ]);

        const logos = { uclmCaresLogo, uclmLogo };
        const eventEntries = Object.entries(pendingGroupedByEvent);
        
        // Generate PDF for each event
        for (const [eventId, group] of eventEntries) {
            await generateSingleEventPDF(group.event, group.beneficiaries, logos);
            // Small delay between downloads to avoid browser blocking
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        // Log report generation activity for multiple events
        await logReportGeneration('beneficiary', {
            eventCount: eventEntries.length,
            recordCount: Object.values(pendingGroupedByEvent).reduce((sum, group) => sum + group.beneficiaries.length, 0)
        });
        
        toast.success(`Successfully generated ${eventEntries.length} PDF report(s)`);
        setPendingGroupedByEvent(null);
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

            {/* Multi-Event Confirmation Modal */}
            <MultiEventReportConfirmationModal
                open={showMultiEventModal}
                setOpen={setShowMultiEventModal}
                groupedByEvent={pendingGroupedByEvent || {}}
                onConfirm={handleConfirmMultiEventReport}
                onCancel={() => {
                    setPendingGroupedByEvent(null);
                }}
            />
        </div>
    );
};

export default BeneficiaryRecords;

