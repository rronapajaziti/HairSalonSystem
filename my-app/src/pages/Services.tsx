import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';

const API_BASE_URL = 'https://localhost:7158/api/Service';

const Services = () => {
  const [services, setServices] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formState, setFormState] = useState({
    serviceID: 0,
    serviceName: '',
    description: '',
    price: '',
    duration: '',
    staffEarningPercentage: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setServices(response.data);
    } catch (error) {
      console.error('Gabim gjatë marrjes së të dhënave për shërbimet:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]:
        name === 'price' ||
        name === 'duration' ||
        name === 'staffEarningPercentage'
          ? parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && formState.serviceID !== null) {
      await updateService();
    } else {
      await addService();
    }
  };

  const addService = async () => {
    try {
      const response = await axios.post(API_BASE_URL, formState);
      setServices((prev) => [...prev, response.data]);
      resetForm();
    } catch (error) {
      console.error('Gabim gjatë krijimit të shërbimit:', error);
    }
  };

  const updateService = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/${formState.serviceID}`,
        formState,
      );
      setServices((prev) =>
        prev.map((service) =>
          service.serviceID === formState.serviceID ? response.data : service,
        ),
      );
      resetForm();
    } catch (error) {
      console.error('Gabim gjatë përditësimit të shërbimit:', error);
    }
  };

  const handleDelete = async (serviceID: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/${serviceID}`);
      setServices((prev) =>
        prev.filter((service) => service.serviceID !== serviceID),
      );
    } catch (error) {
      console.error('Gabim gjatë fshirjes së shërbimit:', error);
    }
  };

  const handleEdit = (service: any) => {
    setIsEditing(true); // Enable editing mode
    setShowForm(true); // Show the form for editing
    setFormState({
      serviceID: service.serviceID,
      serviceName: service.serviceName,
      description: service.description,
      price: service.price,
      duration: service.duration,
      staffEarningPercentage: service.staffEarningPercentage, // Include the percentage in the form state
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setShowForm(false);
    setFormState({
      serviceID: 0,
      serviceName: '',
      description: '',
      price: '',
      duration: '',
      staffEarningPercentage: '',
    });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold dark:text-white text-blue-900">
          Shërbimet
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {showForm ? 'Anulo' : 'Shto Shërbimin'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Emri i Shërbimit
              </label>
              <input
                type="text"
                name="serviceName"
                value={formState.serviceName}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border border-gray-300 text-black rounded-md w-full dark:text-white dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Përshkrimi
              </label>
              <textarea
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border text-black border-gray-300 rounded-md w-full dark:text-white dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Çmimi
              </label>
              <input
                type="number"
                name="price"
                value={formState.price}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border text-black border-gray-300 rounded-md w-full dark:text-white dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Kohëzgjatja (minuta)
              </label>
              <input
                type="number"
                name="duration"
                value={formState.duration}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border text-black border-gray-300 rounded-md w-full dark:text-white dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Përqindja për Stafin (%)
              </label>
              <input
                type="number"
                name="staffEarningPercentage"
                value={formState.staffEarningPercentage}
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
            {isEditing ? 'Përditëso' : 'Shto'}
          </button>
        </form>
      )}

      <div className="max-w-full overflow-x-auto mt-6">
        <table className="w-full table-auto dark:border-strokedark dark:bg-boxdark">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-4 px-4 text-blue-900">Shërbimi</th>
              <th className="py-4 px-4 text-blue-900">Çmimi</th>
              <th className="py-4 px-4 text-blue-900">Përshkrimi</th>
              <th className="py-4 px-4 text-blue-900">Kohëzgjatja</th>
              <th className="py-4 px-4 text-blue-900">Përqindja e Stafit</th>
              <th className="py-4 px-4 text-blue-900">Veprimet</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.serviceID}>
                <td className="py-4 px-4 text-black dark:text-white">
                  {service.serviceName}
                </td>
                <td className="py-4 px-4 text-black dark:text-white">
                  {service.price}
                </td>
                <td className="py-4 px-4 text-black dark:text-white">
                  {service.description}
                </td>
                <td className="py-4 px-4 text-black dark:text-white">
                  {service.duration}
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
                    onClick={() => handleDelete(service.serviceID)}
                    className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
                  >
                    <MdOutlineDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;
