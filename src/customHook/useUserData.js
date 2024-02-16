import { useEffect , useState} from "react"
import { getDatabase, get, ref, child } from 'firebase/database'
import { onAuthStateChanged } from "firebase/auth"
import auth from "../../firebase"

const useUserData = () => { 
    const [dataFetched , setDataFetched] = useState(false) 
    const [currentUserData , setCurrentUserData ] = useState('')
    const [uid , setUid] = useState('')
    useEffect(() => {
        const dbref = ref(getDatabase())
        onAuthStateChanged(auth, (user) => {
            if (user) {
                get(child(dbref, `users/${user.uid}`)).then((snapshot) => {
                    if (snapshot.exists()) {
                        setCurrentUserData(snapshot.val()) 
                        setUid(user.uid)
                    } else {
                        console.log('No data found!');
                    }
                }).catch((error) => { 
                    console.log(error);
                })
                .finally(() => {
                //   setIsDataLoading(false)
                  setDataFetched(true) 
                })
            }
            else {
                // redirect('/login')
                setCurrentUserData(null)
            }
        })

    }, [])

    return {currentUserData , dataFetched , uid }
}

export default useUserData