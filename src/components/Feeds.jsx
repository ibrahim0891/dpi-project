import { useEffect, useState } from "react";
import useUserData from "../customHook/useUserData"
import { getDatabase, ref, child, get } from "firebase/database"


const Feeds = () => {
    const { currentUserData, dataFetched, uid } = useUserData();
    const [userPosts, setUserPosts] = useState([])
    const [postLoaded, isPostLoaded] = useState(false)

    useEffect(() => {
        const dbRef = ref(getDatabase())
        get(child(dbRef, `/posts/${uid}`)).then((snapshot) => {
            if (snapshot.exists()) {
                const postArray = []
                snapshot.forEach((postNode) => {
                    let post = postNode.val()
                    postArray.push({ id: postNode.key, ...post })
                })
                setUserPosts(postArray)
                isPostLoaded(true)
            } else {
                console.log("You haven't posted anything yet!");
            }
        }).catch((error) => {
            console.log((error));
        })

    }, [currentUserData, postLoaded])

    return (
        <div>
            {!postLoaded ? "Loading post" :
                <div>
                    {userPosts.map((post) =>
                        <div className="post" key={post.id}>
                            <h1>{post.title}</h1>
                            <h3>{post.author}</h3>
                            <p>{post.content}</p>
                        </div>
                    )}
                </div>
            }

        </div>
    )
}
export default Feeds