const PremiumUser=require('../service/userPremium');
const dotnev=require('dotenv').config();
const fs=require('fs')
const cloudinaryUpload=require('../service/cloudservices');
const cloudinaryServices = require('../service/cloudservices');
const urlAddOnDataBase=require('../module/urlDownloadData')



module.exports.userleaderboard=async(req,res,next)=>{//send data accordingly user total expense
    try{
        console.log("leader bioard")
        const users= await PremiumUser.leaderBoard();
        console.log(users)
        res.status(200).json(users)

    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
}


module.exports.downloadexpence=async(req,res,next)=>{
    try{
        const userID=req.user.id
        const userName=req.user.name
        console.log("userId"+userID+"user name"+userName)
        const userExpence = await PremiumUser.download(userID);//get the full array of expence of user
        const expenceArray=userExpence.map(exp=>exp.dataValues)//map only those element of array from database 
        const filterArray=await PremiumUser.finalArrayForCsv(expenceArray);//filter the element which will need of an user
        const csvFile=await PremiumUser.csvFileGenerator(filterArray)//make the csv file of that filtered expence array
        const filename=`Expense_${userID}-${userName}/${new Date()}.csv`;//name of that file in cloud
        const fileUrl=await cloudinaryServices(csvFile,filename);//we will get fileUrl from cloudinary
        //file url store in our own data base
        await urlAddOnDataBase.create({
            url:fileUrl,
            userId:userID
        })
        res.status(200).json({fileUrl,success:true})
    }catch(error){
        console.log(error);
        res.status(500).json({fileUrl:" ",error:error})
    }
    
}