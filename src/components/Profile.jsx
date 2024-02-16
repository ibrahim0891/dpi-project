import useUserData from "../customHook/useUserData"
import { useEffect, useState } from "react"
import Loader from "./Loader"

const Profile = () => {
  const [isLoading , setIsloading] = useState(true)
  const {currentUserData,dataFetched} = useUserData()
  useEffect(() => {
    if(dataFetched){
      setIsloading(false)
      console.log();
    }
  }, [currentUserData, dataFetched])
  return(
    <div className="sign">
        <h1> Profile of {currentUserData.firstName + " " + currentUserData.lastName } </h1>
        <Loader state={isLoading} loaderMessage={"Loading your profile..."}/>
    </div>
  )
}
export default Profile