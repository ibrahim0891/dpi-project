import { getDatabase, ref, set, push, get } from "firebase/database"
import { useState } from "react"
import useUserData from "../customHook/useUserData"
const CreatePost = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const { currentUserData, dataFetched, uid } = useUserData()
    const [postState, setPostState] = useState('Publish')
    const handlePostCreate = (e) => {
        e.preventDefault();
        setPostState('Publishing...')
        const postsRef = ref(getDatabase(), 'posts')
        const newPostRef = push(postsRef)
        const postId = newPostRef.key
        const postData = {
            author: currentUserData.firstName + ' ' + currentUserData.lastName,
            title: title,
            content: content
        }
        const postRef = ref(getDatabase(), `posts/${uid}/${postId}`)
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
            {
                postState == 'Published' ? <h3> Post published! </h3> :
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