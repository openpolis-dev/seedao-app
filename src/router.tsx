import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Layout from './layout';
import Home from './pages/home';

export default function RouterLink() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} index />
        </Routes>
      </Layout>
      {/* <Footer /> */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}
