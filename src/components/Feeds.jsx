/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import useUserData from "../customHook/useUserData"
import { getDatabase, ref, child, get, remove, onChildAdded, onChildRemoved } from "firebase/database"


const Feeds = () => {
    const { currentUserData,  uid } = useUserData(); //get current user id
    const [userPosts, setUserPosts] = useState([]) //set an array to store the posts of user
    const [loadingPost, setIsloadingPost] = useState(true)
    const [isZeroPost, setIsZeropost] = useState(false) //return true if user haven't posted any shit yet

    //update posts in realtime
    useEffect(() => {
        const db = getDatabase()
        //get initial posts snapshot
        get(child(ref(db), `/posts/${uid}`)).then((snapshot) => {
            handlePostSnapShot(snapshot);
        }).catch((error) => {
            console.log((error));
        }).finally(() => {
            setIsloadingPost(false)
        })

        //reture the snapshot for any new post
        onChildAdded(ref(db, `/posts/${uid}`), (snapshot) => {
            handlePostAdded(snapshot)
        })

        //return snapshot for any removed post
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
            if (!userPosts.length == 1){
                setUserPosts((prevPost) => {
                    return [...prevPost, newPost]
                })
            }
        }

        setIsZeropost(false)

    }
    const handlePostRemoved = (snapshot) => {
        const deletedPostId = snapshot.key
        console.log(deletedPostId);
        setUserPosts((userPosts) => userPosts.filter((post) => { post.id !== deletedPostId }))
        if (userPosts.length == 1) {
            setIsZeropost(true)
        }
    }
    const handleDelete = (postID) => {
        const postRef = ref(getDatabase(), `/posts/${uid}/${postID}`)
        // console.log(postRef);
        remove(postRef)
        setUserPosts((userPosts)=> userPosts.filter((post) => post.id !== postID))
        if(userPosts.length == 1){
            setIsZeropost(true)
        }
    }
    return (
        <div>
            {isZeroPost ? "You haven't posted anyting yet!" : loadingPost ? 'Loading posts' :
                <div>
                    {userPosts.map((post, index) =>
                        <div className="post" key={index}>
                            <h1>{post.title}</h1>
                            <h3>Written By: {post.author} at {post.timestamp.time} in {post.timestamp.date} </h3>
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