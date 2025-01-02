import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';

const ServiceDiscount = ({ updateServiceList }: { updateServiceList: () => void }) => {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [newDiscount, setNewDiscount] = useState({
    serviceID: [] as string[],
    discountPercentage: '',
    startDate: '',
    endDate: '',
  });
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

  // Separate active and inactive discounts
  const activeDiscounts = discounts.filter(
    (discount) =>
      new Date(discount.startDate) <= new Date() &&
      new Date(discount.endDate) >= new Date()
  );

  const inactiveDiscounts = discounts.filter(
    (discount) =>
      new Date(discount.endDate) < new Date() || new Date(discount.startDate) > new Date()
  );

  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newDiscount.serviceID.length ||
      !newDiscount.startDate ||
      !newDiscount.endDate ||
      !newDiscount.discountPercentage
    ) {
      console.error('All fields are required.');
      return;
    }

    if (new Date(newDiscount.endDate) <= new Date(newDiscount.startDate)) {
      console.error('End date must be after the start date.');
      return;
    }

    try {
      const payloads = newDiscount.serviceID.map((serviceID) => ({
        serviceDiscountID: 0,
        serviceID: parseInt(serviceID),
        startDate: new Date(newDiscount.startDate).toISOString(),
        endDate: new Date(newDiscount.endDate).toISOString(),
        discountPercentage: parseFloat(newDiscount.discountPercentage),
      }));

      const responses = await Promise.all(
        payloads.map((payload) =>
          axios.post('https://localhost:7158/api/ServiceDiscount', payload)
        )
      );

      const addedDiscounts = responses.map((response) => response.data);

      setDiscounts([...discounts, ...addedDiscounts]);
      setNewDiscount({
        serviceID: [],
        discountPercentage: '',
        startDate: '',
        endDate: '',
      });
      updateServiceList();
    } catch (error: any) {
      console.error('Error adding discount:', error.response?.data || error.message);
    }
  };

  const handleEdit = (discount: any) => {
    setEditingDiscountId(discount.discountID);
    setEditFormData({
      ...discount,
      serviceID: discount.serviceID.toString(),
    });
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedDiscount = {
        serviceDiscountID: editingDiscountId,
        serviceID: parseInt(editFormData.serviceID),
        startDate: new Date(editFormData.startDate).toISOString(),
        endDate: new Date(editFormData.endDate).toISOString(),
        discountPercentage: parseFloat(editFormData.discountPercentage),
      };

      await axios.put(
        `https://localhost:7158/api/ServiceDiscount/${editingDiscountId}`,
        updatedDiscount
      );

      setDiscounts((prev) =>
        prev.map((discount) =>
          discount.discountID === editingDiscountId ? updatedDiscount : discount
        )
      );
      setEditingDiscountId(null);
    } catch (error) {
      console.error('Error updating discount:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingDiscountId(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://localhost:7158/api/ServiceDiscount/${id}`);
      setDiscounts((prev) => prev.filter((discount) => discount.discountID !== id));
      updateServiceList();
    } catch (error) {
      console.error('Error deleting discount:', error);
    }
  };

  const calculateDiscountedPrice = (serviceID: number, discountPercentage: number) => {
    const service = services.find((service) => service.serviceID === serviceID);
    return service ? (service.price * (1 - discountPercentage / 100)).toFixed(2) : null;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Menaxhimi i Zbritjeve</h1>
      <form onSubmit={handleAddDiscount} className="mb-6">
        {/* Add Discount Form */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium">Shërbimet</label>
            <select
              multiple
              value={newDiscount.serviceID}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  serviceID: Array.from(e.target.selectedOptions).map((opt) => opt.value),
                })
              }
              className="border rounded px-2 py-1 w-full"
            >
              {services.map((service) => (
                <option key={service.serviceID} value={service.serviceID}>
                  {service.serviceName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Zbritja (%)</label>
            <input
              type="number"
              value={newDiscount.discountPercentage}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, discountPercentage: e.target.value })
              }
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Data e Fillimit</label>
            <input
              type="date"
              value={newDiscount.startDate}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, startDate: e.target.value })
              }
              className="border rounded px-2 py-1 w-full"
            />
          </div>
          <div>
            <label className="block font-medium">Data e Mbarimit</label>
            <input
              type="date"
              value={newDiscount.endDate}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, endDate: e.target.value })
              }
              className="border rounded px-2 py-1 w-full"
            />
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Discount
        </button>
      </form>

      {/* Active Discounts */}
      <h2 className="text-xl font-semibold mb-2">Zbritjet Aktive</h2>
      <table className="w-full border-collapse border mb-6">
        <thead>
          <tr>
            <th className="border px-4 py-2">Shërbimi</th>
            <th className="border px-4 py-2">Zbritja (%)</th>
            <th className="border px-4 py-2">Data e Fillimit</th>
            <th className="border px-4 py-2">Data e Mbarimit</th>
            <th className="border px-4 py-2">Cmimi me Zbritje</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {activeDiscounts.map((discount) => {
            const service = services.find((s) => s.serviceID === discount.serviceID);
            const discountedPrice = calculateDiscountedPrice(
              discount.serviceID,
              discount.discountPercentage
            );
            return (
              <tr key={discount.discountID}>
                <td className="border px-4 py-2">{service?.serviceName || 'Unknown'}</td>
                <td className="border px-4 py-2">{discount.discountPercentage}%</td>
                <td className="border px-4 py-2">
                  {new Date(discount.startDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  {new Date(discount.endDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">{discountedPrice || 'N/A'}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleEdit(discount)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(discount.discountID)}>
                    <MdOutlineDelete />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Inactive Discounts */}
      <h2 className="text-xl font-semibold mb-2">Zbritjet Joaktive</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Shërbimi</th>
            <th className="border px-4 py-2">Zbritja (%)</th>
            <th className="border px-4 py-2">Data e Fillimit</th>
            <th className="border px-4 py-2">Data e Mbarimit</th>
          </tr>
        </thead>
        <tbody>
          {inactiveDiscounts.map((discount) => {
            const service = services.find((s) => s.serviceID === discount.serviceID);
            return (
              <tr key={discount.discountID}>
                <td className="border px-4 py-2">{service?.serviceName || 'Unknown'}</td>
                <td className="border px-4 py-2">{discount.discountPercentage}%</td>
                <td className="border px-4 py-2">
                  {new Date(discount.startDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  {new Date(discount.endDate).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceDiscount;
