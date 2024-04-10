const User=require('../module/signupModule');
const fileUrlStore=require('../module/urlDownloadData')
const Expence=require('../module/module');
const { where } = require('sequelize');
const {parse}=require('csv')
const { convertArrayToCSV } = require('convert-array-to-csv');

const leaderBoard=async()=>{
    return  User.findAll({
        order:[['totalexpence','DESC']]
    });
}

const download=async(req)=>{
    return await Expence.findAll({where:{
        userID:req
    }})
}

const urlAddOnDataBase=async(userID,fileUrl)=>{

    const user=await User.findByPk(userID);
    if(!user){
        console.log("user not found for add url on database")
        return;
    }
    const urlCreated=await fileUrlStore.create({
        url:fileUrl,
        userId:userID
    });
    console.log('url created',urlCreated);
}

const csvFileGenerator=async(array)=>{
    const arrayToCsvFile=convertArrayToCSV(array);
    return arrayToCsvFile
}

const finalArrayForCsv=async(expenceArray)=>{

    const filterArray=expenceArray.map(exp=>({
        Id:exp.id,
        name:exp.name,
        amount:exp.exp,
        itemName:exp.item,
        category:exp.category,
        date:exp.createdAt
     }))
     return filterArray;
}


module.exports={
    leaderBoard,
    download,
    csvFileGenerator,
    finalArrayForCsv
    //urlAddOnDataBase
};