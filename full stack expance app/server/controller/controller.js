const User=require('../module/module');
const Credential=require('../module/signupModule')
const sequelize=require('../util/database')
const Expence=require('../service/userExpences');
const { ConfigService } = require('aws-sdk');

module.exports.dataupload=async(req,res,next)=>{
    try{
        const t = await sequelize.transaction()
        const name=req.body.name;
        const exp=req.body.exp;
        const item=req.body.item;
        const category=req.body.category;
        if(exp.length===0 || exp===undefined){
            return res.status(400).json({success:false,message:'expence parameter missing'})
        }
        try{
            await User.create({
                name:name,
                exp:exp,
                item:item,
                category:category,
                userId:req.user.id
            },{transaction: t})

            const totalExpence=Number(req.user.totalexpence)+Number(exp);
            await Credential.update({totalexpence:totalExpence},{where:{id:req.user.id},transaction: t})

            await t.commit();
            res.status(200).json({expence:expence})

        }catch(err){
            return res.status(500).json({success:false,error:err})
        }
       
    }catch(err){
        console.log(err);
    }
}

module.exports.getdata=async(req,res,next)=>{
    let ITEMS_PER_PAGE=Number(req.query.ITEMS_PER_PAGE);
    console.log(req.user.id)
    let page=Number(req.query.page) || 1;
    let totalItems;
    await User.count({where:{userId:req.user.id}}).then((total)=>{
        totalItems=total;
        return User.findAll({
            offset:(page-1)*4,
            limit:ITEMS_PER_PAGE,
            where:{userId:req.user.id}
        });
    }).then((expence)=>{
        res.json({
            expence:expence,
            currentPage:page,
            hasNextPage:ITEMS_PER_PAGE*page<totalItems,
            nextPage:page+1,
            hasPreviousPage:page>1,
            previousPage:page-1,
            lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)
        })
    }).catch(err=>console.log(err))

}


module.exports.deletedata=async(req,res,next)=>{
    const t = await sequelize.transaction()
    const id=req.params.id;
    const deleteid=await Expence.getId(id);
    console.log(deleteid)
    console.log("deletd things expence:"+deleteid.exp)
    console.log("delete request user id:"+req.user.id)
    console.log("exp:"+req.user.totalexpence)
    
    try{
        const deleteid=await Expence.getId(id);
        if (!deleteid) {
            return res.status(404).json({ success: false, message: 'Data not found' });
        }
        console.log(deleteid)
        console.log("deletd things expence:"+deleteid.exp)
        console.log("delete request user id:"+req.user.id)
        console.log("exp:"+req.user.totalexpence)

        try{

            await deleteid.destroy({where:{userID:req.user.id},transaction:t});
            const totalExpence=Number(req.user.totalexpence)-Number(deleteid.exp);
            await Credential.update({totalexpence:totalExpence},{where:{id:req.user.id},transaction: t});
            await t.commit();

        }catch(err){

            console.log(err)
            return res.status(500).json({success:false,error:err})

        }
       

    }catch(err){

        console.log(err);
        await t.rollback();
        return res.send(err);

    }
}

