import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Layout from './layout';
import Home from './pages/home';
// import Event from './pages/event';
import Event from './pages/seeu-network';
import Assets from './pages/assets';
import RegisterAssets from './pages/assets/register';
import CityHall from './pages/cityhall';
import Chat from './pages/chat';
// import EventView from './pages/event/view';
import EventView from './pages/seeu-network/detail';
import EventEdit from './pages/event/edit';
import ProjectInfo from './pages/project/info';
import ProjectEdit from './pages/project/edit';
import GuildInfo from './pages/guild/info';
import GuildEdit from './pages/guild/edit';
import CreateProject from './pages/create-project/create';
import CreateGuild from './pages/create-guild/create';
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
import SeeSwap from 'pages/seeswap/swap';
import Credit from 'pages/credit';
import SnsQuery from "./pages/sns-query";
import Assistant from "./pages/assistant";
import Node from "./components/node/members";
import SearchProfile from "./components/profile/search";
import SbtCreate from "./pages/sbt/sbtCreate";
import SbtList from "./pages/sbt/sbtList";
import SbtApply from "./pages/sbt/sbtApply";
import DetailPublicity from "./pages/publicity/detail";
import PublicityList from "./pages/publicity/list";
import Archive from "./pages/archive";
import AiChat from "./pages/aiChat";



const isOnlyDev = !process.env.REACT_APP_ENV_VERSION || process.env.REACT_APP_ENV_VERSION === 'dev';

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

          {/* proposal v2 */}
          <Route path="/proposal" element={<ProposalIndexPage />} />
          <Route path="/proposal/create" element={<CreateProposalPage />} />
          <Route path="/proposal/edit/:id" element={<EditProposalPage />} />
          <Route path="/proposal/thread/:id" element={<ProposalThreadV2 />} />

          <Route path="/city-hall/*" element={<CityHall />} />
          <Route path="/city-hall/governance/governance-node-result" element={<GoveranceNodeResult />} />
          <Route path="/city-hall/governance/audit" element={<Audit />} />
          <Route path="/city-hall/governance/audit-project" element={<AuditProject />} />
          <Route path="/city-hall/governance/issue" element={<Issue />} />
          <Route path="/city-hall/governance/review-proposal" element={<ProposalReview />} />
          <Route path="/city-hall/governance/review-proposal/:id" element={<ProposalThreadV2 />} />
          <Route path="publicity/detail/:id" element={<DetailPublicity />} />
          <Route path="publicity" element={<PublicityList />} />


          {['dev', undefined].includes(process.env.REACT_APP_ENV_VERSION || '') && (
            <Route path="/chat" element={<Chat />} />
          )}
          <Route path="/ranking" element={<SCRRank />} />
          <Route path="/feedback" element={<Canny />} />
          {/* SNS */}
          <Route path="/sns" element={<SNSEntrancePage />} />
          <Route path="/sns/register" element={<RegisterSNS />} />


          <Route path="/sns-query" element={<SnsQuery />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/node" element={<Node />} />
          <Route path="/search-profile" element={<SearchProfile />} />
          <Route path="/sbt/list/:type" element={<SbtList />} />
          <Route path="/sbt/create" element={<SbtCreate />} />
          <Route path="/sbt/apply" element={<SbtApply />} />
          <Route path="/archive" element={<Archive />} />


          {/* <Route path="/sns/user" element={<UserSNS />} /> */}
          {isOnlyDev && <Route path="/newcomer" element={<Newcomer />} />}
          {/* See Swap */}
          {isOnlyDev && <Route path="/see-swap" element={<SeeSwap />} />}
          <Route path="/notion/:id" element={<Wiki />} />
          <Route path="/guild_detail/:id" element={<Wiki />} />
          <Route path="/wiki" element={<Wiki />} />
          {/* Credit */}
          <Route path="/credit" element={<Credit />} />
          <Route path="/ai" element={<AiChat />} />
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
