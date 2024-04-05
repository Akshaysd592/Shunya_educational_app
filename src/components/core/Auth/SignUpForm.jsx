import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { sendOtp, signUp } from '../../../services/operations/authApi';
import { ACCOUNT_TYPE } from '../../../utils/constants';
import toast from 'react-hot-toast';
import { setSignupData } from '../../../slices/authSlice';
import Tab from '../../Common/Tab';

const SignUpForm = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // student and instructor +.
    const [accountType , setAccountType] = useState(ACCOUNT_TYPE.STUDENT);
   
    const [formData, setFormData] = useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        confirmPassword :"",
    })

    const [showPassword,setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const {firstName, lastName, email, password, confirmPassword} = formData;
  
    const handleOnChange = (e)=>{
        setFormData((prevData)=>({
            ...prevData,
            [e.target.name]: e.target.value
        }))
    }

    const handleOnSubmit = (e)=>{
        e.preventDefault();
        if(password !== confirmPassword ){
            toast.error("Passwords do not match");
            return;
        }

        const signUpdata = {
            ...formData,
            accountType,
        }

        // setting signup data to state
        // to be used after otp verification
        dispatch(setSignupData(signUpdata))
        // send Otp to user for verification 
        dispatch(sendOtp(formData.email, navigate))
      
        // reset 
        setFormData({
            firstName:"",
            lastName:"",
            email:"",
            password:"",
            confirmPassword:"",
        })
        setAccountType(ACCOUNT_TYPE.STUDENT);
    }

    // data to be passed to Tab component 

    const tabData = [
        {
            id:1,
            tabName:"Student",
            type: ACCOUNT_TYPE.STUDENT,

        },
        {
            id:2,
            tabName:"Instructor",
            type: ACCOUNT_TYPE.INSTRUCTOR,
        }
    ]



  return (
    <div>
        {/* Tab  */}
        {/* <Tab tabData={tabData} field={accountType} setField={setAccountType} /> */}
    </div>
  )
}

export default SignUpForm