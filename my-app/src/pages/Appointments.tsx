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
        'https://api.studio-linda.com/api/Appointment',
      );
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchServicesList = async () => {
    try {
      const response = await axios.get(
        'https://api.studio-linda.com/api/Service',
      );

      // Directly use response.data since it's already an array
      const services = Array.isArray(response.data) ? response.data : [];
      console.log('Fetched Services:', services);

      // Save to state
      setServicesList(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      setServicesList([]); // Ensure services list is an empty array on error
    }
  };

  const fetchStaffList = async () => {
    try {
      const response = await axios.get(
        'https://api.studio-linda.com/api/User/staff',
      );
      console.log('Fetched Staff:', response.data); // Debug the structure
      setStaffList(response.data);
    } catch (error) {
      console.error('Error fetching staff:', error);
      setStaffList([]); // Fallback to an empty list in case of an error
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
  //UserID: localStorage.getItem('userId'),

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      client: {
        firstName: newAppointment.firstName,
        lastName: newAppointment.lastName,
        phoneNumber: newAppointment.phoneNumber,
        email: newAppointment.email,
      },
      appointmentID: newAppointment.appointmentID || 0, // Include this if required
      userID: newAppointment.userID,
      serviceID: newAppointment.serviceID,
      appointmentDate: newAppointment.appointmentDate,
      status: newAppointment.status,
      notes: newAppointment.notes,
    };

    console.log('Payload being sent to the backend:', payload);

    try {
      const response = await axios.post(
        'https://api.studio-linda.com/api/Appointment',
        payload,
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
      console.error(
        'Error adding appointment:',
        error.response?.data || error.message,
      );
    }
  };

  const handleEdit = (appt: any) => {
    if (editingRowId === appt.appointmentID) {
      // Cancel edit mode if clicking the same edit button again
      setEditingRowId(null);
      setEditFormData({
        appointmentID: appt.appointmentID,
        firstName: appt.client?.firstName || '',
        lastName: appt.client?.lastName || '',
        phoneNumber: appt.client?.phoneNumber || '',
        email: appt.client?.email || '',
        userID: appt.userID || '',
        serviceID: appt.serviceID || '',
        appointmentDate: appt.appointmentDate || '',
        status: appt.status || 'pa përfunduar',
        notes: appt.notes || '',
      });
    } else {
      const service = servicesList.find(
        (service) => service.serviceName === appt.serviceName,
      );
      const staff = staffList.find(
        (staff) => `${staff.firstName} ${staff.lastName}` === appt.staffName,
      );

      const isValidDate =
        appt.appointmentDate &&
        !isNaN(new Date(appt.appointmentDate).getTime());

      // Set form data for editing, including picked service and staff
      setEditingRowId(appt.appointmentID);
      setEditFormData({
        appointmentID: appt.appointmentID,
        firstName: appt.client?.firstName || '',
        lastName: appt.client?.lastName || '',
        phoneNumber: appt.client?.phoneNumber || '',
        email: appt.client?.email || '',
        serviceID: service?.serviceID || '',
        userID: staff?.userID || '',
        appointmentDate: isValidDate
          ? new Date(appt.appointmentDate).toISOString().slice(0, 16)
          : '',
        status: appt.status || 'pa përfunduar',
        notes: appt.notes || '',
      });
      console.log('Submit appointment:', appt);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      client: {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        phoneNumber: editFormData.phoneNumber,
        email: editFormData.email,
      },
      appointmentID: editFormData.appointmentID,
      userID: editFormData.userID,
      serviceID: Number(editFormData.serviceID),
      appointmentDate: editFormData.appointmentDate,
      status: editFormData.status,
      notes: editFormData.notes,
    };

    console.log('Sending payload to backend:', payload);

    try {
      // API call to update the appointment
      const response = await axios.put(
        `https://api.studio-linda.com/api/Appointment/${editFormData.appointmentID}`,
        payload,
      );

      console.log('Response from backend:', response.data);

      // Update the appointments state
      setAppointments((prevAppointments) =>
        prevAppointments.map((appt) =>
          appt.appointmentID === response.data.appointmentID
            ? { ...appt, ...response.data }
            : appt,
        ),
      );

      // Reset edit form data and close edit mode
      setEditingRowId(null);
      setEditFormData({
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

      console.log('Appointment updated successfully.');
    } catch (error) {
      console.error('Error while editing appointment:', error);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`https://api.studio-linda.com/api/Appointment/${id}`);
      setAppointments((prev) =>
        prev.filter((appt) => appt.appointmentID !== id),
      );
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (
      !appt.appointmentDate ||
      isNaN(new Date(appt.appointmentDate).getTime())
    ) {
      console.warn(`Invalid appointment date for ID: ${appt.appointmentID}`);
      return false;
    }

    // Ensure edited appointments are included based on their updated date
    return (
      new Date(appt.appointmentDate).toISOString().split('T')[0] ===
      selectedDate
    );
  });

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
          Terminet
        </h1>
        <div className="flex items-center">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border rounded-md mr-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
          />
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            {showForm ? 'X' : 'Shto Terminin'}
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4 ">
            <div>
              <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Emri i Klientit
              </label>
              <input
                type="text"
                name="firstName"
                value={newAppointment.firstName}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Mbiemri i Klientit
              </label>
              <input
                type="text"
                name="lastName"
                value={newAppointment.lastName}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Numri i Klientit
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={newAppointment.phoneNumber}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Email i Klientit
              </label>
              <input
                type="email"
                name="email"
                value={newAppointment.email}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div>
              <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Shërbimi
              </label>
              <select
                name="serviceID"
                value={newAppointment.serviceID}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full"
                required
              >
                <option value="">Zgjedh Shërbimin</option>
                {servicesList.map((service) => (
                  <option key={service.serviceID} value={service.serviceID}>
                    {service.serviceName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Stafi
              </label>
              <select
                name="userID"
                value={newAppointment.userID}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                required
              >
                <option value="">Zgjedh Stafin</option>
                {staffList.map((staff) => (
                  <option key={staff.userID} value={staff.userID}>
                    {staff.firstName} {staff.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Data e Terminit
              </label>
              <input
                type="datetime-local"
                name="appointmentDate"
                value={newAppointment.appointmentDate}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                required
              />
            </div>
            <div>
              <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Statusi i Terminit
              </label>
              <select
                name="status"
                value={newAppointment.status}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                required
              >
                <option value="pa përfunduar">Pa Përfunduar</option>
                <option value="përfunduar">Përfunduar</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Shënime
              </label>
              <textarea
                name="notes"
                value={newAppointment.notes}
                onChange={handleInputChange}
                className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Shto Terminin
          </button>
        </form>
      )}

      <div className="max-w-full overflow-x-auto mt-6 ">
        <table className="w-full table-auto text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
          <thead className="bg-gray-200 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
            <tr>
              <th className="py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Klienti
              </th>
              <th className="py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Numri i Klientit
              </th>
              <th className="py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Email i Klientit
              </th>
              <th className="py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Shërbimi
              </th>
              <th className="py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Stafi
              </th>
              <th className="py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Data
              </th>
              <th className="py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Statusi
              </th>
              <th className="py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Shënimet
              </th>
              <th className="py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                Veptimet
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appt) => (
              <React.Fragment key={appt.appointmentID}>
                <tr>
                  <td className="py-3 px-4 ">
                    {appt.client?.firstName} {appt.client?.lastName}
                  </td>
                  <td className="py-3 px-4">{appt.client?.phoneNumber}</td>
                  <td className="py-3 px-4">{appt.client?.email}</td>
                  <td className="py-3 px-4">{appt.serviceName}</td>
                  <td className="py-3 px-4">{appt.staffName || 'No Staff'}</td>

                  <td className="py-3 px-4">
                    {new Date(appt.appointmentDate).toLocaleString()}
                  </td>
                  <td className="py-3 px-4">{appt.status}</td>
                  <td className="py-3 px-4">{appt.notes}</td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2 sm:justify-center">
                      <button
                        onClick={() => handleEdit(appt)}
                        className="bg-blue-500 text-white rounded-md px-4 py-2 text-base sm:px-4 sm:py-2 sm:text-sm"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(appt.appointmentID)}
                        className="bg-red-500 text-white rounded-md px-4 py-2 text-base sm:px-4 sm:py-2 sm:text-sm"
                      >
                        <MdOutlineDelete />
                      </button>
                    </div>
                  </td>
                </tr>
                {editingRowId === appt.appointmentID && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-4 px-4 bg-gray-100 text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                    >
                      <form onSubmit={handleEditSubmit}>
                        <div className="grid grid-cols-2 gap-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                          {/* First Name */}
                          <div>
                            <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Emri i Klientit
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={editFormData.firstName}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                              required
                            />
                          </div>

                          {/* Last Name */}
                          <div>
                            <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Mbiemri i Klientit
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={editFormData.lastName}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                              required
                            />
                          </div>

                          {/* Phone Number */}
                          <div>
                            <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Numri i Klientit
                            </label>
                            <input
                              type="text"
                              name="phoneNumber"
                              value={editFormData.phoneNumber}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                              required
                            />
                          </div>

                          {/* Email */}
                          <div>
                            <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Email i Klientit
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={editFormData.email}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                            />
                          </div>

                          {/* Service */}
                          <div>
                            <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Shërbimi
                            </label>
                            <select
                              name="serviceID"
                              value={editFormData.serviceID || ''} // Ensure the correct value is set
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                              required
                            >
                              <option value="">Zhgjedh Shërbimin</option>
                              {servicesList.map((service) => (
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
                            <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Stafi
                            </label>
                            <select
                              name="userID"
                              value={editFormData.userID || ''} // Ensure the correct value is set
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                              required
                            >
                              <option value="">Zgjedh Stafin</option>
                              {staffList.map((staff) => (
                                <option key={staff.userID} value={staff.userID}>
                                  {staff.firstName} {staff.lastName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Data e Terminit
                            </label>
                            <input
                              type="datetime-local"
                              name="appointmentDate"
                              value={editFormData.appointmentDate}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                              required
                            />
                          </div>

                          {/* Status */}
                          <div>
                            <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Statusi
                            </label>
                            <select
                              name="status"
                              value={editFormData.status}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
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
                            <label className="block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Shënimet
                            </label>
                            <textarea
                              name="notes"
                              value={editFormData.notes}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                            />
                          </div>
                        </div>

                        {/* Save Changes Button */}
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

export default Appointments;
