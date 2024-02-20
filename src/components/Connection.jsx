import { getDatabase, get, ref } from "firebase/database"
import { getAuth } from "firebase/auth"
import { useEffect, useState } from "react"

const Connection = () => {
  const [requestList, setRequestList] = useState([])
  const [requestorUserInfo, setRequestorUserInfo] = useState([])



  useEffect(() => {
    const user = getAuth().currentUser
    // console.log(user.uid);
    const requestedUserRef = ref(getDatabase(), `/users/${user.uid}/connections/recieveRequests`)
    get(requestedUserRef).then((snapshot) => {
      if (snapshot.exists()) {
        const reqList = []
        snapshot.forEach((requestNode) => {
          const request = requestNode.val()
          reqList.push(request)
        })
        setRequestList(reqList)
      } else {
        console.log("Something went wrong!!");
      }
    })

    const requestorArray = []
    requestList.map((req) => {
      const requestorUid = Object.keys(req).toString();
      const requestorDbRef = ref(getDatabase(), `/users/${requestorUid}`)
      get(requestorDbRef).then((snapshot) => {
        if (snapshot.exists()) {
          // console.log(snapshot.val());
          requestorArray.push(snapshot.val())
          setRequestorUserInfo(requestorArray)
        } else {
          console.log('There might be error!!');
        }
      })

    })
    // console.log(requestList);
  }, [requestList])


  const userByRef = ref(getDatabase(), `/users/`)
  return (
    <div className="sign">
      <h1>Connections</h1>
      <div>
        <h3>Review Request</h3>
        <div>
          {requestorUserInfo.map((reqUser, index) =>
            <div key={index}>
              <div className="userCard"  >{reqUser.firstName + ' ' + reqUser.lastName} <button>Accept</button> </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
export default Connection