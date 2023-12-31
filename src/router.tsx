import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Layout from './layout';
import Home from './pages/home';
// import Event from './pages/event';
import Event from './pages/seeu-network';
import Assets from './pages/assets';
import RegisterAssets from './pages/assets/register';
import Proposal from './pages/proposal';
import ProposalCategory from './pages/proposal/category';
import ProposalThread from './pages/proposal/thread';
import CityHall from './pages/cityhall';
import Chat from './pages/chat';
// import EventView from './pages/event/view';
import EventView from './pages/seeu-network/detail';
import EventEdit from './pages/event/edit';
import ProjectInfo from './pages/project/info';
import ProjectEdit from './pages/project/edit';
import GuildInfo from './pages/guild/info';
import GuildEdit from './pages/guild/edit';
import CreateProject from './pages/create-project';
import CreateGuild from './pages/create-guild';
import Profile from './pages/user/profile';
import ProfileEdit from './pages/user/profile/edit';
import UserVault from './pages/user/vault';
import CalendarPage from './pages/calendar';
import RouterChecker from './utils/routerChecker';
import Canny from './pages/canny';
import Apps from './pages/Apps';
import Resources from './pages/resouces/resources';
import ExplorePage from './pages/explore';
import Pub from './pages/Pub/Pub';
import PubDetail from './pages/Pub/detail';

import GoveranceNodeResult from 'pages/cityhall/governance/governanceNodeResult';
// import ResourcesDetail from './pages/resouces/resources-detail';
import ProposalReview from 'pages/cityhall/governance/proposalReview';
import Audit from 'pages/cityhall/governance/audit';
import AuditProject from 'pages/cityhall/governance/projectAudit';
import Issue from 'pages/cityhall/governance/issue';
import SCRRank from 'pages/scrRank';
import SNSEntrancePage from 'pages/sns/entrance';
import RegisterSNS from 'pages/sns/register';
import UserSNS from 'pages/sns/userSNS';
import Newcomer from 'pages/newcomer';

// proposal v2
import ProposalIndexPage from 'pages/proposal-v2';
import CreateProposalPage from 'pages/proposal-v2/create';
import EditProposalPage from 'pages/proposal-v2/edit';
import ProposalThreadV2 from 'pages/proposal-v2/thread';

import Wiki from './pages/notion/wiki';
import getConfig from 'utils/envCofnig';

export default function RouterLink() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />

          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/profile/edit" element={<ProfileEdit />} />
          <Route path="/user/vault" element={<UserVault />} />

          <Route path="/event" element={<Event />} />
          <Route path="/apps" element={<Apps />} />
          <Route path="/resources" element={<Resources />} />
          {/*<Route path="/resources/detail/:id" element={<ResourcesDetail />} />*/}
          <Route path="/event/view" element={<EventView />} />
          <Route path="/event/edit" element={<EventEdit />} />
          <Route path="/online-event" element={<CalendarPage />} />
          <Route path="/hub" element={<Pub />} />
          <Route path="/hubDetail/:id" element={<PubDetail />} />

          <Route path="/assets" element={<Assets />} />
          <Route path="/assets/register" element={<RegisterAssets />} />
          <Route path="/explore" element={<ExplorePage />} />

          <Route path="/project/info/:id" element={<ProjectInfo />} />
          <Route path="/project/edit/:id" element={<ProjectEdit />} />
          <Route path="/create-project" element={<CreateProject />} />

          <Route path="/guild/info/:id" element={<GuildInfo />} />
          <Route path="/guild/edit/:id" element={<GuildEdit />} />
          <Route path="/create-guild" element={<CreateGuild />} />

          <Route path="/proposal" element={<Proposal />} />
          <Route path="/proposal/category/:id" element={<ProposalCategory />} />
          <Route path="/proposal/thread/:id" element={<ProposalThread />} />
          {/* proposal v2 */}
          <Route path="/proposal-v2" element={<ProposalIndexPage />} />
          <Route path="/proposal-v2/create" element={<CreateProposalPage />} />
          <Route path="/proposal-v2/edit/:id" element={<EditProposalPage />} />
          <Route path="/proposal-v2/thread/:id" element={<ProposalThreadV2 />} />

          <Route path="/city-hall/*" element={<CityHall />} />
          <Route path="/city-hall/governance/governance-node-result" element={<GoveranceNodeResult />} />
          <Route path="/city-hall/governance/audit" element={<Audit />} />
          <Route path="/city-hall/governance/audit-project" element={<AuditProject />} />
          <Route path="/city-hall/governance/issue" element={<Issue />} />
          <Route path="/city-hall/governance/review-proposal" element={<ProposalReview />} />
          {getConfig().REACT_APP_ENV === 'test' && <Route path="/chat" element={<Chat />} />}
          <Route path="/ranking" element={<SCRRank />} />
          <Route path="/feedback" element={<Canny />} />
          {/* SNS */}
          <Route path="/sns" element={<SNSEntrancePage />} />
          <Route path="/sns/register" element={<RegisterSNS />} />
          {/* <Route path="/sns/user" element={<UserSNS />} /> */}
          <Route path="/newcomer" element={<Newcomer />} />

          <Route path="/notion/:id" element={<Wiki />} />
          <Route path="/wiki" element={<Wiki />} />
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
