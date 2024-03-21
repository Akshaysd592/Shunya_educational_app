import {combineReducers} from '@reduxjs/toolkit'


import authReducer from '../slices/authSlice.js'
import cartReducer from '../slices/cartSlice.js'
import courseReducer from '../slices/courseSlice.js'
import profileReducer from '../slices/profileSlice.js'
import viewCourseReducer from '../slices/viewCourseSlice.js'



const rootReducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    course: courseReducer,
    profile: profileReducer,
    viewCourse: viewCourseReducer,
})

export default rootReducer;