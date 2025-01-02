import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';

const Services = () => {
  const [serviceList, setServiceList] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]); // State to store discounts
  const [showForm, setShowForm] = useState(false);
  const [newService, setNewService] = useState({
    id: null,
    serviceName: '',
    description: '',
    price: '',
    duration: '',
    staffEarningPercentage: '',
  });
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    id: null,
    serviceName: '',
    description: '',
    price: '',
    duration: '',
    staffEarningPercentage: '',
  });

  useEffect(() => {
    fetchServices();
    fetchDiscounts();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('https://localhost:7158/api/Service');
      const formattedServices = response.data.map((service: any) => ({
        ...service,
        id: service.serviceID,
      }));
      setServiceList(formattedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get('https://localhost:7158/api/ServiceDiscount');
      setDiscounts(response.data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://localhost:7158/api/Service',
        newService
      );
      setServiceList([...serviceList, response.data]);
      setShowForm(false);
      setNewService({
        id: null,
        serviceName: '',
        description: '',
        price: '',
        duration: '',
        staffEarningPercentage: '',
      });
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://localhost:7158/api/Service/${editFormData.id}`,
        editFormData
      );
      setServiceList((prev) =>
        prev.map((service) =>
          service.id === editFormData.id ? { ...service, ...response.data } : service
        )
      );
      setEditingRowId(null);
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://localhost:7158/api/Service/${id}`);
      setServiceList((prev) => prev.filter((service) => service.id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleEdit = (service: any) => {
    setEditingRowId(service.id);
    setEditFormData(service);
  };

  const calculateDiscountedPrice = (service: any) => {
    const applicableDiscount = discounts.find(
      (discount) =>
        discount.serviceID === service.id &&
        new Date(discount.startDate) <= new Date() &&
        new Date(discount.endDate) >= new Date()
    );

    if (!applicableDiscount) {
      return { discountedPrice: null, discountDetails: null };
    }

    const discountedPrice =
      service.price - (service.price * applicableDiscount.discountPercentage) / 100;

    return {
      discountedPrice: discountedPrice.toFixed(2),
      discountDetails: applicableDiscount,
    };
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showForm ? 'Close Form' : 'Add Service'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="serviceName"
              placeholder="Service Name"
              value={newService.serviceName}
              onChange={handleInputChange}
              className="border px-4 py-2"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={newService.description}
              onChange={handleInputChange}
              className="border px-4 py-2"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newService.price}
              onChange={handleInputChange}
              className="border px-4 py-2"
              required
            />
            <input
              type="number"
              name="duration"
              placeholder="Duration (mins)"
              value={newService.duration}
              onChange={handleInputChange}
              className="border px-4 py-2"
              required
            />
            <input
              type="number"
              name="staffEarningPercentage"
              placeholder="Staff Earning (%)"
              value={newService.staffEarningPercentage}
              onChange={handleInputChange}
              className="border px-4 py-2"
              required
            />
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 mt-4 rounded">
            Submit
          </button>
        </form>
      )}

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Shërbimi</th>
            <th className="border px-4 py-2">Përshkrimi</th>
            <th className="border px-4 py-2">Cmimi</th>
            <th className="border px-4 py-2">Zbritja (%)</th>
            <th className="border px-4 py-2">Cmimi me Zbritje</th>
            <th className="border px-4 py-2">Kohëzgjatja e Zbritjës</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {serviceList.map((service) => {
            const { discountedPrice, discountDetails } = calculateDiscountedPrice(service);
            return (
              <tr key={service.id}>
                <td className="border px-4 py-2">{service.serviceName}</td>
                <td className="border px-4 py-2">{service.description}</td>
                <td className="border px-4 py-2">{service.price}€</td>
                <td className="border px-4 py-2">
                  {discountDetails ? `${discountDetails.discountPercentage}%` : 'N/A'}
                </td>
                <td className="border px-4 py-2">
                  {discountedPrice ? `${discountedPrice}€` : 'N/A'}
                </td>
                <td className="border px-4 py-2">
                  {discountDetails
                    ? `${new Date(discountDetails.startDate).toLocaleDateString()} - ${new Date(
                        discountDetails.endDate
                      ).toLocaleDateString()}`
                    : 'N/A'}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-blue-500 px-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-500 px-2"
                  >
                    <MdOutlineDelete />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Services;
