const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const findCredential=require('../service/userCredential')

function generateAccessToken(id,name){//generate token
    return jwt.sign({userId:id,name:name},process.env.token)
}

module.exports.login=async(req,res,next)=>{//login in data base
        const email=req.body.email;
        const password=req.body.password;
        console.log(req)
        const credentialCheck=await findCredential.findCredential(req,email).then(user =>{
            if(user.length>0){
                bcrypt.compare(password,user[0].password,(err,result)=>{//hash decryption
                    if(result){
                        res.status(200).json({success:true,message:'user logged in succesfully',user:user,token:generateAccessToken(user[0].id,user[0].name)})
                    }else{
                        return res.status(400).json({success:false,message:'check password'})
                    }

                    if(err){
                        res.status(500).json({success:false,message:`something error:${err}`})
                    }
                })
            }else{
                res.status(404).json({success:false,message:"user not signup"})
            }
        }).catch(err=>{
            res.status(500).json({success:false,message:`something error:${err}`})
        })
        
}


module.exports.ispremium=async (req,res,next)=>{//check user is premium or not
    console.log(req.user.id)
    const detail=await findCredential.ispremium(req);
    console.log(detail)
    res.send(detail);
}