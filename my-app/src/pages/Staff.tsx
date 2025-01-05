import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';

const Staff = ({ searchQuery }: { searchQuery: string }) => { 
  const [staffList, setStaffList] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newStaff, setNewStaff] = useState({
    id: null,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    roleID: 3,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingRowId, setEditingRowId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    id: null,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    roleID: 3,
  });

  useEffect(() => {
    axios
      .get('https://localhost:7158/api/User')
      .then((response) => {
        const filteredStaff = response.data.map((staff: any) => ({
          ...staff,
          id: staff.userID,
        }));
        console.log('Filtered Staff:', filteredStaff);
        setStaffList(filteredStaff);
      })
      .catch((error) => {
        console.error('There was an error fetching staff!', error);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStaff({
      ...newStaff,
      [name]: value,
    });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: name === 'roleID' ? parseInt(value, 10) : value, // Parse roleID as number
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      userID: 0,
      firstName: newStaff.firstName,
      lastName: newStaff.lastName,
      phoneNumber: newStaff.phoneNumber,
      email: newStaff.email,
      passwordHash: newStaff.password,
      passwordSalt: 'defaultSalt',
      roleID: newStaff.roleID,
    };

    axios
      .post('https://localhost:7158/api/User/register', payload)
      .then((response) => {
        setStaffList([...staffList, response.data]);
        setShowForm(false);
        setNewStaff({
          id: null,
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          password: '',
          roleID: 3,
        });

        window.dispatchEvent(new CustomEvent('staffListUpdated'));
      })

      .catch((error) => {
        console.error(error.response?.data || error.message);
      });
  };

  const handleEdit = (staff: any) => {
    if (editingRowId === staff.id) {
      setEditingRowId(null);
    } else {
      setEditingRowId(staff.id);
      setEditFormData({
        id: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        phoneNumber: staff.phoneNumber,
        email: staff.email,
        password: '',
        roleID: staff.roleID,
      });
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      userID: editFormData.id,
      firstName: editFormData.firstName,
      lastName: editFormData.lastName,
      phoneNumber: editFormData.phoneNumber,
      email: editFormData.email,
      roleID: editFormData.roleID,
      passwordHash: editFormData.password
        ? editFormData.password
        : 'defaultPasswordHash',
      passwordSalt: editFormData.password
        ? editFormData.password
        : 'defaultPasswordSalt',
    };

    console.log('Submitting payload to backend:', payload);

    axios
      .put(`https://localhost:7158/api/User/${payload.userID}`, payload)
      .then((response) => {
        setStaffList((prev) =>
          prev.map((staff) =>
            staff.id === payload.userID
              ? { ...staff, ...response.data }
              : staff,
          ),
        );
        setEditingRowId(null);
      })
      .catch((error) => {
        console.error(
          'There was an error updating the staff!',
          error.response?.data || error.message,
        );
        console.log('Validation errors:', error.response?.data?.errors || {});
      });
  };

  const handleDelete = (id: number) => {
    if (!id) return;
    axios
      .delete(`https://localhost:7158/api/User/${id}`)
      .then(() => {
        setStaffList((prev) => prev.filter((staff) => staff.id !== id));
        console.log(`Deleted user with ID: ${id}`);
      })
      .catch((error) => {
        console.error(
          'There was an error deleting the staff!',
          error.response?.data || error.message,
        );
      });
  };

  const filteredStaff = staffList.filter((staff) =>
    `${staff.firstName} ${staff.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold dark:text-white text-blue-900">Staff</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setIsEditing(false);
            setNewStaff({
              id: null,
              firstName: '',
              lastName: '',
              phoneNumber: '',
              email: '',
              password: '',
              roleID: 3,
            });
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {showForm ? 'X' : 'Shto Stafin'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Emri
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={newStaff.firstName}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border text-black border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Mbiemri
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={newStaff.lastName}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border text-black border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Numri i telefonit
              </label>
              <input
                type="text"
                name="phoneNumber"
                placeholder="Phone Number"
                value={newStaff.phoneNumber}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border text-black border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={newStaff.email}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border text-black border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={newStaff.password}
                onChange={handleInputChange}
                required
                className="px-4 py-2 border text-black border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"
              />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md mt-4"
          >
            {isEditing ? 'Update Staff' : 'Shto '}
          </button>
        </form>
      )}

      <div className="max-w-full overflow-x-auto mt-6">
        <table className="w-full table-auto dark:border-strokedark dark:bg-boxdark">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Emri dhe Mbiemri
              </th>
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Numri i telefonit
              </th>
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Email
              </th>
              <th className="py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark">
                Veprimet
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((staff) => (
              <React.Fragment key={staff.id}>
                <tr>
                  <td className="py-4 px-4 dark:text-white text-black">
                    {staff.firstName} {staff.lastName}
                  </td>
                  <td className="py-4 px-4 dark:text-white text-black">
                    {staff.phoneNumber}
                  </td>
                  <td className="py-4 px-4 dark:text-white text-black">
                    {staff.email}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleEdit(staff)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(staff.id)}
                      className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md"
                    >
                      <MdOutlineDelete />
                    </button>
                  </td>
                </tr>
                {editingRowId === staff.id && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-4 px-4 bg-gray-100 text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                    >
                      <form onSubmit={handleEditSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Emri
                            </label>
                            <input
                              type="text"
                              name="emri"
                              value={editFormData.firstName}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Mbiemri
                            </label>
                            <input
                              type="text"
                              name="mbiemri"
                              value={editFormData.lastName}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full  text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Numri i telefonit
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
                          <div>
                            <label className="block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={editFormData.email}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark">
                              Password
                            </label>
                            <input
                              type="password"
                              name="password"
                              value={editFormData.password}
                              onChange={handleEditInputChange}
                              className="px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"
                              placeholder="Leave blank to keep unchanged"
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700  text-black dark:text-white">
                              Roli
                            </label>
                            <select
                              name="roleID"
                              value={editFormData.roleID}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  roleID: parseInt(e.target.value, 10),
                                })
                              }
                              required
                              className="px-4 py-2 border text-black border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"
                            >
                              <option value={1}>Admin</option>
                              <option value={2}>Owner</option>
                              <option value={3}>Staff</option>
                            </select>
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

export default Staff;
