import {  useState } from "react"
import style from "./home.module.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Signup=()=>{
   
    let [email,setEmail]=useState("")
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    let navi = useNavigate();

   
    let emailData=(e)=>{
        setEmail(e.target.value)
    }
  
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
      };
    
      const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
      };
    
      const handleSubmit = (event) => {
        event.preventDefault();
        if (password.length < 8) {
          setError('Password must be at least 8 characters long');
        } else if (!password.match(/[A-Z]/)) {
          setError('Password must contain at least one uppercase letter');
        } else if (!password.match(/[0-9]/)) {
          setError('Password must contain at least one number');
        } else if (password !== confirmPassword) {
          setError('Passwords do not match');
        } else {
          setError('');
          let payLoad = {email,password}
          axios.get(`http://localhost:3000/users?email=${email}`).then(res => {
            if(res.data.length > 0) {
              alert("Email already exists, try sign in")
            }
            else {
              axios.post("http://localhost:3000/users",payLoad)
              .then(()=>{
                  console.log("Data Added");
              }).catch(()=>{
                  console.log("Not Added");
              })
              navi("/")
            }
          })
        }
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
          <label>
            Confirm Password:
            <input type="password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
        {error && <p>{error}</p>}
      </div>
    );
  
}
export default Signup