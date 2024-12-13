import React, { useState, useEffect } from 'react';
import axios from 'axios';

type ServiceType = {
  serviceID: number;
  serviceName: string;
  description: string;
  price: number;
  duration: number;
};

type NewServiceType = {
  serviceName: string;
  description: string;
  price: number;
  duration: number;
};

const Services = () => {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [newService, setNewService] = useState<NewServiceType>({
    serviceName: '',
    description: '',
    price: 0,
    duration: 0,
  });
  const [showForm, setShowForm] = useState<boolean>(false);

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
    setNewService((prevService) => ({
      ...prevService,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post('https://localhost:7158/api/Service', newService)
      .then((response) => {
        setServices((prev) => [...prev, response.data]);
        setShowForm(false);
        setNewService({
          serviceName: '',
          description: '',
          price: 0,
          duration: 0,
        });
      })
      .catch((error) => {
        console.error('There was an error creating the service!', error);
      });
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6  ">
        <h1 className="text-3xl font-semibold text-blue-900 dark:text-white mb-6">
          Shërbimet
        </h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {showForm ? 'X' : 'Shto Shërbimin'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-white"
                htmlFor="serviceName"
              >
                Emri i Shërbimit
              </label>
              <input
                type="text"
                id="serviceName"
                name="serviceName"
                placeholder="Service Name"
                value={newService.serviceName}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-md w-full  dark:text-white dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-white"
                htmlFor="description"
              >
                Përshkrimi
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Service Description"
                value={newService.description}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-md w-full dark:text-white dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-white"
                htmlFor="price"
              >
                Çmimi
              </label>
              <input
                type="number"
                id="price"
                name="price"
                placeholder="Price"
                value={newService.price}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-md w-full  dark:text-white dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-white"
                htmlFor="duration"
              >
                Kohëzgjatja (minuta)
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                placeholder="Duration"
                value={newService.duration}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border border-gray-300 rounded-md w-full dark:text-white dark:border-strokedark dark:bg-boxdark"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4 ml-auto block mb-5"
          >
            Shto Shërbimin
          </button>
        </form>
      )}

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto dark:border-strokedark dark:bg-boxdark ">
          <thead className="">
            <tr className="bg-gray-2 text-left dark:bg-meta-4 ">
              <th className="min-w-[220px] py-4 px-4   text-blue-900 dark:text-white xl:pl-11 dark:border-strokedark dark:bg-boxdark">
                Sherbimi
              </th>
              <th className="min-w-[150px] py-4 px-4  text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Cmimi
              </th>
              <th className="min-w-[120px] py-4 px-4  text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Përshkrimi
              </th>
              <th className="min-w-[120px] py-4 px-4  text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Kohëzgjatja
              </th>
              <th className="py-4 px-4   text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Aksionet
              </th>
            </tr>
          </thead>
          <tbody>
            {services.length > 0 ? (
              services.map((service) => (
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
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                      Edit
                    </button>
                    <button className="ml-2 px-4 py-2 bg-blue-400 text-white rounded-md">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-4 px-4 text-black dark:text-white"
                >
                  No services available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Services;
