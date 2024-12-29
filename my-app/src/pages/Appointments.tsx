import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';

const Appointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const [showForm, setShowForm] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);

  const [newAppointment, setNewAppointment] = useState({
    appointmentID: null,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    userID: '',
    serviceID: '',
    appointmentDate: '',
    status: 'pa përfunduar',
    notes: '',
  });

  const [editFormData, setEditFormData] = useState({
    appointmentID: null,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    userID: '',
    serviceID: '',
    appointmentDate: '',
    status: 'pa përfunduar',
    notes: '',
  });

  useEffect(() => {
    fetchAppointments();
    fetchServicesList();
    fetchStaffList();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        'https://localhost:7158/api/Appointment',
      );
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchServicesList = async () => {
    try {
      const response = await axios.get('https://localhost:7158/api/Service');
      setServicesList(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchStaffList = async () => {
    try {
      const response = await axios.get('https://localhost:7158/api/User/staff');
      setStaffList(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setNewAppointment({
      ...newAppointment,
      [name]: value,
    });
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://localhost:7158/api/Appointment',
        newAppointment,
      );
      setAppointments([...appointments, response.data]);
      setShowForm(false);
      setNewAppointment({
        appointmentID: null,
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        userID: '',
        serviceID: '',
        appointmentDate: '',
        status: 'pa përfunduar',
        notes: '',
      });
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://localhost:7158/api/Appointment/${editFormData.appointmentID}`,
        editFormData,
      );
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.appointmentID === editFormData.appointmentID
            ? response.data
            : appt,
        ),
      );
      setEditingRowId(null);
    } catch (error) {
      console.error('Error editing appointment:', error);
    }
  };

  const handleEdit = (appt: any) => {
    if (editingRowId === appt.appointmentID) {
      setEditingRowId(null);
    } else {
      const service = servicesList.find(
        (service) => service.serviceName === appt.serviceName,
      );
      const staff = staffList.find(
        (staff) => `${staff.firstName} ${staff.lastName}` === appt.staffName,
      );

      setEditingRowId(appt.appointmentID);
      setEditFormData({
        appointmentID: appt.appointmentID,
        firstName: appt.client?.firstName || '',
        lastName: appt.client?.lastName || '',
        phoneNumber: appt.client?.phoneNumber || '',
        email: appt.client?.email || '',
        serviceID: service?.serviceID || '',
        userID: staff?.userID || '',
        appointmentDate: new Date(appt.appointmentDate)
          .toISOString()
          .slice(0, 16),
        status: appt.status || 'pa përfunduar',
        notes: appt.notes || '',
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://localhost:7158/api/Appointment/${id}`);
      setAppointments((prev) =>
        prev.filter((appt) => appt.appointmentID !== id),
      );
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const filteredAppointments = appointments.filter((appt) =>
    new Date(appt.appointmentDate).toISOString().startsWith(selectedDate),
  );

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-blue-900">Appointments</h1>
        <div className="flex items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border rounded-md mr-4"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {showForm ? 'Close Form' : 'Add Appointment'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={newAppointment.firstName}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={newAppointment.lastName}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={newAppointment.phoneNumber}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={newAppointment.email}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full"
              />
            </div>
            <div>
              <label className="block font-medium">Service</label>
              <select
                name="serviceID"
                value={newAppointment.serviceID}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full"
                required
              >
                <option value="">Select Service</option>
                {servicesList.map((service) => (
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
                value={newAppointment.userID}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full"
                required
              >
                <option value="">Select Staff</option>
                {staffList.map((staff) => (
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
                value={newAppointment.appointmentDate}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full"
                required
              />
            </div>
            <div>
              <label className="block font-medium">Status</label>
              <select
                name="status"
                value={newAppointment.status}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full"
                required
              >
                <option value="pa përfunduar">Pa Përfunduar</option>
                <option value="përfunduar">Përfunduar</option>
              </select>
            </div>
            <div>
              <label className="block font-medium">Notes</label>
              <textarea
                name="notes"
                value={newAppointment.notes}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Save Appointment
          </button>
        </form>
      )}

      <div className="max-w-full overflow-x-auto mt-6">
        <table className="w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4">Client</th>
              <th className="py-3 px-4">Phone Number</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Service</th>
              <th className="py-3 px-4">Staff</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Notes</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appt) => (
              <React.Fragment key={appt.appointmentID}>
                <tr>
                  <td className="py-3 px-4">
                    {appt.client?.firstName} {appt.client?.lastName}
                  </td>
                  <td className="py-3 px-4">{appt.client?.phoneNumber}</td>
                  <td className="py-3 px-4">{appt.client?.email}</td>
                  <td className="py-3 px-4">{appt.serviceName}</td>
                  <td className="py-3 px-4">
                    {appt.staffName
                      ? `${appt.staffName.firstName} ${appt.staffName.lastName}`
                      : 'No Staff'}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(appt.appointmentDate).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">{appt.status}</td>
                  <td className="py-3 px-4">{appt.notes}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleEdit(appt)}
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
                {editingRowId === appt.appointmentID && (
                  <tr>
                    <td colSpan={9} className="py-4 px-4 bg-gray-100">
                      <form onSubmit={handleEditSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                          {/* First Name */}
                          <div>
                            <label className="block font-medium">
                              First Name
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={editFormData.firstName}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full"
                              required
                            />
                          </div>

                          {/* Last Name */}
                          <div>
                            <label className="block font-medium">
                              Last Name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={editFormData.lastName}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full"
                              required
                            />
                          </div>

                          {/* Phone Number */}
                          <div>
                            <label className="block font-medium">
                              Phone Number
                            </label>
                            <input
                              type="text"
                              name="phoneNumber"
                              value={editFormData.phoneNumber}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full"
                              required
                            />
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block font-medium">Email</label>
                            <input
                              type="email"
                              name="email"
                              value={editFormData.email}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full"
                            />
                          </div>

                          {/* Service */}
                          <div>
                            <label className="block font-medium">Service</label>
                            <select
                              name="serviceID"
                              value={editFormData.serviceID || ''} // Bind the selected value
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full"
                              required
                            >
                              <option value="">Select Service</option>
                              {servicesList.map((service) => (
                                <option
                                  key={service.serviceID}
                                  value={service.serviceID} // ID of the service
                                >
                                  {service.serviceName} {/* Name displayed */}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block font-medium">Staff</label>
                            <select
                              name="userID"
                              value={editFormData.userID || ''} // Bind the selected value
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full"
                              required
                            >
                              <option value="">Select Staff</option>
                              {staffList.map((staff) => (
                                <option
                                  key={staff.userID}
                                  value={staff.userID} // ID of the staff member
                                >
                                  {staff.firstName} {staff.lastName}{' '}
                                  {/* Name displayed */}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Appointment Date */}
                          <div>
                            <label className="block font-medium">
                              Appointment Date
                            </label>
                            <input
                              type="datetime-local"
                              name="appointmentDate"
                              value={editFormData.appointmentDate}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full"
                              required
                            />
                          </div>

                          {/* Status */}
                          <div>
                            <label className="block font-medium">Status</label>
                            <select
                              name="status"
                              value={editFormData.status}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full"
                              required
                            >
                              <option value="pa përfunduar">
                                Pa Përfunduar
                              </option>
                              <option value="përfunduar">Përfunduar</option>
                            </select>
                          </div>

                          {/* Notes */}
                          <div className="col-span-2">
                            <label className="block font-medium">Notes</label>
                            <textarea
                              name="notes"
                              value={editFormData.notes}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full"
                            />
                          </div>
                        </div>

                        {/* Save Changes Button */}
                        <button
                          type="submit"
                          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                          Save Changes
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

export default Appointments;
