import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';

const ServiceDiscount = ({
  updateServiceList,
  searchQuery,
}: {
  updateServiceList: () => void;
  searchQuery: string;
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
        'https://api.studio-linda.com/api/ServiceDiscount',
      );
      setDiscounts(response.data);
    } catch (error) {
      console.error('Error fetching discounts:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        'https://api.studio-linda.com/api/Service',
      );
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
        'https://api.studio-linda.com/api/ServiceDiscount',
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
    }
  };

  const handleEdit = (discount: any) => {
    if (editingServiceDiscountID === discount.serviceDiscountID) {
      setEditingServiceDiscountID(null);
    } else {
      setEditingServiceDiscountID(discount.serviceDiscountID);
      setEditFormData({
        serviceDiscountID: discount.serviceDiscountID,
        serviceID: discount.serviceIDs.map((id: number) => id.toString()),
        discountPercentage: discount.discountPercentage.toString(),
        startDate: discount.startDate.split('T')[0],
        endDate: discount.endDate.split('T')[0],
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
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

      const updatedDiscount = {
        serviceDiscountID: editingServiceDiscountID,
        serviceIDs: editFormData.serviceID.map((id) => parseInt(id, 10)),
        discountPercentage: parseFloat(editFormData.discountPercentage),
        startDate: parsedStartDate.toISOString(),
        endDate: parsedEndDate.toISOString(),
      };

      await axios.put(
        `https://api.studio-linda.com/api/ServiceDiscount/${editingServiceDiscountID}`,
        updatedDiscount,
      );

      setDiscounts((prev) =>
        prev.map((discount) =>
          discount.serviceDiscountID === editingServiceDiscountID
            ? { ...discount, ...updatedDiscount }
            : discount,
        ),
      );

      setEditingServiceDiscountID(null);
      updateServiceList();
    } catch (error) {
      console.error('Error updating discount:', error);
      alert('Error updating discount. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(
        `https://api.studio-linda.com/api/ServiceDiscount/${id}`,
      );
      setDiscounts((prev) =>
        prev.filter((discount) => discount.serviceDiscountID !== id),
      );
      updateServiceList();
    } catch (error) {
      console.error('Error deleting discount:', error);
    }
  };

  // Filter discounts based on search query
  const filteredDiscounts = discounts.filter((discount) => {
    const serviceNames = discount.serviceIDs
      .map((id: number) => {
        const service = services.find((s) => s.serviceID === id);
        return service?.serviceName.toLowerCase() || '';
      })
      .join(', ');
    return serviceNames.includes(searchQuery.toLowerCase());
  });

  const activeDiscounts = filteredDiscounts.filter(
    (discount) =>
      new Date(discount.startDate) <= new Date() &&
      new Date(discount.endDate) >= new Date(),
  );

  const inactiveDiscounts = filteredDiscounts.filter(
    (discount) =>
      new Date(discount.endDate) < new Date() ||
      new Date(discount.startDate) > new Date(),
  );

  const renderTable = (discounts: any[], title: string) => (
    <>
      <h2 className="text-xl font-semibold mb-2 dark:text-white text-blue-900">
        {title}
      </h2>
      <table className="w-full border-collapse border mb-6 text-black dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark">
        <thead>
          <tr>
            <th className="border px-4 py-2 dark:border-strokedark dark:bg-boxdark text-black dark:text-white">
              Shërbimi
            </th>
            <th className="border px-4 py-2 dark:border-strokedark dark:bg-boxdark text-black dark:text-white">
              Çmimi Aktual
            </th>
            <th className="border px-4 py-2 dark:border-strokedark dark:bg-boxdark text-black dark:text-white">
              Zbritja (%)
            </th>
            <th className="border px-4 py-2 dark:border-strokedark dark:bg-boxdark text-black dark:text-white">
              Data e Fillimit
            </th>
            <th className="border px-4 py-2 dark:border-strokedark dark:bg-boxdark text-black dark:text-white">
              Data e Mbarimit
            </th>
            <th className="border px-4 py-2 dark:border-strokedark dark:bg-boxdark text-black dark:text-white">
              Veprimet
            </th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount) => (
            <React.Fragment key={discount.serviceDiscountID}>
              <tr>
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
                <td className="py-4 px-4">
                  <div className="flex space-x-2 sm:justify-center">
                    <button
                      onClick={() => handleEdit(discount)}
                      className="bg-blue-500 text-white rounded-md px-4 py-2 text-base sm:px-4 sm:py-2 sm:text-sm"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(discount.serviceDiscountID)}
                      className="bg-red-500 text-white rounded-md px-4 py-2 text-base sm:px-4 sm:py-2 sm:text-sm"
                    >
                      <MdOutlineDelete />
                    </button>
                  </div>
                </td>
              </tr>
              {editingServiceDiscountID === discount.serviceDiscountID && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-4 px-4 bg-gray-100 dark:bg-boxdark"
                  >
                    <form onSubmit={handleEditSubmit}>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Shërbimet
                          </label>
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
                            className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
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
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Zbritja (%)
                          </label>
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
                            className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Data e Fillimit
                          </label>
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
                            className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-white">
                            Data e Mbarimit
                          </label>
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
                            className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                            required
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                          Ruaj
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingServiceDiscountID(null)}
                          className="px-4 py-2 bg-gray-400 text-white rounded-md"
                        >
                          Anulo
                        </button>
                      </div>
                    </form>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  );

  return (
    <div className="container mx-auto p-4 dark:text-white text-blue-900">
      <div className="flex justify-between items-center mb-4 ">
        <h1 className="text-2xl font-bold dark:text-white text-blue-900">
          Menaxhimi i Zbritjeve
        </h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showAddForm ? 'X' : 'Shto Zbritje'}
        </button>
      </div>
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="mb-6">
          <div className="grid grid-cols-2 gap-4 ">
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
                className="border rounded px-2 py-1 w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark "
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
                className="border rounded px-2 py-1 w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
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
                className="border rounded px-2 py-1 w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
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
                className="border rounded px-2 py-1 w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
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
      {renderTable(activeDiscounts, 'Zbritjet Aktive')}
      {renderTable(inactiveDiscounts, 'Zbritjet Joaktive')}
    </div>
  );
};

export default ServiceDiscount;
