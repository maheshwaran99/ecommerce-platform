import { Link } from "react-router-dom"
import style from "./home.module.css"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
const Home = () => {
    const navi = useNavigate()
    const [user, setUser] = useState(null)

    useEffect(()=>{
        let u = localStorage.getItem("user")

        if(u) setUser(u)
    }, [user])

    const logout = (e) => {
        e.preventDefault()
        localStorage.removeItem("user")
        setUser(null)
        navi("/signin")
    }

    return (
        <div id={style.nav}>

            <Link to="/">Home</Link>
            <h1>SHOPPING CART</h1>
            <Link to="/cart">
                <i class="fa-solid fa-cart-shopping"></i>
            </Link>
            <Link to="/signup">Sign Up</Link>
            {
                user ? <Link to="#" onClick={logout}>Logout</Link> : <Link to="/signin">Sign In</Link>
            }
        </div>
    )
}
export default Home