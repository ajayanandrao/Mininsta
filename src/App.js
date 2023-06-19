import './App.scss';
import Login from './Authentication/Login';
import SignUp from './Authentication/SignUp';
import Avtar from './Avtar';
import MobileNavebar from './MobileNavbar/MobileNavebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Post from './Post/Post';
import Feed from './Feed/Feed';
import Home from './Home/Home';
import Option from './Option/Option';
import SearchUser from './Search/SearchUser';
import Message from './Message/Message';
import Users from './Params/Users';
import UsersDetails from './Params/UsersDetails';
import UserProfile from './UserProfile/UserProfile';
import { useEffect } from 'react';
import ScrollToTop from './ScrollTop';
import People from './People/People';
import PeopleProps from './People/PeopleProps';
import UsersProfilePage from './Params/UsersProfilePage';
import Messages from './Message/Messages/Messages';
import ForgotPassword from './Authentication/ForgotPassword';
import Setting from './Setting/Setting';

function App() {

  return (
    <>
      <Router basename='/Mininsta'>
        <MobileNavebar />
        <ScrollToTop />
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="forgotPassword" element={<ForgotPassword />} />
          <Route path="home" element={<Home />} />
          <Route path="signUp" element={<SignUp />} />
          <Route path="option" element={<Option />} />
          <Route path="setting" element={<Setting />} />
          <Route path="search" element={<SearchUser />} />
          <Route path="message" element={<Message />} />
          <Route path="find_friend" element={<PeopleProps />} />

          <Route path='users' element={<Users />} />
          <Route path='users/:id' element={<UsersDetails />} />
          <Route path='users/:id/message' element={<Messages />} />
          <Route path='users/:id/profile' element={<UsersProfilePage />} />

          <Route path='profile' element={<UserProfile />} />

        </Routes>
      </Router>

    </>
  );
}

export default App;
