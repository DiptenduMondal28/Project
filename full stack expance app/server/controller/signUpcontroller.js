const Credential=require('../module/signupModule');
const bcrypt=require('bcrypt');

function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true;
    }else{
        return false;
    }
}

module.exports.signup=async(req,res,next)=>{
    const {name,email,password}=req.body;
    try{
        console.log(`name: ${name}  email:${email} password:${password}`);
        if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err:'bad parameters fill paramters'})
        }
        bcrypt.hash(password,10,async(err,hash)=>{
            console.log(err)
            await Credential.create({//use create a new user
                name,email,password:hash
            }).then(()=>{
                res.status(201).json({message:'successfully created a profile'})
            })
        })
        
        
    }catch(err){
       res.status(500).json(err)
    }
}


