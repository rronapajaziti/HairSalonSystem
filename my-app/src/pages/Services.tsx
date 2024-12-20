import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newService, setNewService] = useState({
    serviceID: null,
    serviceName: '',
    description: '',
    price: 0,
    duration: 0,
  });
  const [editingServiceID, setEditingServiceID] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    serviceID: null,
    serviceName: '',
    description: '',
    price: 0,
    duration: 0,
  });

  useEffect(() => {
    axios
      .get('https://localhost:7158/api/Service')
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching services!', error);
      });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewService((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'duration' ? parseFloat(value) : value,
    }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'duration' ? parseFloat(value) : value,
    }));
  };

  const handleEdit = (service: any) => {
    if (editingServiceID === service.serviceID) {
      resetForm();
    } else {
      setEditingServiceID(service.serviceID);
      setEditFormData({
        serviceID: service.serviceID,
        serviceName: service.serviceName,
        description: service.description,
        price: service.price,
        duration: service.duration,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      serviceID: editingServiceID ?? 0,
      serviceName: editingServiceID
        ? editFormData.serviceName
        : newService.serviceName,
      description: editingServiceID
        ? editFormData.description
        : newService.description,
      price: editingServiceID ? editFormData.price : newService.price,
      duration: editingServiceID ? editFormData.duration : newService.duration,
    };

    if (editingServiceID !== null) {
      axios
        .put(`https://localhost:7158/api/Service/${editingServiceID}`, payload)
        .then(() => {
          setServices((prev) =>
            prev.map((service) =>
              service.serviceID === editingServiceID ? payload : service,
            ),
          );
          resetForm();
        })
        .catch((error) => {
          console.error('Error updating service:', error);
        });
    } else {
      axios
        .post('https://localhost:7158/api/Service', payload)
        .then((response) => {
          setServices((prev) => [...prev, response.data]);
          resetForm();
        })
        .catch((error) => {
          console.error('Error creating service:', error);
        });
    }
  };

  const handleDelete = (serviceID: number) => {
    axios
      .delete(`https://localhost:7158/api/Service/${serviceID}`)
      .then(() => {
        setServices((prev) =>
          prev.filter((service) => service.serviceID !== serviceID),
        );
      })
      .catch((error) => {
        console.error('There was an error deleting the service!', error);
      });
  };

  const resetForm = () => {
    setNewService({
      serviceID: null,
      serviceName: '',
      description: '',
      price: 0,
      duration: 0,
    });
    setEditingServiceID(null);
    setShowForm(false);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold dark:text-white text-blue-900">
          Shërbimet
        </h1>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {showForm ? 'X' : 'Shto Shërbimin'}
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
                value={newService.serviceName}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-md w-full dark:text-white dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Përshkrimi
              </label>
              <textarea
                name="description"
                value={newService.description}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border text-black border-gray-300 rounded-md w-full dark:text-white dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Çmimi
              </label>
              <input
                type="number"
                name="price"
                value={newService.price}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border text-black border-gray-300 rounded-md w-full dark:text-white dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Kohëzgjatja (minutat)
              </label>
              <input
                type="number"
                name="duration"
                value={newService.duration}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border text-black border-gray-300 rounded-md w-full dark:text-white dark:border-strokedark dark:bg-boxdark"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
          >
            {editingServiceID !== null ? 'Update Service' : 'Shto'}
          </button>
        </form>
      )}

      <div className="max-w-full overflow-x-auto mt-6">
        <table className="w-full table-auto dark:border-strokedark dark:bg-boxdark">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Shërbimi
              </th>
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Çmimi
              </th>
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Përshkrimi
              </th>
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Kohëzgjatja
              </th>
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Veprimet
              </th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <React.Fragment key={service.serviceID}>
                <tr>
                  <td className="py-4 px-4 dark:text-white text-black">
                    {service.serviceName}
                  </td>
                  <td className="py-4 px-4 dark:text-white text-black">
                    {service.price}
                  </td>
                  <td className="py-4 px-4 dark:text-white text-black">
                    {service.description}
                  </td>
                  <td className="py-4 px-4 dark:text-white text-black">
                    {service.duration}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleEdit(service)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(service.serviceID)}
                      className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      <MdOutlineDelete />
                    </button>
                  </td>
                </tr>
                {editingServiceID === service.serviceID && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-4 px-4 bg-gray-100 text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                    >
                      <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium">
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

export default Services;
