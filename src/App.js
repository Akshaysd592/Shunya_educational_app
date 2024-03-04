import { Route, Routes } from "react-router";

// import pages 
import Home from './pages/Home'
import Error from "./pages/Error";
import Navbar from "./components/Common/Navbar";

function App() {
  
 


  return (
    <>
      <h1 className="m-4 bg-green-600 p-4 text-balance font-bold  ">This is home page </h1>
      <p className="m-auto w-full h-full pl-7 ">this is paragraph</p>
      <Navbar/>
      <Routes>
             <Route
             path="/"
             element={<Home/>} />
             <Route
             path="*"
             element={<Error/>}
             />
      </Routes>
    </>
  );
}

export default App;
