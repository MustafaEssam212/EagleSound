import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import Intro from './Components/Intro'
import SignUp from './Components/SignUp'
import SignIn from './Components/SignIn'
import Discover from './Components/Discover'
import Upload from './Components/Upload'
import Profile from './Components/Profile'
import Play from './Components/Play'
import {UserProvider} from './Components/User-Context'
import Search from './Components/Search';

function App() {
  return (

    <div className="App">
      <BrowserRouter>


          <Route exact path="/" component={Intro}></Route>
          <Route  path="/SignUp" component={SignUp}></Route>
          <Route  path="/SignIn" component={SignIn}></Route>
          <Route  path="/Discover" component={Discover}></Route>
          <Route  path="/Upload" component={Upload}></Route>
          <Route  path="/Profile/:id" component={Profile}></Route>
          <Route  path="/Play/:id" component={Play}></Route>
          <Route  path="/Search" component={Search}></Route>


      </BrowserRouter>

    </div>
  );
}

function AppWithStore(){
  return(
    <UserProvider>
      <App />
    </UserProvider>
  )
}

export default AppWithStore;
