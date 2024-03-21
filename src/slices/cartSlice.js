import {createSlice} from '@reduxjs/toolkit'
import {toast} from 'react-hot-toast'

const initialState = {
    cart: localStorage.getItem("cart")?
     JSON.parse(localStorage.getItem("cart")):[],

    total: localStorage.getItem("total")?
    JSON.parse(localStorage.getItem("total")):0,

    totalItems: localStorage.getItem("totalItems")?
    JSON.parse(localStorage.getItem("totalItems")):0

}


const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{
        addToCart : (state,action)=>{
            const course = action.payload;
            const index = state.cart.findIndex((item)=>item._id === course._id)

            if(index >=0){
                // if course is already in the cart then give error toast
                toast.error("Course Already in cart");
                return;
            }

            // if not available in cart then push in it
            state.cart.push(course)
            //update the variables available
            state.totalItems +=1 
            state.total += course.price

            // updating local storage 
            localStorage.setItem("cart",JSON.stringify(state.cart));
            localStorage.setItem("total",JSON.stringify(state.total));
            localStorage.setItem("totalItems",JSON.stringify(state.totalItems))

            // show toast 
            toast.success("Course added to cart")

        },
        removeFromCart:(state,action)=>{
            const courseId = action.payload;
            const index = state.cart.findIndex((item)=>item._id === courseId)

            if(index>=0){
                // if course is found in cart then remove it
                state.totalItems -= 1;
                state.total -= state.cart[index].price;
                state.cart.splice(index,1);


                // update localstorage
                localStorage.setItem("cart",JSON.stringify(state.cart));
                localStorage.setItem("total",JSON.stringify(state.total));
                localStorage.setItem("totalItems",JSON.stringify(state.totalItems));


                // success toast
                toast.success("Course removed successfully");

            }
        },
        resetCart:(state)=>{
            state.cart  = [],
            state.total = 0,
            state.totalItems = 0;

            // update localStorage
            localStorage.removeItem("cart");
            localStorage.removeItem("total");
            localStorage.removeItem("totalItems");
        },


    },
});


export const {addToCart,removeFromCart,resetCart} = cartSlice.actions;

export default cartSlice.reducer ;
