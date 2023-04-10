import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import style from "./home.module.css"
// import Product from "./Product"
// import { Link } from "react-router-dom"




const Dashboard = () => {
    let [content, setContent] = useState([])
    let navigate = useNavigate();
    
    useEffect(() => {
        axios.get("http://localhost:3000/products")
            .then((resp) => {
                setContent(resp.data)
            })
    }, [])



    const handleAddToCart = (id) => {
        // get user in localstorage
        let user = JSON.parse(localStorage.getItem("user"));

        //check if user is there or not
        if(!user) {
            //ask to sign in 
            alert("Sign in to add to cart")
            return;
        }

        //get cart of that user
        axios.get(`http://localhost:3000/cart?userId=${user.id}`).then((res) => {
            let data = res.data
            if(data.length > 0){
                //get cartobj from array
                let cart = data[0].cart

                //try to get index of the item trying to add
                let index = cart.findIndex(c => c.itemId === id)

                //check whether item exists
                if(index !== -1){
                    // if yes increment the quantity
                    cart[index].quantity = cart[index].quantity+1
                }
                else {
                    // if no add the item to the items in cart
                    let payload = {
                        itemId: id,
                        quantity: 1
                    }
                    cart.push(payload)
                }

                //update the user cart
                axios.put(`http://localhost:3000/cart/${data[0].id}`, {
                    userId: data[0].userId,
                    cart: cart
                })
            }
            else {

                //create a fresh cart for the user
                let newCart = {
                    userId: user.id,
                    cart: [{
                        itemId: id,
                        quantity: 1
                    }]
                }
                axios.post("http://localhost:3000/cart", newCart)
            }
        })
    }

    return (
        <div id={style.card} >
            {content.map((product) => {
                return (
                    <div className={style.myCard}>
                        <img 
                            src={product.thumbnail} 
                            alt="" 
                            className={style.img}
                            onClick={()=>{navigate(`/product/${product.id}`)}}
                        />
                        <div className={style.details}>
                            <h5>{product.title}</h5>
                            <h6>Price:{`$${product.price}`}</h6>
                            <h6>Discount:{product.discountPercentage}</h6>
                            <h6>Rating:{product.rating}</h6>
                            <div>
                                {product.stock > 0 ? <button>Available</button>:<button>Out of Stock</button>} 
                              <div>
                              <button onClick={()=>{handleAddToCart(product.id)}}>Add To Cart</button> 
                              </div>
                            </div>

                        </div>
                    </div>
                )
            })}
        </div>



    )
}
export default Dashboard