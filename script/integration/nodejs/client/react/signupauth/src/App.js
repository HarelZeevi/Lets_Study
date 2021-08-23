import './App.css';
import Navbar from './cmps/navbarGuest/Navbar';
import SignUpAccess from './cmps/signup/SignupAcccess';

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <SignUpAccess></SignUpAccess>
    </div>
  );
}

export default App;
