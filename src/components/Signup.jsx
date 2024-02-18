import { useEffect, useState } from "react";
import {   createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import auth from "../../firebase";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, set } from "firebase/database"
import Loader from "./Loader";


const Signup = () => {
  let [isLoading , setIsloading] = useState(false)
  let [logIn, setLogIn] = useState(true);
  let [email, setEmail] = useState('');
  let [error, setError] = useState('');

  let [fname, setFname] = useState('');
  let [lname, setLname] = useState('');

  let [password, setPassword] = useState('');
  let redirect = useNavigate()

  //verify user credential and log in 
  const handleLogin = (e) => {
    e.preventDefault()
    setIsloading(true)
    signInWithEmailAndPassword(auth, email, password)
      .then((userData) => {
        console.log(userData); 
          setIsloading(false)
          redirect('/') 
      }).catch((error) => {
        console.log(error);
        setError(error.message)
      })
  }

  //create and register user in authentication list and database
  const handleSignUp = (e) => {
    e.preventDefault()
    setIsloading(true)
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      const database = getDatabase()
      set(ref(database, '/users/'+userCredential.user.uid),{
        firstName : fname,
        lastName : lname,
        email: userCredential.user.email , 
        password : password
      }) 
      setIsloading(false)
      redirect('/')
    })
  }
  
  //send user to home page if already logged in 
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user){
        redirect('/')
      } 
    })
     
  })

  return (
    <div className="sign">
      <div>
        <button onClick={(e) => { e.preventDefault(); setLogIn(true) }}>Log in </button>
        <button onClick={(e) => { e.preventDefault(); setLogIn(false) }}>Sign up</button>
      </div>
      <div> {error != '' ? error : null}</div>

      <form>
        <h1>{logIn ? 'Log in' : 'Sign up'}</h1>
        {!logIn ?
          <div>
            <label htmlFor="FirstName">Firstname </label>
            <input type="text" onChange={(e) => setFname(e.target.value)} />
            <label htmlFor="LastName">Lastname</label>
            <input type="text" onChange={(e) => setLname(e.target.value)}/>
          </div> : null}
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" onChange={(e) => { setEmail(e.target.value) }} />

          <label htmlFor="password">Password</label>
          <input type="password" onChange={(e) => { setPassword(e.target.value) }} />

          <button onClick={logIn ? handleLogin : handleSignUp}> {logIn ? 'Log in ' : 'Sign up'} </button>
        </div>

          <Loader state={isLoading} isLogIn={logIn}  isAuthPage={true}/>
      </form>

    </div>
  )
}

export default Signup