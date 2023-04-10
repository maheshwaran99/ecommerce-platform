import { BrowserRouter,Route,Routes } from "react-router-dom"
import Product from "./Components/Product"
import Dashboard from "./Components/Dashboard"
import Home from "./Components/Home"
import Cart from "./Components/Cart"
import Signup from "./Components/Signup"
import SignIn from "./Components/SignIn"

const App=()=>{
    return(
      <BrowserRouter>
      <Home />
      <Routes>
        <Route  Component={Dashboard} path="/"></Route>
        <Route  Component={Cart} path="/cart"></Route>
        <Route Component={Product} path="/product/:id"></Route>
        <Route Component={Signup} path="/signup"></Route>
        <Route Component={SignIn} path="/signin"></Route>
      </Routes>
      </BrowserRouter>
    )
}
export default App