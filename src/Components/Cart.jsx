import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Cart = () => {

    const navi = useNavigate()
    const [cart, setCart] = useState(null)
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)


    const fetchCart = () => {

        //get user from local
        let user = JSON.parse(localStorage.getItem("user"))

        //if no user is there redirect to dashboard
        if(!user) {
            navi("/")
            return
        }

        //if user is there get the user cart
        axios.get("http://localhost:3000/cart?userId=" + user.id).then(({ data }) => {
            //levae the function if there is no cart
            if(data.length < 1) return

            //set cart to state
            setCart(data[0])

            let cart = data[0].cart

            //getting all products
            axios.get("http://localhost:3000/products").then(({ data: products }) => {

                //loop the cart to merge each item in the cart with respective product
                let newCart = cart.map(item => {

                    //find the product of the current item from cart
                    let product = products.find(p => p.id === item.itemId)

                    //get needed details from product object and merge it with cart item
                    return {
                        itemId: item.itemId,
                        image: product.thumbnail,
                        name: product.title,
                        price: product.price,
                        quantity: item.quantity,
                        extendedPrice: (product.price * item.quantity)
                    }
                })

                //to get total
                let sum = 0

                //loop to add extended price for total
                newCart.forEach(item => {
                    sum = parseFloat(sum) + parseFloat(item.extendedPrice)
                });

                //set cart data
                setData(newCart)
                //set total
                setTotal(sum)

            })
        })
    }



    useEffect(() => {
    
        //getting cart
        fetchCart()
    }, [])

    const handleUpdateCartItem = (itemId, quantity) => {
        //find index of the item quantity we trying to update
        let item = cart.cart.findIndex(i => i.itemId === itemId)

        //copy the cart items to new variable
        let newItems = [...cart.cart]

        //update the quantity of the item index
        newItems[item].quantity = parseInt(quantity)

        //update the whole cart with new items 
        axios.put("http://localhost:3000/cart/"+cart.id, {
            userId: cart.userId,
            cart: newItems
        }).then(()=> {

            //finally after updating the cart fetch the data again
            fetchCart()
        })
    }

    const handleRemoveItem = (itemId) => {

        //filter items that doesn't have the selected item id
        let newItems = cart.cart.filter(i => i.itemId !== itemId)

        // new items will have all the items in cart except the selected item id

        //update the whole cart with new items 
        axios.put("http://localhost:3000/cart/"+cart.id, {
            userId: cart.userId,
            cart: newItems
        }).then(()=> {
            //finally after updating the cart fetch the data again
            fetchCart()
        })
    }

  
    return (
        <div>
            <table>
                <thead>
                <tr>
                    <th>Product</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Extended Price</th>
                </tr>
                </thead>
                <tbody>
                {data.map(item => {
                    return (
                        <tr>
                            <td><img
                                src={item.image} alt=""
                            /></td>
                            <td>{item.name}</td>
                            <td>{item.price}</td>
                            <td><input 
                                name="quantity"
                                value={item.quantity}
                                type="number"
                                onChange={(e) => {
                                    handleUpdateCartItem(item.itemId,e.target.value)
                                }}
                            /></td>
                            <td>{item.extendedPrice}</td>
                            <td><button 
                                onClick={() => {
                                    handleRemoveItem(item.itemId)
                                }}
                            >Remove</button></td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
            <p>Total: {total}</p>
        </div>
    )
}

export default Cart