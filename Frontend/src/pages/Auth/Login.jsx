import React, { useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useContext } from 'react';
import { UserContext } from '../../context/userContext';
import { toast } from 'react-hot-toast';


const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { updateUser } = useContext(UserContext) 
    const navigate = useNavigate();

    const handleLogin = async (e) =>{
        e.preventDefault();

        if(!validateEmail(email)){
            setError('Please enter a valid email address');
            return;
        }

        if(!password){
            setError('Please enter the password');
            return;
        }

        setError('');

       try {
        const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
            email,
            password
        });

        const {token , role}=response.data;
        
        if(token){
            localStorage.setItem("token", token);
            updateUser(response.data);
        }


        // redirect based on role
        if(role === 'Admin'){
            toast.success("Authorization Successful");
            navigate('/admin/dashboard');
        }else{
            toast.success("Authorization Successful");
            navigate('/user/dashboard');
        }

       } catch (error) {
        console.log("Login error:", error);
        toast.error("Login error:", error);
            if(error.response && error.response.data.message){
                setError(error.response.data.message);
            }else{
                setError("Something went wrong. Please try again.")
            }
       }
    }

  return (
    <AuthLayout>
        <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center align-center'>
            <h3 className='text-xl font-semibold text-black' >Welcome Back</h3>
            <p className='text-xs text-slate-700 mt-[5px] mb-[12px]' >Please enter your details to log in</p>
            <br />
            <form onSubmit={handleLogin} className='flex flex-col gap-5' >
                <Input type="text"
                value={email}
                label='Email Address'
                placeholder='john@example.com'
                onChange={(e)=> setEmail(e.target.value)} />

                <Input type="password"
                    value={password}
                    label='Password'
                    placeholder='Min 8 Charecters'
                    onChange={(e)=> setPassword(e.target.value)} 
                />

                { error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

                <button type='submit' className='btn-primary'>Login</button>

                <p className='text-[13px] text-slate-800 mt-3'>
                    Don't have an account ? {' '}
                    <Link className='font-medium text-[#1368EC] underline' to='/signUp' >Sign Up
                    </Link>
                </p>

            </form>

        </div>

    </AuthLayout>
  )
}

export default Login