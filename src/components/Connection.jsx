import { getDatabase, get, ref } from "firebase/database"
import { getAuth } from "firebase/auth"
import { useEffect, useState } from "react"

import Loader from "./Loader";

const Connection = () => {
  const [requestList, setRequestList] = useState([])
  const [requestorUserInfo, setRequestorUserInfo] = useState([])
  const [isLoading, setIsloading] = useState(true)


  useEffect(() => {
    const user = getAuth().currentUser
    // console.log(user.uid);
    const requestedUserRef = ref(getDatabase(), `/users/${user.uid}/connections/recieveRequests`)
    get(requestedUserRef).then((snapshot) => {
      if (snapshot.exists()) {
        const reqList = []
        snapshot.forEach((requestNode) => {
          const request = requestNode.val()
          reqList.push(Object.keys(request).toString()) //get an array of uids of requested user 
          const userListWithData = [];
          reqList.forEach((request) => {
            get(ref(getDatabase(), `/users/${request}`)).then((snapshot) => {
              const user = snapshot.val()
              userListWithData.push(user)
              // console.log(userListWithData);
            }).then(() => {
              setRequestList(userListWithData)
              console.log(requestList);
            }) 
          }) 
        })
      } else {
        console.log("Something went wrong!!");
      }
    }).finally(() => {
      setIsloading(false)
    }) 
  }, [])
  


  return (
    <div className="sign">
      <h1>Connections</h1>
      <div>
        <h3>Review Request</h3>
        <div>
          { 
          requestList.map((reqUser, index) =>
            <div key={index}>
              <div className="userCard"  > {reqUser.firstName} <button>Accept</button> </div>
            </div>
          )}
        </div>
      </div>
      <Loader state={isLoading} loaderMessage={"Looking for request..."} />
    </div>
  )
}
export default Connection