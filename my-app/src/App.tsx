import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/SignIn';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Services from './pages/Services';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import Staff from './pages/Staff';
import Appointments from './pages/Appointments';
import ServiceStaff from './pages/ServiceStaff';
import DailyAppointments from './pages/DailyAppointment';
import WhatsAppForm from './pages/WhatsAppForm';
import DailyExpenses from './pages/DailyExpensess';
import MonthlyExpenses from './pages/MonthlyExpensess';
import ServiceDiscount from './pages/ServiceDiscount';
import ClientTable from './pages/Client';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const isLoginPage = pathname === '/signin';

  return loading ? (
    <Loader />
  ) : isLoginPage ? (
    <Routes>
      <Route
        path="/signin"
        element={
          <>
            <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <SignIn />
          </>
        }
      />
    </Routes>
  ) : (
    <DefaultLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery}> {/* Pass searchQuery and setSearchQuery to DefaultLayout */}
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="eCommerce Dashboard | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <ECommerce  />
            </>
          }
        />
        <Route
          path="/calendar"
          element={
            <>
              <PageTitle title="Calendar | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Calendar searchQuery={searchQuery} />
            </>
          }
        />
        <Route
          path="/terminet-Ditore"
          element={
            <>
              <PageTitle title="Daily Appointments | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <DailyAppointments searchQuery={searchQuery} />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Profile  />
            </>
          }
        />
        <Route
          path="/clients"
          element={
            <>
              <PageTitle title="Clients | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <ClientTable searchQuery={searchQuery} />
            </>
          }
        />
        <Route
          path="/dailyExpensess"
          element={
            <>
              <PageTitle title="Daily Expenses | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <DailyExpenses searchQuery={searchQuery} />
            </>
          }
        />
        <Route
          path="/monthlyExpensess"
          element={
            <>
              <PageTitle title="Monthly Expenses | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <MonthlyExpenses searchQuery={searchQuery} />
            </>
          }
        />
        <Route
          path="/serviceDiscount"
          element={
            <>
              <PageTitle title="Service Discount | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <ServiceDiscount searchQuery={searchQuery} />
            </>
          }
        />
        <Route
          path="/chat"
          element={
            <>
              <PageTitle title="WhatsApp Form | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <WhatsAppForm  />
            </>
          }
        />
        
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormElements  />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormLayout  />
            </>
          }
        />
        <Route
          path="/terminet"
          element={
            <>
              <PageTitle title="Appointments | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Appointments  />
            </>
          }
        />
        <Route
          path="/sherbimet"
          element={
            <>
              <PageTitle title="Services | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Services searchQuery={searchQuery} />
            </>
          }
        />
        <Route
          path="/serviceStaff"
          element={
            <>
              <PageTitle title="Service Staff | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <ServiceStaff />
            </>
          }
        />
        <Route
          path="/stafi"
          element={
            <>
              <PageTitle title="Staff | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Staff searchQuery={searchQuery} />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Settings  />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Chart  />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Alerts  />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Buttons  />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
