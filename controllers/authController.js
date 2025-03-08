const crypto=require('crypto')
const {promisify}=require('util')
const jwt=require('jsonwebtoken')
const User=require('D:\\PlacementPrediction-App\\models\\userPredModel.js')

exports.signin=async(req,res,next)=>{
    try{
        const newuser=await User.create(req.body)
        const token=jwt.sign({id:newuser._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
    
    //Creating Cookie
        const cookieoption={
            expires: new Date(
                Date.now()+ 90 *24*60*60*1000
            ),
            httpOnly: true
        }
        cookieoption.secure=true
        res.cookie('jwt',token,cookieoption)
        
        res.status(200).json({
            status:"success",
            user:{newuser},
            token:token
        })
    }catch(err){
        res.status(400).json({
            status:"fail",
            message:err.message
        })
    }
}

exports.login=async(req,res,next)=>{
    try{
        const email=req.body.email
        const password=req.body.password

        console.log(email,password)

        if(!email || !password){
            throw new Error("A user should provide a email and a password!!")
        }

        const user=await User.findOne({email:email})

        if(!user){
            throw new Error("User Does Not Exist!!")
        }

        else if(!(await user.correctPassword(password,user.password))){
            throw new Error("Incorrect Email or Password!!")
        }

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})

    //Creating Cookie
        const cookieoption={
            expires: new Date(
                Date.now()+ 90 *24*60*60*1000
            ),
            httpOnly: true
        }
        cookieoption.secure=true
        res.cookie('jwt',token,cookieoption)

        res.status(200).json({
            status:"success",
            user:{user},
            token:token
        })
    }catch(err){
        res.status(400).json({
            status:"fail",
            message: err.message
        })
    }
}

exports.protect=async(req,res,next)=>{
    try{
        let token
  
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token=req.headers.authorization.split(" ")[1]
        }else if(req.cookies.jwt){
            token=req.cookies.jwt
        }

        if(!token){
            throw new Error("You are not logged in! Please log in to get access!!")
        }

        const decoded= await promisify(jwt.verify)(token,process.env.JWT_SECRET)

        console.log(decoded.id)
        const user=await User.findById(decoded.id)

        if(!user){
            throw new Error("User Does Not Exist!!")
        }
        req.user=decoded.id
        next()
    }catch(err){
        res.status(401).json({
            status:"fail",
            message:err.message
        })
    }
}

exports.logged=async(req,res,next)=>{
        let token
        
        // console.log(req.cookies.jwt)
        if(req.cookies.jwt){
            token=req.cookies.jwt
        }

        if(!token){
            return next()
        }

        const decoded= await promisify(jwt.verify)(token,process.env.JWT_SECRET)

        // console.log(decoded.id)
        const user=await User.findById(decoded.id)

        if(!user){
            return next()
        }
        res.locals.user = user
        next()
}

exports.logout=(req,res)=>{
    const cookieoption={
        expires: new Date(
            Date.now()+ 2 * 1000
        ),
        httpOnly: true
    }
    cookieoption.secure=true
    res.cookie('jwt',"logouttoken",cookieoption)
    res.status(200).json({status:"success"})
}