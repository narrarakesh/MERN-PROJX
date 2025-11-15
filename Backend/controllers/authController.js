
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


// generate JWT token

const generateToken = (userId)=>{
    return jwt.sign({id: userId}, process.env.JWT_SECRET, {expiresIn: '7d'});
}

// @desc Register a new user
// @route POST /api/auth/register
// @access public
const registerUser = async (req, res) => {
    try {

        const {name , email, password, profileImageUrl, adminToken} = req.body;
        console.log(adminToken);
        //check user already exists
        const userExists = await User.findOne({email});
        if(userExists){
           return res.status(400).json({message: 'User already exists'});
        }

        let role = (adminToken == "63049") ? 'Admin' : 'Member';
        //let role = (adminInviteToken === process.env.ADMIN_INVITE_TOKEN) ? 'admin' : 'member';
        
        //hash the password

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create new user

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role
        });

        // Return user data with JWT token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token: generateToken(user._id)
        })
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message});
    }
};

// @desc Login a user
// @route POST /api/auth/login
// @access public
const loginUser = async (req, res) =>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: 'Invalid email or password'})
        }

        // compare password
        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({message: 'Invalid Password'});
        }

        // Return user data with JWT token
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            role: user.role,
            token: generateToken(user._id)
        })
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message});
    }
};


// @desc get user profile
// @route GET /api/auth/profile
// @ private  requires JWT
const getUserProfile = async (req, res)=>{
    try {
        const user = await User.findById(req.user.id).select("-password");
        // console.log(user);
        if(!user){
            return res.status(404).json({message: 'User Not found'});
        }
        res.json(user);
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message});
    }
};


// @desc get user profile
// @route PUT /api/auth/profile
// @ private requiresa JWT

const updateUserProfile = async (req, res) => {
    try {
        const user = User.findById(req.user.id);
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await User.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.email,
            token: generateToken(updatedUser._id)
        })
        
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message});
    }
};

module.exports = { registerUser, loginUser, getUserProfile , updateUserProfile };