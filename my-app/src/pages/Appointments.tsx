import React, { useState } from 'react';

type AppointmentType = {
  clientName: string;
  service: string;
  date: string;
  time: string;
  staff: string;
  notes: string;
};

const Appointments: React.FC = () => {
  // Initialize appointments with some sample data
  const [appointments, setAppointments] = useState<AppointmentType[]>([
    {
      clientName: 'John Doe',
      service: 'Haircut',
      date: '2024-12-10',
      time: '10:00',
      staff: 'Alex',
      notes: 'Wants a fade style.',
    },
    {
      clientName: 'Jane Smith',
      service: 'Manicure',
      date: '2024-12-12',
      time: '14:00',
      staff: 'Maria',
      notes: 'Prefers light pink polish.',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [appointment, setAppointment] = useState<AppointmentType>({
    clientName: '',
    service: '',
    date: '',
    time: '',
    staff: '',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add the new appointment to the list
    setAppointments((prev) => [...prev, appointment]);
    // Close the form and reset the input fields
    setShowForm(false);
    setAppointment({
      clientName: '',
      service: '',
      date: '',
      time: '',
      staff: '',
      notes: '',
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-boxdark">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-dark dark:text-dark">
          Appointments
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {showForm ? 'Close Form' : 'Add Appointment'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            { label: 'Client Name', name: 'clientName', type: 'text' },
            { label: 'Service', name: 'service', type: 'text' },
            { label: 'Date', name: 'date', type: 'date' },
            { label: 'Time', name: 'time', type: 'time' },
            { label: 'Staff', name: 'staff', type: 'text' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block font-medium text-dark dark:text-dark">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={appointment[field.name as keyof AppointmentType]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg dark:bg-dark dark:text-dark"
              />
            </div>
          ))}

          <div className="md:col-span-2">
            <label className="block font-medium text-dark dark:text-dark">
              Notes (Optional)
            </label>
            <textarea
              name="notes"
              value={appointment.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border rounded-lg dark:bg-dark dark:text-dark"
            />
          </div>

          <div className="md:col-span-2 text-right">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Add Appointment
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200 text-dark dark:bg-meta-4">
            <tr>
              <th className="py-3 px-4 font-medium text-left">Client Name</th>
              <th className="py-3 px-4 font-medium text-left">Service</th>
              <th className="py-3 px-4 font-medium text-left">Date</th>
              <th className="py-3 px-4 font-medium text-left">Time</th>
              <th className="py-3 px-4 font-medium text-left">Staff</th>
              <th className="py-3 px-4 font-medium text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr key={index} className="border-b dark:border-gray-700">
                <td className="py-3 px-4">{appointment.clientName}</td>
                <td className="py-3 px-4">{appointment.service}</td>
                <td className="py-3 px-4">{appointment.date}</td>
                <td className="py-3 px-4">{appointment.time}</td>
                <td className="py-3 px-4">{appointment.staff}</td>
                <td className="py-3 px-4">{appointment.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
