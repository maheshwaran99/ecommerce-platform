import axios from "axios"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import style from "./home.module.css"

const Product = () => {
    let { id } = useParams()
    let [item, setItem] = useState([])
    let [quantity, setQuantity] = useState(1)

    useEffect(() => {
        axios.get(`http://localhost:3000/products/${id}`).then((resp) => {
            setItem(resp.data)
            console.log(resp.data)
        })
    },[])

    const handleAddToCart = () => {
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
                    cart[index].quantity = cart[index].quantity+quantity
                }
                else {
                    // if no add the item to the items in cart
                    let payload = {
                        itemId: parseInt(id),
                        quantity: quantity
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
                        itemId: parseInt(id),
                        quantity: quantity
                    }]
                }
                axios.post("http://localhost:3000/cart", newCart)
            }
        })
    }


    return (
        <div className={style.myCard}>
            <img src={item.thumbnail} alt="" />
            <div className={style.details}>
                <h5>{item.title}</h5>
                <h6>Price:{`$${item.price}`}</h6>
                <h6>Discount:{item.discountPercentage}</h6>
                <h6>Rating:{item.rating}</h6>
                <input
                    name="quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                        if(e.target.value >= parseInt(e.target.value))
                            setQuantity(parseInt(e.target.value))
                        else
                            setQuantity(1)
                    }}
                />
                <button onClick={()=>{handleAddToCart()}}>Add To Cart</button> 
            </div>
        </div>
    )
}
export default Product