import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';

const Service = ({ searchQuery }: { searchQuery: string }) => {
  // Accept searchQuery prop
  const [serviceList, setServiceList] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newService, setNewService] = useState({
    serviceID: null,
    serviceName: '',
    description: '',
    price: '',
    duration: '',
    staffEarningPercentage: '',
  });
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    serviceID: null,
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
      const response = await axios.get(
        'https://api.studio-linda.com/api/Service',
      );
      const services = Array.isArray(response.data?.data)
        ? response.data.data
        : [];
      console.log('Fetched Services:', services); // Debugging
      setServiceList(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServiceList([]); // Ensure serviceList is an empty array on error
    }
  };

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewService({
      ...newService,
      [name]: value,
    });
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      serviceID: 0,
      serviceName: newService.serviceName,
      description: newService.description,
      price: parseFloat(newService.price),
      duration: parseInt(newService.duration, 10),
      staffEarningPercentage: parseFloat(newService.staffEarningPercentage),
    };

    try {
      const response = await axios.post(
        'https://api.studio-linda.com/api/Service',
        payload,
      );
      setServiceList([...serviceList, response.data]);
      setShowForm(false);
      setNewService({
        serviceID: null,
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

    const payload = {
      serviceID: editFormData.serviceID,
      serviceName: editFormData.serviceName,
      description: editFormData.description,
      price: parseFloat(editFormData.price),
      duration: parseInt(editFormData.duration, 10),
      staffEarningPercentage: parseFloat(editFormData.staffEarningPercentage),
    };

    try {
      await axios.put(
        `https://api.studio-linda.com/api/Service/${payload.serviceID}`,
        payload,
      );
      setServiceList((prev) =>
        prev.map((service) =>
          service.serviceID === payload.serviceID
            ? { ...service, ...payload }
            : service,
        ),
      );
      setEditingRowId(null);
      window.dispatchEvent(new Event('dataUpdated'));
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://api.studio-linda.com/api/Service/${id}`);
      setServiceList((prev) =>
        prev.filter((service) => service.serviceID !== id),
      );
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleEdit = (service: any) => {
    if (editingRowId === service.serviceID) {
      setEditingRowId(null);
    } else {
      setEditingRowId(service.serviceID);
      setEditFormData(service);
    }
  };

  // Filter the service list based on searchQuery (case-insensitive)
  const filteredServices = serviceList.filter((service) =>
    service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold dark:text-white text-blue-900">
          Shërbimet
        </h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setNewService({
              serviceID: null,
              serviceName: '',
              description: '',
              price: '',
              duration: '',
              staffEarningPercentage: '',
            });
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {showForm ? 'Mbyll' : 'Shto Shërbim'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Emri i Shërbimit
              </label>
              <input
                type="text"
                name="serviceName"
                placeholder="Emri i Shërbimit"
                value={newService.serviceName}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border text-black border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Përshkrimi
              </label>
              <textarea
                name="description"
                placeholder="Përshkrimi"
                value={newService.description}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border text-black border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Çmimi
              </label>
              <input
                type="number"
                name="price"
                placeholder="Çmimi"
                value={newService.price}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border text-black border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Kohëzgjatja (min)
              </label>
              <input
                type="number"
                name="duration"
                placeholder="Kohëzgjatja"
                value={newService.duration}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border text-black border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Paga e Stafit (%)
              </label>
              <input
                type="number"
                name="staffEarningPercentage"
                placeholder="Paga e Stafit"
                value={newService.staffEarningPercentage}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border text-black border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded-md mt-4"
          >
            Shto
          </button>
        </form>
      )}

      <div className="max-w-full overflow-x-auto mt-6">
        <table className="w-full table-auto dark:border-strokedark dark:bg-boxdark">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Emri i Shërbimit
              </th>
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Përshkrimi
              </th>
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Çmimi (Aktual)
              </th>
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Kohëzgjatja
              </th>
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Paga e Stafit (%)
              </th>
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Veprime
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map((service) => (
              <React.Fragment key={service.serviceID}>
                <tr>
                  <td className="py-4 px-4 dark:text-white text-black">
                    {service.serviceName}
                  </td>
                  <td className="py-4 px-4 dark:text-white text-black">
                    {service.description}
                  </td>
                  <td className="py-4 px-4 dark:text-white text-black">
                    {service.discountPrice > 0
                      ? `${service.discountPrice}€`
                      : `${service.price}€`}
                  </td>
                  <td className="py-4 px-4 dark:text-white text-black">
                    {service.duration} min
                  </td>
                  <td className="py-4 px-4 dark:text-white text-black">
                    {service.staffEarningPercentage}%
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2 sm:justify-center">
                      <button
                        onClick={() => handleEdit(service)}
                        className="bg-blue-500 text-white rounded-md px-4 py-2 text-base sm:px-4 sm:py-2 sm:text-sm"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(service.serviceID)}
                        className="bg-red-500 text-white rounded-md px-4 py-2 text-base sm:px-4 sm:py-2 sm:text-sm"
                      >
                        <MdOutlineDelete />
                      </button>
                    </div>
                  </td>
                </tr>
                {editingRowId === service.serviceID && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-4 px-4 bg-gray-100 text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                    >
                      <form onSubmit={handleEditSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Emri i Shërbimit
                            </label>
                            <input
                              type="text"
                              name="serviceName"
                              value={editFormData.serviceName}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Përshkrimi
                            </label>
                            <textarea
                              name="description"
                              value={editFormData.description}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Çmimi
                            </label>
                            <input
                              type="number"
                              name="price"
                              value={editFormData.price}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Kohëzgjatja (min)
                            </label>
                            <input
                              type="number"
                              name="duration"
                              value={editFormData.duration}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                              required
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-md"
                        >
                          Ruaj
                        </button>
                      </form>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Service;
