export const filterEvents = (events, filters) => {
    if (!events || !Array.isArray(events)) return [];
    
    const {
        searchTerm = '',
        statusFilter = 'All',
        proofFilter = 'All'
    } = filters;
    
    return events.filter((reg) => {
        const event = reg?.Event;
        
        // Search filter
        const matchesSearch = !searchTerm || (
            event?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event?.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event?.location?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Status filter
        const matchesStatus = statusFilter === 'All' || event?.status === statusFilter;
        
        // Proof filter
        const matchesProof = proofFilter === 'All' || 
            (proofFilter === 'Uploaded' && reg?.proof_uploaded) ||
            (proofFilter === 'Pending' && !reg?.proof_uploaded);
        
        return matchesSearch && matchesStatus && matchesProof;
    });
};

export const getStatusFilterOptions = () => [
    { value: 'All', label: 'All Status' },
    { value: 'Upcoming', label: 'Upcoming' },
    { value: 'Ongoing', label: 'Ongoing' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Cancelled', label: 'Cancelled' }
];

export const getProofFilterOptions = () => [
    { value: 'All', label: 'All Proof' },
    { value: 'Uploaded', label: 'Proof Uploaded' },
    { value: 'Pending', label: 'Proof Pending' }
];

export const getActiveFilterCount = (filters) => {
    const { searchTerm, statusFilter, proofFilter } = filters;
    let count = 0;
    
    if (searchTerm && searchTerm.trim()) count++;
    if (statusFilter !== 'All') count++;
    if (proofFilter !== 'All') count++;
    
    return count;
};
