import React from 'react';

const TicketCard = ({ ticket, isSelected, onSelect }) => (
    <div
      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-purple-500 bg-purple-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <input
            type="radio"
            name="ticketType"
            value={ticket.id}
            checked={isSelected}
            onChange={() => {}}
            className="mr-3 text-purple-600"
          />
          <div>
            <h4 className="font-semibold text-gray-800">{ticket.name}</h4>
            <ul className="text-xs text-gray-600 mt-1 space-y-1">
              {ticket.features.map((feature, idx) => (
                <li key={idx}>• {feature}</li>
              ))}
            </ul>
          </div>
        </div>
        <span className="font-bold text-purple-600 text-lg">{ticket.price}</span>
      </div>
    </div>
);

export default TicketCard