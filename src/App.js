import { Route, Routes } from "react-router";

// import pages 
import Home from './pages/Home'
import Error from "./pages/Error";
import Navbar from "./components/Common/Navbar";
import About from "./pages/About";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  
 


  return (
    <div className="flex min-h-screen w-screen flex-col  bg-richblack-900 font-inter">
      
      <Navbar/>
      <Routes>
             <Route
             path="/"
             element={<Home/>} />
             <Route
             path="/about"
             element={<About/>}
             />
             <Route
              path="/login"
              element={<Login/>}
             />
             <Route
              path="/signup"
              element={<SignUp/>}
             />
             <Route
             path="*"
             element={<Error/>}
             />
      </Routes>
    </div>
  );
}

export default App;
