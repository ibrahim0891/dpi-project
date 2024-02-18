import { getDatabase, ref, set, push } from "firebase/database"
import { useState } from "react"
import useUserData from "../customHook/useUserData"
import { redirect } from "react-router-dom"

const CreatePost = () => {
    const [title, setTitle] = useState('') //get the title from input
    const [content, setContent] = useState('') //get the text content from input
    const { currentUserData,  uid } = useUserData() //get the currently logged in user data and uid

    const [postState, setPostState] = useState('Publish') //controle the state when user click 'publish' button

    //Handle the creation of a post 
    const handlePostCreate = (e) => {
        e.preventDefault();
        setPostState('Publishing...') //update the postState as soon as user click 'publish' button
        const postsRef = ref(getDatabase(), 'posts') //get the db referene to posts node
        const newPostRef = push(postsRef)
        const postId = newPostRef.key //get an uid for each new post
        const date = new Date() 

        //setup post data that will be sent to db
        const postData = {
            author: currentUserData.firstName + ' ' + currentUserData.lastName,
            title: title,
            content: content,
            timestamp: {
                time: date.toLocaleTimeString(),
                date: date.toLocaleDateString()
            }
        }
        const postRef = ref(getDatabase(), `posts/${uid}/${postId}`) // create a reference to new post id to store the date

        // send the post data 
        set(postRef, postData).then(() => {
            console.log('Post stored');
            setPostState("Published")
        }).catch((error) => {
            console.log(error);
        })
    }
    return (
        <div className="sign">
            <h1>Create new post.</h1>
            {/* send user to profile page is post is published otherwise show the form to create a new post  */}
            {
                postState == 'Published' ? redirect("/profile"):
                <form action="">
                    <label> Post Title </label>
                    <input type="text" placeholder="Write post title" onChange={(e) => setTitle(e.target.value)} />
                    <label htmlFor="">Post content</label>
                    <textarea name="" id="" cols="30" rows="10" placeholder="Write main content of your post here..." onChange={(e) => setContent(e.target.value)}></textarea>
                    <button onClick={handlePostCreate}>{postState}</button>
                </form>
            }
        </div>
    )
}
export default CreatePost