//for register 

import HomePage from "./Homepage";
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import ContactUs from "./components/ContactUs";
import ChatPage from "./components/ChatPage";

function App() {
  return (
    <div>

      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/Chatpage" element={<ChatPage />} />
          
          

        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
