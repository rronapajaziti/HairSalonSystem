import React, { useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import ChartOne from '../../components/Charts/ChartOne';
import ChartThree from '../../components/Charts/ChartThree';
import ChartTwo from '../../components/Charts/ChartTwo';
import ChatCard from '../../components/Chat/ChatCard';
import MapOne from '../../components/Maps/MapOne';
import TableOne from '../../components/Tables/TableOne';
import axios from 'axios';

const ECommerce: React.FC = () => {
  const [totalStaff, setTotalStaff] = useState(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalServices, setTotalServices] = useState(0);
  const [completedAppointments, setCompletedAppointments] = useState(0);

  useEffect(() => {
    const fetchTotalStaff = async () => {
      try {
        const response = await axios.get(
          'https://studio-linda.com/api/User/total-staff',
        );
        setTotalStaff(response.data.totalStaff);
      } catch (error) {
        console.error('Error fetching total staff:', error);
      }
    };

    const fetchTotalPrice = async () => {
      try {
        const response = await axios.get(
          'https://studio-linda.com/api/Appointment/total-price',
        );
        setTotalPrice(response.data);
      } catch (error) {
        console.error('Error fetching total price:', error);
      }
    };
    const fetchTotalServices = async () => {
      try {
        const response = await axios.get(
          'https://studio-linda.com/api/Service/total-services',
        );
        setTotalServices(response.data.totalServices);
      } catch (error) {
        console.error('Error fetching total services:', error);
      }
    };
    const fetchCompletedAppointments = async () => {
      try {
        const response = await axios.get(
          'https://studio-linda.com/api/Appointment/total-completed-appointments',
        );
        setCompletedAppointments(response.data.completedAppointmentsCount);
      } catch (error) {
        console.error('Error fetching completed appointments:', error);
      }
    };

    fetchCompletedAppointments();
    fetchTotalServices();
    fetchTotalStaff();
    fetchTotalPrice();
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 dark:text-white text-black">
        <CardDataStats
          title="Numri i Stafit"
          total={`${totalStaff}`}
          rate="0.43%"
          levelUp
          className="p-4"
        >
          <svg
            className="w-10 h-10 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fill-rule="evenodd"
              d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z"
              clip-rule="evenodd"
            />
          </svg>
        </CardDataStats>

        <CardDataStats
          title="Fitimi total"
          total={`${totalPrice.toFixed(2)}€`}
          rate="4.35%"
          levelUp
          className="p-4"
        >
          <svg
            className="w-10 h-10 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 10h9.231M6 14h9.231M18 5.086A5.95 5.95 0 0 0 14.615 4c-3.738 0-6.769 3.582-6.769 8s3.031 8 6.769 8A5.94 5.94 0 0 0 18 18.916"
            />
          </svg>
        </CardDataStats>

        <CardDataStats
          title="Numri i Shërbimeve"
          total={`${totalServices}`}
          rate="0.43%"
          levelUp
          className="p-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-10 h-10 text-gray-800 dark:text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664"
            />
          </svg>
        </CardDataStats>

        <CardDataStats
          title="Terminet e Përfunduara"
          total={`${completedAppointments}`}
          rate="0.95%"
          levelDown
          className="p-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            className="w-10 h-10 text-gray-800 dark:text-white"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
            />
          </svg>
        </CardDataStats>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-1">
          <ChartOne />
        </div>
        <div className="col-span-1">
          <ChartTwo />
        </div>
        <div className="col-span-1">
          <ChartThree />
        </div>
        <div className="col-span-1">
          <ChatCard />
        </div>
      </div>
    </>
  );
};

export default ECommerce;
