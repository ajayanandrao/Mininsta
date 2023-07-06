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
import StoryForm from './Story/StoryForm';
import CreateStorey from './Story/createStory/CreateStorey';
import ViewStory from './Story/createStory/ViewStory/ViewStory';
import ViewStoryProps from './Story/createStory/ViewStory/ViewStoryProps';
import Demo from './Demo';
import Movies from './Movies/Movies';
import CategoryParam from './Movies/CategoryParam/CategoryParam';
import Reals from './Reals/Reals';
import ReelsProps from './Reals/ReelsProps';
import MovieTrailer from './Movies/CategoryParam/MovieTrailer';
import AddHollywood from './Movies/AddHMovie/AddHollywood';
import AddTrailer from './Movies/AddTrailer';
import HollywoodMovies from './Movies/HollywoodMovies';
import RequestMovie from './Movies/Request/RequestMovie';

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

          <Route path="story" element={<StoryForm />} />
          <Route path="createStory" element={<CreateStorey />} />
          <Route path="users/:id/story" element={<ViewStoryProps />} />

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

          <Route path='movieTrailer/:id' element={<MovieTrailer />} />

          <Route path='profile' element={<UserProfile />} />
          <Route path='demo' element={<Demo />} />
          <Route path='movies' element={<Movies />} />
          <Route path='requestMovie' element={<RequestMovie />} />
          <Route path='reels' element={<ReelsProps />} />

          {/* <Route path='movie/:id' element={<CategoryParam />} /> */}

          <Route path='movie/:id' element={<AddHollywood />} />
          <Route path='addT' element={<AddTrailer />} />


          <Route path='hollywoodmovie/:id' element={<HollywoodMovies />} />

        </Routes>
      </Router>

    </>
  );
}

export default App;
