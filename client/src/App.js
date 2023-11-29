import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import './index.css';
import Home from './pages/Home';
import UploadImage from './pages/Upload';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index path='/' element={<Home />} />
        <Route path='/new-post' element={<UploadImage />} />
      </Routes>
    </>
  );
}

export default App;
