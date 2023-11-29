import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import './index.css';
import Home from './pages/Home';
import UploadImage from './pages/Upload';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index path='/' element={<Home />} />
        <Route path='/new-post' element={<UploadImage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
