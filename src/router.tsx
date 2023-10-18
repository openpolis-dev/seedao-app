import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Layout from './layout';
import Home from './pages/home';
import Event from './pages/event';
import Assets from './pages/assets';
import Project from './pages/project';
import Guild from './pages/guild';
import Proposal from './pages/proposal';
import ProposalCategory from './pages/proposal/category';
import ProposalThread from './pages/proposal/thread';
// import CityHall from './pages/city-hall';
import CityHall from './pages/cityhall-new';
import Chat from './pages/chat';
import EventView from './pages/event/view';
import EventEdit from './pages/event/edit';
import ProjectInfo from './pages/project/info';
import GuildInfo from './pages/guild/info';
import CreateProject from './pages/create-project';
import CreateGuild from './pages/create-guild';
import Profile from './pages/user/profile';
import UserVault from './pages/user/vault';
import CalendarPage from './pages/calendar';
import RouterChecker from './utils/routerChecker';
import Canny from './pages/canny';
import Apps from './pages/Apps';
import Resources from './pages/resources';

export default function RouterLink() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />

          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/vault" element={<UserVault />} />

          <Route path="/event" element={<Event />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/event/view" element={<EventView />} />
          <Route path="/event/edit" element={<EventEdit />} />
          <Route path="/online-event" element={<CalendarPage />} />

          <Route path="/assets" element={<Assets />} />

          <Route path="/project" element={<Project />} />
          <Route path="/project/info/:id" element={<ProjectInfo />} />
          <Route path="/create-project" element={<CreateProject />} />

          <Route path="/guild" element={<Guild />} />
          <Route path="/guild/info/:id" element={<GuildInfo />} />
          <Route path="/create-guild" element={<CreateGuild />} />

          <Route path="/proposal" element={<Proposal />} />
          <Route path="/proposal/category/:id" element={<ProposalCategory />} />
          <Route path="/proposal/thread/:id" element={<ProposalThread />} />
          <Route path="/city-hall" element={<CityHall />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/feedback" element={<Canny />} />
        </Routes>
      </Layout>
      <RouterChecker />
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
