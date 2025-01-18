import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useEffect, useState, Suspense, lazy } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/SignIn';
import DefaultLayout from './layout/DefaultLayout';
import { jwtDecode } from 'jwt-decode';

const ECommerce = lazy(() => import('./pages/Dashboard/ECommerce'));
const Profile = lazy(() => import('./pages/Profile'));
const DailyAppointments = lazy(() => import('./pages/DailyAppointment'));
const ClientTable = lazy(() => import('./pages/Client'));
const DailyExpenses = lazy(() => import('./pages/DailyExpensess'));
const MonthlyExpenses = lazy(() => import('./pages/MonthlyExpensess'));
const ServiceDiscount = lazy(() => import('./pages/ServiceDiscount'));
const Appointments = lazy(() => import('./pages/Appointments'));
const WhatsAppForm = lazy(() => import('./pages/WhatsAppForm'));
const Services = lazy(() => import('./pages/Services'));
const Staff = lazy(() => import('./pages/Staff'));
const Calendar = lazy(() => import('./pages/Calendar'));
const ServiceStaff = lazy(() => import('./pages/ServiceStaff'));

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
          const timeout = (decodedToken.exp - currentTime) * 1000;
          setTimeout(() => {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            setLoggedIn(false);
          }, timeout);
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

    if (!loggedIn) {
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = () => {
        window.history.pushState(null, '', window.location.href);
      };
    }
  }, [pathname, loggedIn]);

  const isLoginPage = pathname === '/';

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setLoggedIn(false);
    window.location.replace('/');
  };

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    if (!token || !userId) {
      window.location.replace('/');
      return null;
    }

    return children;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <HelmetProvider>
      <Helmet>
        <title>InnovoCode | HairSalon</title>
        <link rel="icon" type="image/svg+xml" href="/logo1.svg" />
        <link rel="icon" type="image/png" href="/favicon.png" />
      </Helmet>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <PageTitle title="Signin | TailAdmin" />
                <SignIn onLogin={handleLogin} />
              </>
            }
          />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DefaultLayout
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onLogout={handleLogout}
                >
                  <Routes>
                    <Route path="/dashboard" element={<ECommerce />} />
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
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </HelmetProvider>
  );
}

export default App;
