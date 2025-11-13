import React from 'react';
import { NavLink } from 'react-router-dom';

const DropdownMenu = ({
    isOpen,
    onClose,
    onAction,
    actions,
    className = '',
}) => {
    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 z-10"
                onClick={onClose}
                aria-hidden="true"
            />
            <div
                className={`absolute right-0 top-8 bg-white border border-gray-300 rounded-md shadow-lg z-20 py-1 min-w-40 ${className}`}
                role="menu"
                aria-label="Template actions">
                {actions.map((action) => (
                    <React.Fragment key={action.key}>
                        <React.Fragment key={action.key}>
                            {action.separator && <hr className="my-1" />}

                            {action.navigation ? (
                                <NavLink
                                    to={action.navigation}
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${action.className}`}
                                    role="menuitem">
                                    <action.icon className="w-4 h-4" />
                                    {action.label}
                                </NavLink>
                            ) : (
                                <button
                                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${action.className}`}
                                    onClick={() => onAction(action.key)}
                                    role="menuitem">
                                    <action.icon className="w-4 h-4" />
                                    {action.label}
                                </button>
                            )}
                        </React.Fragment>
                    </React.Fragment>
                ))}
            </div>
        </>
    );
};

export default DropdownMenu;
