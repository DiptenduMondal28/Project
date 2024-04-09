const cloudinary=require('cloudinary').v2;
const { rejects } = require('assert');
const { error } = require('console');
const { resolve } = require('path');
const {Readable}=require('stream');
require('dotenv').config();
cloudinary.config({
    cloud_name:process.env.CLOUDNAME,
    api_key:process.env.CLOUDAPIKEY,
    api_secret:process.env.CLOUDAPISECREAT
});

function uploadToCloudinary(csvFile,fileName){
    return new Promise((resolve,reject)=>{
        const uploadStream=cloudinary.uploader.upload_stream({
            folder:"Expence_tracker",resource_type:'raw',public_id:fileName
        },
            (error,result)=>{
                if(error){
                    reject(error)
                }else{
                    resolve(result.secure_url)
                }
            }
        )
        const buffer_stream=Buffer.from(csvFile,"utf-8");
        const readable_stream=Readable.from([buffer_stream]);
        readable_stream.pipe(uploadStream)
    })
}

module.exports=uploadToCloudinary