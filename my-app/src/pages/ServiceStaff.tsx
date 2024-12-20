import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';

const ServiceStaff = () => {
  const [serviceStaffList, setServiceStaffList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newServiceStaff, setNewServiceStaff] = useState({
    serviceStaffID: null,
    userID: '',
    serviceID: '',
    appointmentID: '',
    percentage: 0,
    amountEarned: 0,
    dateProvided: '',
  });
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    serviceStaffID: null,
    userID: '',
    serviceID: '',
    appointmentID: '',
    percentage: 0,
    amountEarned: 0,
    dateProvided: '',
  });
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios
      .get('https://localhost:7158/api/ServiceStaff')
      .then((response) => {
        setServiceStaffList(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching service staff!', error);
      });

    axios.get('https://localhost:7158/api/User').then((response) => {
      setUsers(response.data.filter((user: any) => user.roleID === 3)); // Staff only
    });

    axios.get('https://localhost:7158/api/Service').then((response) => {
      setServices(response.data);
    });

    axios.get('https://localhost:7158/api/Appointment').then((response) => {
      setAppointments(response.data);
    });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setNewServiceStaff((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...newServiceStaff };

    if (editingRowId) {
      axios
        .put(`https://localhost:7158/api/ServiceStaff/${editingRowId}`, payload)
        .then((response) => {
          setServiceStaffList((prev) =>
            prev.map((item) =>
              item.serviceStaffID === editingRowId ? response.data : item,
            ),
          );
          resetForm();
        })
        .catch((error) => {
          console.error(
            'There was an error updating the service staff!',
            error,
          );
        });
    } else {
      axios
        .post('https://localhost:7158/api/ServiceStaff', payload)
        .then((response) => {
          setServiceStaffList([...serviceStaffList, response.data]);
          resetForm();
        })
        .catch((error) => {
          console.error(
            'There was an error creating the service staff!',
            error,
          );
        });
    }
  };

  const handleEdit = (serviceStaff: any) => {
    if (editingRowId === serviceStaff.serviceStaffID) {
      resetForm();
    } else {
      setEditingRowId(serviceStaff.serviceStaffID);
      setEditFormData({ ...serviceStaff });
    }
  };

  const handleDelete = (serviceStaffID: number) => {
    axios
      .delete(`https://localhost:7158/api/ServiceStaff/${serviceStaffID}`)
      .then(() => {
        setServiceStaffList((prev) =>
          prev.filter((item) => item.serviceStaffID !== serviceStaffID),
        );
      })
      .catch((error) => {
        console.error('There was an error deleting the service staff!', error);
      });
  };

  const resetForm = () => {
    setNewServiceStaff({
      serviceStaffID: null,
      userID: '',
      serviceID: '',
      appointmentID: '',
      percentage: 0,
      amountEarned: 0,
      dateProvided: '',
    });
    setEditingRowId(null);
    setShowForm(false);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold dark:text-white text-blue-900">
          Service Staff Management
        </h1>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {showForm ? 'Close Form' : 'Add Service Staff'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Staff Member
              </label>
              <select
                name="userID"
                value={newServiceStaff.userID}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border rounded-md w-full"
              >
                <option value="">Select Staff</option>
                {users.map((user: any) => (
                  <option key={user.userID} value={user.userID}>
                    {user.firstName} {user.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Service
              </label>
              <select
                name="serviceID"
                value={newServiceStaff.serviceID}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border rounded-md w-full"
              >
                <option value="">Select Service</option>
                {services.map((service: any) => (
                  <option key={service.serviceID} value={service.serviceID}>
                    {service.serviceName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Appointment
              </label>
              <select
                name="appointmentID"
                value={newServiceStaff.appointmentID}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border rounded-md w-full"
              >
                <option value="">Select Appointment</option>
                {appointments.map((appointment: any) => (
                  <option
                    key={appointment.appointmentID}
                    value={appointment.appointmentID}
                  >
                    {appointment.date}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Percentage
              </label>
              <input
                type="number"
                name="percentage"
                value={newServiceStaff.percentage}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border rounded-md w-full"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
          >
            {editingRowId ? 'Update' : 'Add'}
          </button>
        </form>
      )}

      <div className="overflow-x-auto mt-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Staff</th>
              <th className="py-2 px-4">Service</th>
              <th className="py-2 px-4">Appointment</th>
              <th className="py-2 px-4">Percentage</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {serviceStaffList.map((item) => (
              <React.Fragment key={item.serviceStaffID}>
                <tr>
                  <td className="py-2 px-4">
                    {item.user.firstName} {item.user.lastName}
                  </td>
                  <td className="py-2 px-4">{item.service.serviceName}</td>
                  <td className="py-2 px-4">{item.appointment.date}</td>
                  <td className="py-2 px-4">{item.percentage}%</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleEdit(item)}
                      className="mr-2 px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item.serviceStaffID)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      <MdOutlineDelete />
                    </button>
                  </td>
                </tr>
                {editingRowId === item.serviceStaffID && (
                  <tr>
                    <td colSpan={5}>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Edit form fields */}
                        <button
                          type="submit"
                          className="px-4 py-2 bg-green-500 text-white rounded-md"
                        >
                          Save
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

export default ServiceStaff;
