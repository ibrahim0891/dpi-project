import { BrowserRouter ,Routes , Route } from "react-router-dom"
import Signup from "./components/Signup"
import Home from "./components/Home"
import Header from "./components/Header"
import Profile from "./components/Profile"
import CreatePost from "./components/CreatePost" 
import People from "./components/People"
import Connection from "./components/Connection"

function App() {
  
  return (
    <>
    <Header/>
     <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Signup/>}></Route>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/connect" element={<Connection/>}></Route>
        <Route path="/people" element={<People/>}></Route>
        <Route path="/profile" element={<Profile/>}></Route>
        <Route path="/createPost" element={<CreatePost/>}></Route>
      </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
