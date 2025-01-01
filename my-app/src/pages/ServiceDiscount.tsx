import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';

const ServiceDiscount = () => {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [newDiscount, setNewDiscount] = useState({
    serviceID: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
  });
  const [selectedServicePrice, setSelectedServicePrice] = useState<number | null>(null);
  const [editingDiscountId, setEditingDiscountId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    discountID: null,
    serviceID: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchDiscounts();
    fetchServices();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get('https://localhost:7158/api/ServiceDiscount');
      setDiscounts(response.data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('https://localhost:7158/api/Service');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceID = e.target.value;
    setNewDiscount({ ...newDiscount, serviceID });

    // Find the selected service and update the price
    const selectedService = services.find((service) => service.serviceID === parseInt(serviceID));
    if (selectedService) {
      setSelectedServicePrice(selectedService.price);
    } else {
      setSelectedServicePrice(null);
    }
  };
  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input fields
    if (!newDiscount.serviceID || !newDiscount.startDate || !newDiscount.endDate || !newDiscount.discountPercentage) {
        console.error('All fields are required.');
        return;
    }

    if (new Date(newDiscount.endDate) <= new Date(newDiscount.startDate)) {
        console.error('End date must be after the start date.');
        return;
    }

    try {
        const payload = {
            serviceDiscountID: 0, // Default for new discounts
            serviceID: parseInt(newDiscount.serviceID), // Ensure serviceID is valid
            startDate: new Date(newDiscount.startDate).toISOString(), // Convert to ISO 8601
            endDate: new Date(newDiscount.endDate).toISOString(), // Convert to ISO 8601
            discountPercentage: parseFloat(newDiscount.discountPercentage), // Ensure it's a number
        };

        console.log('Payload:', payload);

        // Send POST request
        const response = await axios.post('https://localhost:7158/api/ServiceDiscount', payload);

        // Update state with the new discount
        setDiscounts([...discounts, response.data]);

        // Reset form
        setNewDiscount({
            serviceID: '',
            discountPercentage: '',
            startDate: '',
            endDate: '',
        });
        setSelectedServicePrice(null);
    } catch (error: any) {
        console.error('Error adding discount:', error.response?.data || error.message);
    }
};

  
  const handleEdit = (discount: any) => {
    if (editingDiscountId === discount.discountID) {
      setEditingDiscountId(null);
    } else {
      setEditingDiscountId(discount.discountID);
      setEditFormData({
        discountID: discount.discountID,
        serviceID: discount.serviceID,
        discountPercentage: discount.discountPercentage,
        startDate: discount.startDate,
        endDate: discount.endDate,
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://localhost:7158/api/ServiceDiscount/${editFormData.discountID}`,
        editFormData,
      );
      setDiscounts((prev) =>
        prev.map((discount) =>
          discount.discountID === editFormData.discountID ? response.data : discount,
        ),
      );
      setEditingDiscountId(null);
    } catch (error) {
      console.error('Error editing discount:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://localhost:7158/api/ServiceDiscount/${id}`);
      setDiscounts((prev) => prev.filter((discount) => discount.discountID !== id));
    } catch (error) {
      console.error('Error deleting discount:', error);
    }
  };

  
  
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Service Discounts</h1>
  
      {/* Add Discount Form */}
      <form onSubmit={handleAddDiscount} className="mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium">Service</label>
            <select
              value={newDiscount.serviceID}
              onChange={handleServiceChange}
              className="border rounded px-2 py-1 w-full"
              required
            >
              <option value="">Select a Service</option>
              {services.map((service) => (
                <option key={service.serviceID} value={service.serviceID}>
                  {service.serviceName}
                </option>
              ))}
            </select>
          </div>
  
          {/* Display Service Price */}
          {selectedServicePrice !== null && (
            <div>
              <label className="block font-medium">Service Price</label>
              <p className="border rounded px-2 py-1 w-full bg-gray-100">
                {selectedServicePrice.toFixed(2)}€
              </p>
            </div>
          )}
  
          <div>
            <label className="block font-medium">Discount Percentage (%)</label>
            <input
              type="number"
              value={newDiscount.discountPercentage}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, discountPercentage: e.target.value })
              }
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Start Date</label>
            <input
              type="date"
              value={newDiscount.startDate}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, startDate: e.target.value })
              }
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
          <div>
            <label className="block font-medium">End Date</label>
            <input
              type="date"
              value={newDiscount.endDate}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, endDate: e.target.value })
              }
              className="border rounded px-2 py-1 w-full"
              required
            />
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Discount
        </button>
      </form>
  
      {/* Discounts Table */}
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Service</th>
            <th className="border px-4 py-2">Original Price</th>
            <th className="border px-4 py-2">Discount (%)</th>
            <th className="border px-4 py-2">Discounted Price</th>
            <th className="border px-4 py-2">Start Date</th>
            <th className="border px-4 py-2">End Date</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount) => {
            const service = services.find((s) => s.serviceID === discount.serviceID);
            const discountedPrice = service
              ? service.price - (service.price * discount.discountPercentage) / 100
              : null;
  
            return (
              <React.Fragment key={discount.discountID}>
                <tr>
                  <td className="border px-4 py-2">{service?.serviceName || 'Unknown'}</td>
                  <td className="border px-4 py-2">
                    {service ? `${service.price.toFixed(2)}€` : 'N/A'}
                  </td>
                  <td className="border px-4 py-2">{discount.discountPercentage}%</td>
                  <td className="border px-4 py-2">
                    {discountedPrice !== null ? `${discountedPrice.toFixed(2)}€` : 'N/A'}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(discount.startDate).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(discount.endDate).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(discount)}
                      className="text-blue-500 mr-2"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(discount.discountID)}
                      className="text-red-500"
                    >
                      <MdOutlineDelete />
                    </button>
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
  
};

export default ServiceDiscount;
