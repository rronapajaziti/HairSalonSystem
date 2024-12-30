import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';

const Services = () => {
  const [serviceList, setServiceList] = useState<any[]>([]);
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    try {
      const response = await axios.post(
        'https://localhost:7158/api/Service',
        newService,
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
        editFormData,
      );
      setServiceList((prev) =>
        prev.map((service) =>
          service.id === editFormData.id
            ? { ...service, ...response.data }
            : service,
        ),
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
    if (editingRowId === service.id) {
      setEditingRowId(null);
    } else {
      setEditingRowId(service.id);
      setEditFormData(service);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold dark:text-white text-blue-900 ">
          Shërbimet
        </h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setNewService({
              id: null,
              serviceName: '',
              description: '',
              price: '',
              duration: '',
              staffEarningPercentage: '',
            });
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md "
        >
          {showForm ? 'X' : 'Shto Shërbimin'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Shërbimi
              </label>
              <input
                type="text"
                name="serviceName"
                value={newService.serviceName}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Përshkrimi
              </label>
              <textarea
                name="description"
                value={newService.description}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Çmimi
              </label>
              <input
                type="number"
                name="price"
                value={newService.price}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Kohëzgjatja
              </label>
              <input
                type="number"
                name="duration"
                value={newService.duration}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Përqindja
              </label>
              <input
                type="number"
                name="staffEarningPercentage"
                value={newService.staffEarningPercentage}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Shto
          </button>
        </form>
      )}

      <div className="max-w-full overflow-x-auto mt-6">
        <table className="w-full table-auto dark:border-strokedark dark:bg-boxdark">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-4 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Shërbimi
              </th>
              <th className="py-4 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Përshkrimi
              </th>
              <th className="py-4 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Çmimi
              </th>
              <th className="py-4 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Kohëzgjatja
              </th>
              <th className="py-4 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Përqindja
              </th>
              <th className="py-4 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Veprimet
              </th>
            </tr>
          </thead>
          <tbody>
            {serviceList.map((service) => (
              <React.Fragment key={service.id}>
                <tr>
                  <td className="py-4 px-4 text-black dark:text-white">
                    {service.serviceName}
                  </td>
                  <td className="py-4 px-4 text-black dark:text-white">
                    {service.description}
                  </td>
                  <td className="py-4 px-4 text-black dark:text-white">
                    {service.price}€
                  </td>
                  <td className="py-4 px-4 text-black dark:text-white">
                    {service.duration} min
                  </td>
                  <td className="py-4 px-4 text-black dark:text-white">
                    {service.staffEarningPercentage}%
                  </td>
                  <td className="py-4 px-4 text-black dark:text-white">
                    <button
                      onClick={() => handleEdit(service)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      <MdOutlineDelete />
                    </button>
                  </td>
                </tr>
                {editingRowId === service.id && (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-4 px-4 bg-gray-100 text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                    >
                      <form onSubmit={handleEditSubmit}>
                        <div className="grid grid-cols-2 gap-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                          <div>
                            <label className="block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Shërbimi
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
                          <div>
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
                          <div>
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
                          <div>
                            <label className="block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Kohëzgjatja
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
                          <div>
                            <label className="block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Përqindja
                            </label>
                            <input
                              type="number"
                              name="staffEarningPercentage"
                              value={editFormData.staffEarningPercentage}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                              required
                            />
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
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

export default Services;
