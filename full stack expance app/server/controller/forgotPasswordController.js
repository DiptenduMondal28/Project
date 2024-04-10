const User = require('../module/signupModule');
const Sib=require('sib-api-v3-sdk');
const uuid=require('uuid');
require('dotenv').config();
const Forgotpassword=require('../module/forgotPasswordRequestModule')
const bcrypt=require('bcrypt')


module.exports.forgotPassword=async(req,res,next)=>{


    const forgotUserEmail=req.body.email;
    console.log(forgotUserEmail)

    const user=await User.findOne({where:{email:forgotUserEmail}})
    

    if(user){
        const id = uuid.v4();
        await Forgotpassword.create({id,active: true ,userId:user.id})
            const client=Sib.ApiClient.instance;

            // Configure API key authorization: api-key
            var apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.API_KEY;
            const tranEmailApi=new Sib.TransactionalEmailsApi;
        
            const sender={
                email:'tony28mondal@gmail.com'
            }
            const receivers=[
                {
                    email:forgotUserEmail
                }
            ]
        
            tranEmailApi.sendTransacEmail({
                sender,
                to:receivers,
                subject:'OTP VERIFICATION',
                textContent:'click under this link to reset your password',
                htmlContent: `<html>
                <h4>from diptendu mondal team</h4>
                <p>to reset your password please click on the below link</p>
                <a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>
                </html>`,
                textContent:"if you are able to change your password go to te login page and login again"
            }).then(result=>{
                console.log(result);
                res.status(201).json({success:true,message:'we have send you OTP in your user email account'});
            }).catch(err=>{
                console.log(err)
                return res.status(500).json(err)
            })
        }else{
            console.log('no user found')
            return res.json({ message: "user did not exist", success: false });
        }
   
}

module.exports.resetpassword=async(req,res,next)=>{
    const id=req.params.id;
    Forgotpassword.findOne({where:{id}}).then(forgotrequestpassword=>{
        if(forgotrequestpassword){
            forgotrequestpassword.update({active:false})
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                            console.log('called')
                                        }
                                    </script>

                                    <form action="/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()
        }
    })
}

module.exports.updatepassword=async(req,res,next)=>{
    try{
        const {newpassword}=req.query;
        const {resetpasswordid}=req.params;
        console.log(newpassword)
        Forgotpassword.findOne({where:{id:resetpasswordid}}).then(resetpasswordrequest=>{
            console.log(resetpasswordrequest)
            User.findOne({where:{id:resetpasswordrequest.userId}}).then(user=>{
                if(user){
                    const saltRounds=10;
                    bcrypt.genSalt(saltRounds,function(err,salt){
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword,salt,function(err,hash){
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({password:hash}).then(()=>{
                                res.status(201).json({success:true,message:"user password update successfully"});
                            })
                        });
                    });
                }
            })
        })
    }catch(err){
        return res.status(403).json({err,success:false})
    }
}