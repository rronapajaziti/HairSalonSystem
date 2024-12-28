import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';

const Appointments = () => {
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [appointment, setAppointment] = useState({
    appointmentID: null,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    userID: '',
    serviceID: '',
    appointmentDate: '',
    status: '',
    notes: '',
  });

  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  // Fetch appointments, staff list, and services on component mount
  useEffect(() => {
    fetchAppointments();
    fetchStaffList();
    fetchServicesList();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        'https://localhost:7158/api/Appointment',
      );
      setAppointments(response.data);
    } catch (error) {
      console.error('There was a problem fetching appointments:', error);
    }
  };

  const fetchStaffList = async () => {
    try {
      const response = await axios.get('https://localhost:7158/api/User/staff');
      setStaffList(response.data);
    } catch (error) {
      console.error('There was a problem fetching staff:', error);
    }
  };

  const fetchServicesList = async () => {
    try {
      const response = await axios.get('https://localhost:7158/api/Service');
      setServicesList(response.data);
    } catch (error) {
      console.error('There was a problem fetching services:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started.');

    const payload = {
      appointmentID: appointment.appointmentID || 0,
      client: {
        firstName: appointment.firstName,
        lastName: appointment.lastName,
        phoneNumber: appointment.phoneNumber,
        email: appointment.email || null,
      },
      userID: parseInt(appointment.userID, 10),
      serviceID: parseInt(appointment.serviceID, 10),
      appointmentDate: new Date(appointment.appointmentDate).toISOString(),
      status: appointment.status,
      notes: appointment.notes,
    };

    try {
      if (appointment.appointmentID) {
        await axios.put(
          `https://localhost:7158/api/Appointment/${appointment.appointmentID}`,
          payload,
        );
        console.log('Appointment updated successfully.');
      } else {
        await axios.post('https://localhost:7158/api/Appointment', payload);
        console.log('Appointment added successfully.');
      }

      fetchAppointments();

      // Sync ServiceStaff data
      await axios.post(
        'https://localhost:7158/api/ServiceStaff/sync-from-appointment',
        payload,
      );

      window.dispatchEvent(new CustomEvent('dataUpdated')); // Notify ServiceStaff
      console.log('Closing the form...');
      setShowForm(false); // Close the form after saving

      // Reset appointment form
      setAppointment({
        appointmentID: null,
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        userID: '',
        serviceID: '',
        appointmentDate: '',
        status: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error creating/updating appointment:', error);
    }
  };

  const handleDelete = async (appointmentID: number) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await axios.delete(
          `https://localhost:7158/api/Appointment/${appointmentID}`,
        );
        fetchAppointments();
        window.dispatchEvent(new CustomEvent('dataUpdated')); // Notify updates
        console.log('Appointment deleted successfully.');
      } catch (error) {
        console.error('Error deleting appointment:', error);
      }
    }
  };

  const handleEditClick = (appt: any) => {
    setEditingRowId(appt.appointmentID);
    setAppointment({
      appointmentID: appt.appointmentID,
      firstName: appt.client?.firstName || '',
      lastName: appt.client?.lastName || '',
      phoneNumber: appt.client?.phoneNumber || '',
      email: appt.client?.email || '',
      userID: appt.userID,
      serviceID: appt.serviceID,
      appointmentDate: appt.appointmentDate,
      status: appt.status,
      notes: appt.notes,
    });
    setShowForm(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Appointments</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setAppointment({
              appointmentID: null,
              firstName: '',
              lastName: '',
              phoneNumber: '',
              email: '',
              userID: '',
              serviceID: '',
              appointmentDate: '',
              status: '',
              notes: '',
            });
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? 'Close Form' : 'Add Appointment'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          <div>
            <label className="block font-medium">Client First Name</label>
            <input
              type="text"
              name="firstName"
              value={appointment.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium">Client Last Name</label>
            <input
              type="text"
              name="lastName"
              value={appointment.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={appointment.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={appointment.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium">Service</label>
            <select
              name="serviceID"
              value={appointment.serviceID}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Service</option>
              {servicesList.map((service: any) => (
                <option key={service.serviceID} value={service.serviceID}>
                  {service.serviceName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Staff</label>
            <select
              name="userID"
              value={appointment.userID}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="">Select Staff</option>
              {staffList.map((staff: any) => (
                <option key={staff.userID} value={staff.userID}>
                  {staff.firstName} {staff.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium">Appointment Date</label>
            <input
              type="datetime-local"
              name="appointmentDate"
              value={appointment.appointmentDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium">Status</label>
            <input
              type="text"
              name="status"
              value={appointment.status}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block font-medium">Notes</label>
            <textarea
              name="notes"
              value={appointment.notes}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              {appointment.appointmentID
                ? 'Update Appointment'
                : 'Add Appointment'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Service</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Staff</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt: any) => (
              <tr key={appt.appointmentID}>
                <td className="py-3 px-4">
                  {appt.client
                    ? `${appt.client.firstName} ${appt.client.lastName}`
                    : 'No Client'}
                </td>
                <td className="py-3 px-4">
                  {appt.serviceName || 'Unknown Service'}
                </td>
                <td className="py-3 px-4">
                  {new Date(appt.appointmentDate).toLocaleString()}
                </td>
                <td className="py-3 px-4">{appt.staffName || 'No Staff'}</td>
                <td className="py-3 px-4">{appt.status}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleEditClick(appt)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(appt.appointmentID)}
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

export default Appointments;
