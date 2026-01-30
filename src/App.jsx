import ServiceDetails from "./pages/ServiceDetails.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ScrollToTop from "./components/helper/ScrollToTop.jsx";
import './App.css'
import Home from "./pages/Home.jsx";
import Booking from "./pages/Services.jsx";
import DateTimeSelection from "./pages/DateTimeSelection.jsx";
import UserInformation from "./pages/UserInformation.jsx";
import { Route, Routes } from "react-router-dom";
function App() {

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Booking />} />
        <Route path="/services/:category" element={<ServiceDetails />} />
        <Route path="/book/:category/:serviceId" element={<DateTimeSelection />} />
        <Route path="/book/:category/:serviceId/details" element={<UserInformation />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<AdminDashboard />} />
        {/*<Route path="/contact" element={<Contact />} />*/}
      </Routes>
    </>
  )
}

export default App
