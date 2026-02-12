import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/common/ProtectedRoute';
import GuestRoute from './components/common/GuestRoute'; // Renamed for clarity
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Dashboard from './components/dashboard/Dashboard';
import Manhour from './components/dashboard/Manhour';
import Montiv from './components/dashboard/Montiv';
import Test from './components/dashboard/Test';
import Manhour_Test from './components/dashboard/Manhour_Test';
import Sheet from './components/dashboard/Sheet';
import ReportMonthlyEnergyListrik from './components/dashboard/ReportMonthlyEnergyListrik';
import Kubikal1ActivePower from './components/dashboard/Kubikal1ActivePower';
import MainDashboardKwh from './components/dashboard/MainDashboardListrik';
import ReportHourly from './components/dashboard/ReportHourly';
import EnergyElectrialPlant2 from './components/dashboard/EnergyElectrialPlant2';
import SimulasiManhour from './components/dashboard/SimulasiManhour';
import Train from './Train/Train'
import ManhourBreakdown from './components/dashboard/ManhourBreakdown';
import Lora from './components/custom/Lora/Lora';
import Smile from './components/dashboard/MainDashboardEnergyListrikNipon/Smile';
import ManhourGuest from './components/dashboard/ManhourGuest';
import ManhourYearly from './components/dashboard/ManhourYearly';
import KanribanGrafikBawahPG21 from './components/dashboard/KanribanGrafikBawahPG21'
import ChartCr7 from './components/dashboard/ChartCr7';


function App() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>


        {/* Public routes: accessible by everyone (no wrapper needed) */}
        <Route path="/kwh" element={<MainDashboardKwh />} />
        <Route path="/kubikal1" element={<Kubikal1ActivePower />} />
        <Route path="/listrik" element={<ReportMonthlyEnergyListrik />} />
        <Route path="/hourly" element={<ReportHourly />} />
        <Route path="/plant2" element={<EnergyElectrialPlant2 />} />
        <Route path='/simulasimanhour' element={<SimulasiManhour />} />
        <Route path='/train' element={<Train />} />
        <Route path='/breakdown' element={<ManhourBreakdown />} />
        <Route path="/lora" element={<Lora />} />
        <Route path="/smile" element={<Smile />} />
        <Route path="/ManhourGuest" element={<ManhourGuest />} />
        <Route path="/ManhourYearly" element={<ManhourYearly />} />
        <Route path="/ManhourBawah" element={<KanribanGrafikBawahPG21 />} />
        <Route path="/cr7" element={<ChartCr7 />} />





        {/* Redirect root based on auth */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/ManhourGuest" replace /> : <Navigate to="/ManhourGuest" replace />} 
        />


        {/* Guest-only routes */}
        <Route 
          path="/login" 
          element={
            <GuestRoute>
              <LoginForm />
            </GuestRoute>
          } 
        />


        <Route 
          path="/register_tps_core_engine_member" 
          element={
            <GuestRoute>
              <RegisterForm />
            </GuestRoute>
          } 
        />


        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manhour" 
          element={
            <ProtectedRoute>
              <Manhour />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/montiv" 
          element={
            
              <Montiv />
            
          } 
        />
        <Route 
          path="/test" 
          element={
            <ProtectedRoute>
              <Test />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/Manhour_Test" 
          element={
            <ProtectedRoute>
              <Manhour_Test />
            </ProtectedRoute>
          } 
        />











        {/* <Route 
          path="/kubikal1" 
          element={
            <GuestRoute>
              <Kubikal1ActivePower />
            </GuestRoute>
          } 
        />
        <Route 
          path="/kwh" 
          element={
            <GuestRoute>
              <MainDashboardKwh />
            </GuestRoute>
          } 
        /> */}


      </Routes>
    </Router>
  );
}

export default App;