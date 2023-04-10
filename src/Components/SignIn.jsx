import {  useState } from "react"
import style from "./home.module.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const SignIn=()=>{
   
    let [email,setEmail]=useState("")
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    let navi = useNavigate();

   
    let emailData=(e)=>{
        setEmail(e.target.value)
    }
  
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
      };
    
      const handleSubmit = (event) => {
        event.preventDefault();
        axios.get(`http://localhost:3000/users?email=${email}`)
          .then((res)=>{
              if(res.data.length > 0) {
                let user = res.data[0]
                if(user.password === password) {
                    localStorage.setItem("user", JSON.stringify({id: user.id, email: user.password}))
                    window.location.href = "http://localhost:3001/"
                }
                else alert("Incorrect Password")
              }
              else alert("Email doesn't exist, please sign up")
          }).catch((e)=>{
              console.log("Error Occured >>",e)
          })
      };
     
    return(
        <div id={style.myForm}>
        <form onSubmit={handleSubmit}>
            <label>
                email:
                <input type="text" value={email} onChange={emailData} />
            </label>
            <br />
          <label>
            Password:
            <input type="password" value={password} onChange={handlePasswordChange} />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    );
  
}
export default SignIn