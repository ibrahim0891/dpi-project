
import { useEffect, useState } from "react"
import { getDatabase , ref , get, set , push} from "firebase/database"
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
    
    const sendConnectReq = (recipientId , senderId) => {
        let connectionRequestNodeRef = push(ref(database, `/users/${recipientId}/connections/recieveRequests`))
        let connectionRequestSentNodeRef = push(ref(database, `/users/${uid}/connections/sentRequest`))
        set(connectionRequestNodeRef ,{ [senderId] : true} ).then(() => {
          console.log("Request Sent");
        }) 
        set(connectionRequestSentNodeRef , {[recipientId]: true}).then(() => {
          console.log("You send request to: " + recipientId);
        })
    }
   
  return (
    <div> 
        <div className="sign"> 
            {userList.map((user,index) => 
              <div key={index} className="userCard">
                <h3>{user.firstName}</h3> <button onClick={(e)=>{sendConnectReq(user.id , uid )}}>Connect</button>
              </div>
            )}
        </div>
        <Loader state={isLoading} loaderMessage={'Bringing other people...'}/>
    </div>
  )
}
export default People