/* eslint-disable no-unused-vars */
import auth from "../../firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import Loader from "./Loader"
import useUserData from "../customHook/useUserData"

const Home = () => {
  const [loaderMessage , setLoaderMessage] = useState('')
  const redirect = useNavigate();
  const [isLoading, setIsloading] = useState(true)
  const { currentUserData, dataFetched , } = useUserData()


  //if no user signed in then send annonymous user to log in page
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(!user){
        setIsloading(false)  
        redirect('/login')
      }else{
        setLoaderMessage('Loading home page...')
      }
    }) 
  },[])

  useEffect(() => {   
    //wait to finished 
    if ( dataFetched) {
      console.log(currentUserData);
      setIsloading(false)
    }else{
      setLoaderMessage('Checking for acccount...')
    }
  },[ dataFetched, currentUserData])
  
  //Redirect to login page if no user logged in but tring to access homepage
  

  //Sign out an user
  const handleSignout = () => {
    setIsloading(true) //display loading screen as soon as user click signout button 
    signOut(auth).then(() => {
      setIsloading(false) //remove loader right before redirection
      redirect('/login')
    }
    ).catch((error) => {
      console.log(error);
    })
  }

  return (
    <div className="bordered sign">
      <h1> Homepage </h1>
      <div>
        <h3>Welcome {currentUserData.firstName}!</h3>
      </div>
      <div>
        <p> Your fullname : {currentUserData.firstName + ' ' + currentUserData.lastName} </p>
        <p> Your email: {currentUserData.email} </p>
        <p> Your password: {currentUserData.password} </p>
      </div>
      <div>
        <nav>
          <Link to={'/connect'}> Connect </Link>
          <Link to={'/people'}> People </Link>
          <Link to={'/profile'}> Profile </Link>
          <Link to={'/createPost'}> Create Post </Link>
        </nav>
      </div>
      <button onClick={handleSignout}> Sign out </button>
      <p className="center-text">App version: 2.21.24.01201 </p>
      <Loader state={isLoading} isAuthPage={false} loaderMessage={loaderMessage}/>
    </div>
  )
}

export default Home 