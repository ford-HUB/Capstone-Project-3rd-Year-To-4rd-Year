import React, { useState } from 'react';
import { CircleX } from 'lucide-react';

const PaymentFields = ({ open, setOpen, onComplete }) => {
  const [formData, setFormData] = useState({
    gcash: '',
    paypal: '',
    mastercard: '',
    maya: '',
    visa: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl flex flex-col">
        {/* Header */}
        <header className="flex flex-col sticky top-0">
          <div className="inline-flex items-center justify-between mb-4">
            <h1 className="font-semibold text-2xl">Edit Payment Methods</h1>
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              <CircleX className="relative top-0 h-10 w-10 cursor-pointer" />
            </button>
          </div>
          <span className="text-sm text-gray-500">
            Update your payment details to keep your profile ready for transactions.
          </span>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="gcash">GCash Number</label>
              <input
                type="text"
                name="gcash"
                placeholder="+639XXXXXXXXX"
                value={formData.gcash}
                onChange={handleChange}
                className="input w-full"
              />
              <p className="text-xs text-gray-500">Must start with +639 and be 13 digits long.</p>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="paypal">PayPal Email</label>
              <input
                type="email"
                name="paypal"
                placeholder="you@example.com"
                value={formData.paypal}
                onChange={handleChange}
                className="input w-full"
              />
              <p className="text-xs text-gray-500">Use your verified PayPal email address.</p>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="mastercard">Mastercard Number</label>
              <input
                type="text"
                name="mastercard"
                placeholder="####-####-####-####"
                value={formData.mastercard}
                onChange={handleChange}
                className="input w-full"
              />
              <p className="text-xs text-gray-500">Enter a 16-digit Mastercard starting with 5 or 2.</p>
            </div>

            {/* Maya */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="maya">Maya Number</label>
              <input
                type="text"
                name="maya"
                placeholder="+639XXXXXXXXX"
                value={formData.maya}
                onChange={handleChange}
                className="input w-full"
              />
              <p className="text-xs text-gray-500">Must start with +639 and be 13 digits long.</p>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="visa">Visa Card Number</label>
              <input
                type="text"
                name="visa"
                placeholder="####-####-####-####"
                value={formData.visa}
                onChange={handleChange}
                className="input w-full"
              />
              <p className="text-xs text-gray-500">Visa card numbers are 16 digits and start with 4.</p>
            </div>
          </div>

          <div className="action flex justify-end items-center mt-6 space-x-2.5">
            <button
              onClick={() => setOpen(false)}
              className="btn text-gray-700 bg-gray-100 rounded-xl"
            >
              Close
            </button>
            <button
              onClick={handleSubmit}
              className="btn bg-blue-700 text-white rounded-xl"
            >
              Save Changes
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentFields;
