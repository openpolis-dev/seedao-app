import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Layout from './layout';
import Home from './pages/home';
import Event from './pages/event';
import Assets from './pages/assets';
import Project from './pages/project';
import Guild from './pages/guild';
import Proposal from './pages/proposal';
import CityHall from './pages/city-hall';
import Chat from './pages/chat';
import EventView from './pages/event/view';
import EventEdit from './pages/event/edit';
import ProjectInfo from './pages/project/info';

export default function RouterLink() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} index />
          <Route path="/home" element={<Home />} />

          <Route path="/event" element={<Event />} />
          <Route path="/event/view" element={<EventView />} />
          <Route path="/event/edit" element={<EventEdit />} />

          <Route path="/assets" element={<Assets />} />

          <Route path="/project" element={<Project />} />
          <Route path="/project/info/:id" element={<ProjectInfo />} />

          <Route path="/guild" element={<Guild />} />
          <Route path="/proposal" element={<Proposal />} />
          <Route path="/city-hall" element={<CityHall />} />
          <Route path="/chat" element={<Chat />} />
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
