import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/SignIn';
import ECommerce from './pages/Dashboard/ECommerce';
import DefaultLayout from './layout/DefaultLayout';
import Profile from './pages/Profile';
import DailyAppointments from './pages/DailyAppointment';
import ClientTable from './pages/Client';
import DailyExpenses from './pages/DailyExpensess';
import MonthlyExpenses from './pages/MonthlyExpensess';
import ServiceDiscount from './pages/ServiceDiscount';
import Appointments from './pages/Appointments';
import WhatsAppForm from './pages/WhatsAppForm';
import Services from './pages/Services';
import Staff from './pages/Staff';
import { jwtDecode } from 'jwt-decode';
import Calendar from './pages/Calendar';
import ServiceStaff from './pages/ServiceStaff';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (token && userId) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setLoggedIn(false);
        } else {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error('Error decoding token', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setLoggedIn(false);
      }
    } else {
      setLoggedIn(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isLoginPage = pathname === '/signin';

  const handleLogin = () => {
    setLoggedIn(true);
  };

  if (!loggedIn && !isLoginPage) {
    return <Navigate to="/signin" />;
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>InnovoCode | HairSalon</title>
        <link rel="icon" type="image/svg+xml" href="/logo1.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Helmet>
      {loading ? (
        <Loader />
      ) : isLoginPage ? (
        <Routes>
          <Route
            path="/signin"
            element={
              <>
                <PageTitle title="Signin | TailAdmin" />
                <SignIn onLogin={handleLogin} />
              </>
            }
          />
        </Routes>
      ) : (
        <DefaultLayout
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        >
          <Routes>
            <Route index element={<ECommerce />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route
              path="/terminet-Ditore"
              element={<DailyAppointments searchQuery={searchQuery} />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/clients"
              element={<ClientTable searchQuery={searchQuery} />}
            />
            <Route
              path="/dailyExpensess"
              element={<DailyExpenses searchQuery={searchQuery} />}
            />
            <Route
              path="/monthlyExpensess"
              element={<MonthlyExpenses searchQuery={searchQuery} />}
            />
            <Route
              path="/serviceDiscount"
              element={<ServiceDiscount searchQuery={searchQuery} />}
            />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/chat" element={<WhatsAppForm />} />
            <Route path="/terminet" element={<Appointments />} />
            <Route
              path="/sherbimet"
              element={<Services searchQuery={searchQuery} />}
            />
            <Route path="/serviceStaff" element={<ServiceStaff />} />
            <Route
              path="/stafi"
              element={<Staff searchQuery={searchQuery} />}
            />
          </Routes>
        </DefaultLayout>
      )}
    </HelmetProvider>
  );
}

export default App;
