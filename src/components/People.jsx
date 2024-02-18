
import { useEffect, useState } from "react"
import { getDatabase , ref , get} from "firebase/database"
import useUserData from "../customHook/useUserData";
import Loader from "./Loader";
const People = () => {
    const database = getDatabase();
    const [userList ,setUserList] = useState([])
    // const [currentUID ,setCurrentUID] = useState('')
    const {  currentUserData ,  uid } = useUserData()
    const [isLoading ,setIsloading] = useState(true)

    useEffect(() => {
      get(ref(database, '/users')).then((snapshot) => {
        const userArray = []; 
        if(snapshot.exists()){
            snapshot.forEach((user) => {
            const userObj = user.val() 
            if (user.key !== uid) {
              // Push user data with ID to the array (more efficient filtering)
              userArray.push({ id: user.key, ...userObj });
            } else {
              // Optionally log a message for debugging purposes
              console.log("Logged-in user found:", user.key);
            }
            console.log(userArray);
          }) 
        }else{
            setUserList('Welcome to grave yeard! ')
        }
        setUserList(userArray) 
      }).finally(() => {
        setIsloading(false) 
      })
    },[uid])
    
    const sendConnectReq = (recipientId ) => {
        const senderID = uid
      console.log(recipientId , senderID);
    }
   
  return (
    <div> 
        <div className="sign"> 
            {userList.map((user,index) => 
              <div key={index} className="userCard">
                <h3>{user.firstName}</h3> <button onClick={(e)=>{sendConnectReq(user.id)}}>Connect</button>
              </div>
            )}
        </div>
        <Loader state={isLoading} loaderMessage={'Bringing other people...'}/>
    </div>
  )
}
export default People