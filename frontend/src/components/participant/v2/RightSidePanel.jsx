import React from 'react';
import RowAssignment from '../../common/RowAssignment';
import { Award } from 'lucide-react';

const RightSidePanel = () => {
    const assignments = [
        {
            dueDate: '15 Oct 2025 11:59 PM',
            title: 'Module 2: Module Exam',
            description:
                'Introduction to IoT and Digital Transformation (44704 - IT-ELECT3)',
        },
        {
            dueDate: '15 Oct 2025 11:59 PM',
            title: 'Module 2: Everything Becomes Programmable',
            description:
                'Introduction to IoT and Digital Transformation (44704 - IT-ELECT3)',
        },
        {
            dueDate: '15 Oct 2025 11:59 PM',
            title: 'Module 5: Everything Needs to be Secured',
            description:
                'Introduction to IoT and Digital Transformation (44704 - IT-ELECT3)',
        },
        {
            dueDate: '15 Oct 2025 11:59 PM',
            title: 'Module 5: Everything Needs to be Secured',
            description:
                'Introduction to IoT and Digital Transformation (44704 - IT-ELECT3)',
        },
        {
            dueDate: '15 Oct 2025 11:59 PM',
            title: 'Module 5: Everything Needs to be Secured',
            description:
                'Introduction to IoT and Digital Transformation (44704 - IT-ELECT3)',
        },
        {
            dueDate: '15 Oct 2025 11:59 PM',
            title: 'Module 5: Everything Needs to be Secured',
            description:
                'Introduction to IoT and Digital Transformation (44704 - IT-ELECT3)',
        },
        {
            dueDate: '15 Oct 2025 11:59 PM',
            title: 'Module 5: Everything Needs to be Secured',
            description:
                'Introduction to IoT and Digital Transformation (44704 - IT-ELECT3)',
        },
    ];

    return (
        <div className="w-full bg-white">
            <div className='p-4'>
                <div className="flex-1 h-auto space-y-4">
                    {assignments.map((assignment, index) => (
                        <RowAssignment
                            key={index}
                            {...assignment}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RightSidePanel;
