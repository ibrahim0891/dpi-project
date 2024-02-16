/* eslint-disable react/prop-types */
const Loader = ({state, isLogIn, isAuthPage , loaderMessage}) => {  //state checkes if anyting is loading or not logIn cheeck if the action was login or signup

    //TODO: check if the loader is in authentication page and set props to set loading message
    return (
        <div className="loader" style={{display : (state? "flex": 'none')}}>
            <img className="loader-image" src="./funnyLoader.gif" alt="" />
           <p>
           { isAuthPage? (state ? (isLogIn ? "Logging you in...":"Creating an account..."): null ) : loaderMessage }
            </p> 
          </div>
    )
  
}
export default Loader