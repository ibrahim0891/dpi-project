import { useEffect, useState } from "react";
import useUserData from "../customHook/useUserData"
import { getDatabase, ref, child, get, remove, onChildAdded, onChildRemoved, update } from "firebase/database"


const Feeds = () => {
    const { currentUserData, dataFetched, uid } = useUserData();
    const [userPosts, setUserPosts] = useState([])
    const [loadingPost, setIsloadingPost] = useState(true)
    const [isZeroPost, setIsZeropost] = useState(false)

    useEffect(() => {
        const db = getDatabase()
        get(child(ref(db), `/posts/${uid}`)).then((snapshot) => {
            handlePostSnapShot(snapshot);
        }).catch((error) => {
            console.log((error));
        }).finally(() => {
            setIsloadingPost(false)

        })
        onChildAdded(ref(db, `/posts/${uid}`), (snapshot) => {
            handlePostAdded(snapshot)
        })
        onChildRemoved(ref(db, `/posts/${uid}`), (snapshot) => {
            handlePostRemoved(snapshot)
        })

    }, [currentUserData])

    const handlePostSnapShot = (snapshot) => {
        if (snapshot.exists()) {
            const postArray = []
            snapshot.forEach((postNode) => {
                let post = postNode.val()
                if (post.title && post.content) {
                    postArray.push({ id: postNode.key, ...post })
                }
            })
            setUserPosts(postArray)
            if (postArray.length > 0) {
                setUserPosts(postArray)
            }
        } else {
            setIsZeropost(true)
        }

    }
    const handlePostAdded = (snapshot) => {
        const postData = snapshot.val()
        if (postData.title && postData.content) {
            const newPost = { id: snapshot.key, ...postData }
            setUserPosts((prevPost) => {
                return [...prevPost, newPost]
            })
        }

        setIsZeropost(false)

    }
    const handlePostRemoved = (snapshot) => {
        const deletedPostId = snapshot.key
        // setUserPosts(userPosts.filter((post) => {
        //     post.id !== deletedPostId
        // }))
        if (userPosts.length == 0) {
            setIsZeropost(true)
        }
    }
    const handleDelete = (postID) => {
        const postRef = ref(getDatabase(), `/posts/${uid}/${postID}`)
        // console.log(postRef);
        remove(postRef)
        setUserPosts(userPosts.filter((post) => post.id !== postID))

    }
    return (
        <div>
            {isZeroPost ? "You haven't posted anyting yet!" : loadingPost ? 'Loading posts' :
                <div>
                    {userPosts.map((post, index) =>
                        <div className="post" key={index}>
                            <h1>{post.title}</h1>
                            <h3>Written By: {post.author} at {post.time.time} in {post.time.date} </h3>
                            <p>{post.content}</p>
                            <button onClick={() => { handleDelete(post.id) }}>Delete</button>
                        </div>
                    )}
                </div>
            }
        </div>
    )
}
export default Feeds