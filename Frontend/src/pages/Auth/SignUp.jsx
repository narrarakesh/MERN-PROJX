import React, { useCallback, useContext, useState } from 'react'
import { validateEmail } from '../../utils/helper';
import AuthLayout from '../../components/layouts/AuthLayout';
import Input from '../../components/inputs/Input';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';
import toast from 'react-hot-toast';

const SignUp = () => {
    const [profilePic, setProfilePic] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [fullName, setFullName] = useState('');
    const [adminToken, setAdminToken]= useState('');


    const navigate = useNavigate();
    const {updateUser} = useContext(UserContext);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        switch (name) {
            case "fullName":
            setFullName(value);
            break;
            case "email":
            setEmail(value);
            break;
            case "password":
            setPassword(value);
            break;
            case "adminToken":
            setAdminToken(value);
            break;
            default:
            break;
        }
        }, []);


    const handleSignUp = async (e) =>{
        e.preventDefault();
        setError('');


        let profileImageUrl='';
        // Frontend validation
        if (!fullName) return setError('Please enter the full name');
        if (!validateEmail(email)) return setError('Please enter a valid email address');
        if (!password) return setError('Please enter the password');
        if (!profilePic) return setError('Please upload the profile picture');

        

        //logIn Api call
        try {

        //upload image if present

        if(profilePic){
          const imageUploadResponse = await uploadImage(profilePic);
          profileImageUrl = imageUploadResponse.imageUrl || "";

        }
        const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
          name: fullName, 
          email,
          password,
          profileImageUrl:  profileImageUrl,
          adminToken,
      
        });

        const {token , role} = response.data;

        if(token){
          localStorage.setItem("token", token);
          updateUser(response.data);
        }

        toast.success('Account created successfully!');

        navigate(role === 'Admin' ? '/admin/dashboard' : '/user/dashboard');

       } catch (error) {
        console.log("Login error:", error);
            if(error.response && error.response.data.message){
                setError(error.response.data.message);
            }else{
                setError("Something went wrong. Please try again.")
            }
       }
    }

  return (
    <AuthLayout>
        <div className='lg:w-[100%] h-auto md:h-full flex flex-col justify-center  mt-10 md:mt-0'>
            <h3 className='text-xl font-semibold text-black' >Create an Account</h3>
            <p className='text-xs text-slate-700 mt-[5px] mb-[12px]' >Join us today by entering your details below</p>
            <br />

              <form onSubmit={handleSignUp}  >

                <ProfilePhotoSelector image={profilePic} setImage={setProfilePic}></ProfilePhotoSelector>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <Input type="text"
                  value={fullName}
                  label='Full Name'
                  placeholder='John'
                  onChange={handleChange} />

                  <Input type="text"
                  value={email}
                  label='Email Address'
                  placeholder='john@example.com'
                  onChange={handleChange} />

                  <Input type="password"
                      value={password}
                      label='Password'
                      placeholder='Min 8 Charecters'
                      onChange={handleChange} 
                  />

                  <Input type="text"
                  value={adminToken}
                  label='Admin Invite Token'
                  placeholder='6 Digit Code'
                  onChange={handleChange} />

                  { error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

                  

                </div>
                <button type='submit' className='btn-primary'>SignUp</button>

                  <p className='text-[13px] text-slate-800 mt-3'>
                      Have an account ? {' '}
                      <Link className='font-medium text-[#1368EC] underline' to='/login' >Log in
                      </Link>
                  </p>
              </form>

        </div>

    </AuthLayout>
  )
}

export default SignUp