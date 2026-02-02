import './App.css'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import HomePage from "./Homepage";
import Register from './components/Register'
import Login from './components/Login'
import ContactUs from "./components/ContactUs";
import ChatPage from "./components/ChatPage";
import AboutUs from "./components/AboutUs";

function App() {
  return (
<BrowserRouter>
    <Routes>

      {/* ===== MAIN PAGES ===== */}
      <Route path="/" element={<HomePage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/chat" element={<ChatPage />} />


      {/* ===== FOOTER / EXTRA PAGES (temporary placeholders) ===== */}
      <Route path="/documentation" element={<h1 className="p-10">Documentation Page</h1>} />
      <Route path="/api" element={<h1 className="p-10">API Reference Page</h1>} />
      <Route path="/pricing" element={<h1 className="p-10">Pricing Page</h1>} />
      <Route path="/blog" element={<h1 className="p-10">Blog Page</h1>} />

      <Route path="/privacy" element={<h1 className="p-10">Privacy Policy</h1>} />
      <Route path="/terms" element={<h1 className="p-10">Terms of Service</h1>} />
      <Route path="/cookies" element={<h1 className="p-10">Cookie Policy</h1>} />
      <Route path="/gdpr" element={<h1 className="p-10">GDPR Compliance</h1>} />

      <Route path="/forgot-password" element={<h1 className="p-10">Forgot Password Page</h1>} />
      <Route path="/security" element={<h1 className="p-10">Security FAQ</h1>} />


      {/* ===== 404 fallback ===== */}
      <Route path="*" element={<h1 className="p-10 text-red-500">404 Page Not Found</h1>} />

    </Routes>
   
    </BrowserRouter>
  );
}

export default App;
