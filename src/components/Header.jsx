import { useNavigate } from "react-router-dom"

function goBack(){
  window.history.back()
}
const Header = () => {
  // let navigate = useNavigate()
  const isHome = window.location.pathname == '/'
  return (
    <div>
       {
        isHome? null : <button onClick={goBack}>back</button>
       }
        <h1 className="app-header"> {'{Experimental UI}'} </h1>
    </div>
  )
}

export default Header