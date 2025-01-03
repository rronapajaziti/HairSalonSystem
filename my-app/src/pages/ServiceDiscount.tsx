import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';

const ServiceDiscount = ({
  updateServiceList,
}: {
  updateServiceList: () => void;
}) => {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [newDiscount, setNewDiscount] = useState({
    serviceID: [] as string[],
    discountPercentage: '',
    startDate: '',
    endDate: '',
  });
  const [editingServiceDiscountID, setEditingServiceDiscountID] = useState<
    number | null
  >(null);
  const [editFormData, setEditFormData] = useState({
    serviceDiscountID: '',
    serviceID: [] as string[],
    discountPercentage: '',
    startDate: '',
    endDate: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchDiscounts();
    fetchServices();
  }, []);

  const fetchDiscounts = async () => {
    try {
      const response = await axios.get(
        'https://localhost:7158/api/ServiceDiscount',
      );
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

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newDiscountData = {
      serviceIDs: newDiscount.serviceID.map((id) => parseInt(id, 10)),
      discountPercentage: parseFloat(newDiscount.discountPercentage),
      startDate: new Date(newDiscount.startDate + 'T00:00:00').toISOString(),
      endDate: new Date(newDiscount.endDate + 'T00:00:00').toISOString(),
    };

    try {
      const response = await axios.post(
        'https://localhost:7158/api/ServiceDiscount',
        newDiscountData,
      );
      setDiscounts([...discounts, response.data]);
      setShowAddForm(false);
      setNewDiscount({
        serviceID: [] as string[],
        discountPercentage: '',
        startDate: '',
        endDate: '',
      });
      updateServiceList();
    } catch (error) {
      console.error('Error adding discount:', error);
      alert('Error adding discount. Please try again.');
    }
  };

  const handleEdit = (discount: any) => {
    setEditingServiceDiscountID(discount.serviceDiscountID);
    setEditFormData({
      serviceDiscountID: discount.serviceDiscountID,
      serviceID: discount.serviceIDs.map((id: number) => id.toString()), // Convert to string array for select input
      discountPercentage: discount.discountPercentage.toString(),
      startDate: discount.startDate.split('T')[0], // Extract date portion
      endDate: discount.endDate.split('T')[0], // Extract date portion
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate inputs
      if (!editFormData.startDate || !editFormData.endDate) {
        alert('Dates cannot be empty.');
        return;
      }

      const parsedStartDate = new Date(editFormData.startDate + 'T00:00:00');
      const parsedEndDate = new Date(editFormData.endDate + 'T00:00:00');

      if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
        alert('Invalid date format. Please ensure the dates are valid.');
        return;
      }

      if (parsedStartDate >= parsedEndDate) {
        alert('Start date must be earlier than the end date.');
        return;
      }

      // Prepare updated discount object
      const updatedDiscount = {
        serviceDiscountID: editingServiceDiscountID,
        serviceIDs: editFormData.serviceID.map((id) => parseInt(id, 10)), // Convert back to number array
        discountPercentage: parseFloat(editFormData.discountPercentage),
        startDate: parsedStartDate.toISOString(),
        endDate: parsedEndDate.toISOString(),
      };

      // API call to update the discount
      await axios.put(
        `https://localhost:7158/api/ServiceDiscount/${editingServiceDiscountID}`,
        updatedDiscount,
      );

      // Update local state
      setDiscounts((prev) =>
        prev.map((discount) =>
          discount.serviceDiscountID === editingServiceDiscountID
            ? { ...discount, ...updatedDiscount }
            : discount,
        ),
      );

      setEditingServiceDiscountID(null); // Exit edit mode
      updateServiceList(); // Update services
    } catch (error) {
      console.error('Error updating discount:', error);
      alert('Error updating discount. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://localhost:7158/api/ServiceDiscount/${id}`);
      setDiscounts((prev) =>
        prev.filter((discount) => discount.serviceDiscountID !== id),
      );
      updateServiceList();
    } catch (error) {
      console.error('Error deleting discount:', error);
    }
  };

  const activeDiscounts = discounts.filter(
    (discount) =>
      new Date(discount.startDate) <= new Date() &&
      new Date(discount.endDate) >= new Date(),
  );

  const inactiveDiscounts = discounts.filter(
    (discount) =>
      new Date(discount.endDate) < new Date() ||
      new Date(discount.startDate) > new Date(),
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Menaxhimi i Zbritjeve</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showAddForm ? 'Mbyll' : 'Shto Zbritje'}
        </button>
      </div>
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Shërbimet</label>
              <select
                multiple
                value={newDiscount.serviceID}
                onChange={(e) =>
                  setNewDiscount({
                    ...newDiscount,
                    serviceID: Array.from(e.target.selectedOptions).map(
                      (opt) => opt.value,
                    ),
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
                  setNewDiscount({
                    ...newDiscount,
                    discountPercentage: e.target.value,
                  })
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
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          >
            Shto Zbritje
          </button>
        </form>
      )}

      <h2 className="text-xl font-semibold mb-2">Zbritjet Aktive</h2>
      <table className="w-full border-collapse border mb-6">
        <thead>
          <tr>
            <th className="border px-4 py-2">Shërbimi</th>
            <th className="border px-4 py-2">Çmimi Aktual</th>
            <th className="border px-4 py-2">Zbritja (%)</th>
            <th className="border px-4 py-2">Data e Fillimit</th>
            <th className="border px-4 py-2">Data e Mbarimit</th>
            <th className="border px-4 py-2">Veprimet</th>
          </tr>
        </thead>
        <tbody>
          {activeDiscounts.map((discount) => (
            <tr key={discount.serviceDiscountID}>
              <td className="border px-4 py-2">
                {discount.serviceIDs
                  ?.map((id: number) => {
                    const service = services.find((s) => s.serviceID === id);
                    return service?.serviceName || 'I panjohur';
                  })
                  .join(', ') || 'I panjohur'}
              </td>
              <td className="border px-4 py-2">
                {discount.serviceIDs
                  ?.map((id: number) => {
                    const service = services.find((s) => s.serviceID === id);
                    return service?.price || 'I panjohur';
                  })
                  .join(', ') || 'I panjohur'}
              </td>
              <td className="border px-4 py-2">
                {discount.discountPercentage}%
              </td>
              <td className="border px-4 py-2">
                {new Date(discount.startDate).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">
                {new Date(discount.endDate).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">
                <button onClick={() => handleEdit(discount)}>
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(discount.serviceDiscountID)}
                >
                  <MdOutlineDelete />
                </button>
              </td>
              {editingServiceDiscountID === discount.serviceDiscountID && (
                <tr>
                  <td colSpan={6} className="bg-gray-100 p-4">
                    <form
                      onSubmit={handleEditSubmit}
                      className="flex flex-col space-y-4"
                      style={{ position: 'relative', zIndex: 10 }}
                    >
                      <div className="grid grid-cols-4 gap-4">
                        <select
                          name="serviceID"
                          value={editFormData.serviceID}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              serviceID: Array.from(
                                e.target.selectedOptions,
                              ).map((opt) => opt.value),
                            })
                          }
                          multiple
                          className="border rounded px-2 py-1 w-full"
                        >
                          {services.map((service) => (
                            <option
                              key={service.serviceID}
                              value={service.serviceID}
                            >
                              {service.serviceName}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          name="discountPercentage"
                          value={editFormData.discountPercentage}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              discountPercentage: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="date"
                          name="startDate"
                          value={editFormData.startDate}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              startDate: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1"
                        />
                        <input
                          type="date"
                          name="endDate"
                          value={editFormData.endDate}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              endDate: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingServiceDiscountID(null)}
                          className="bg-gray-400 text-white px-4 py-2 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              )}
            </tr>
          ))}
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
          {inactiveDiscounts.map((discount) => (
            <tr key={discount.serviceDiscountID}>
              <td className="border px-4 py-2">
                {services.find((s) => s.serviceID === discount.serviceID)
                  ?.serviceName || 'I panjohur'}
              </td>
              <td className="border px-4 py-2">
                {discount.discountPercentage}%
              </td>
              <td className="border px-4 py-2">
                {new Date(discount.startDate).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">
                {new Date(discount.endDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServiceDiscount;
