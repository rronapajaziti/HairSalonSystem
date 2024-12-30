import React, { useState } from 'react';
import axios from 'axios';

const WhatsAppForm = () => {
  const [message, setMessage] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    setSending(true);
    const payload = {
      phoneNumber, // Recipient phone number
      message, // Message content
    };

    try {
      // Replace this URL with your backend API
      const response = await axios.post(
        'http://localhost:5000/api/whatsapp/send-message',
        payload,
      );
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send the message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h1 className="text-2xl font-bold text-blue-600 mb-4 text-center">
        Send WhatsApp Message
      </h1>

      {/* Phone Number Input */}
      <label className="block text-gray-700 font-medium mb-2">
        Phone Number
      </label>
      <input
        type="text"
        placeholder="+1234567890"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-300"
      />

      {/* Message Input */}
      <label className="block text-gray-700 font-medium mb-2">Message</label>
      <textarea
        placeholder="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring focus:ring-blue-300"
        rows={4}
      ></textarea>

      {/* Send Button */}
      <button
        onClick={handleSendMessage}
        disabled={sending || !message || !phoneNumber}
        className={`w-full mt-4 px-4 py-2 text-white font-bold rounded-md ${
          sending || !message || !phoneNumber
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {sending ? 'Sending...' : 'Send Message'}
      </button>
    </div>
  );
};

export default WhatsAppForm;
