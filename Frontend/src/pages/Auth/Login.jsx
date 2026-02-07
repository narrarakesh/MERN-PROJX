import React, { useCallback, useState } from 'react'
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

    const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);
    const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);
    
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


            // Show toast before navigation
            toast.success("Authorization Successful");

            // Redirect based on role
            navigate(role === "Admin" ? "/admin/dashboard" : "/user/dashboard")

        }catch (error) {
            console.error("Login error:", error);

            // Get user-friendly message
            const message = error.response?.data?.message ?? "Something went wrong. Please try again.";

            // Show toast and update state
            toast.error(message);
            setError(message);
        }
    }

  return (
    <AuthLayout>
        <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center align-center'>
            <h3 className='text-xl font-semibold text-black' >Welcome Back</h3>
            <p className='text-xs text-slate-700 mt-[5px] mb-[12px]' >Please enter your details to log in</p>
            <br />
            <form onSubmit={handleLogin} className='flex flex-col gap-5 w-full' >
                <Input type="text"
                value={email}
                label='Email Address'
                placeholder='john@example.com'
                onChange={handleEmailChange} />

                <Input type="password"
                    value={password}
                    label='Password'
                    placeholder='Min 8 Charecters'
                    onChange={handlePasswordChange} 
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