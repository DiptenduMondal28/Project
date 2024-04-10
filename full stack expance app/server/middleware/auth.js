const jwt=require('jsonwebtoken');
const User=require('../module/signupModule');

const authenticate=(req,res,next)=>{
    try{
    const token=req.header('Authorization');
    // console.log(token);
    const user=jwt.verify(token,'3fb0815c28219e153c15456797f7f6df222623ea516cee8c9482b06915ac3710');
    // console.log("user id>>"+user.userId)
    if (!user.userId) {
        throw new Error('Invalid user ID');
    }
    User.findByPk(user.userId).then(user=>{
        // console.log(JSON.stringify(user));
        req.user=user;
        next();
    }).catch(err=>{
        throw new Error(err)
    })
    }catch(err){
        console.log(err);
        return res.status(401).json({success:false})
    }
}

module.exports={authenticate}