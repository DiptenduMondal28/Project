const express=require('express');
const bodyParser=require('body-parser');
const sequelize=require('./util/database');
const cors=require('cors');
const router=require('./router/router')

const app=express();
app.use(bodyParser.json());
app.use(cors());

app.use(router)
app.use((req,res,next)=>{
    res.status(404).send('<h1>404 error!</h1>')
})

sequelize.sync().then(result=>{
    console.log('sync')
    app.listen(3000);
}).catch(err=>{
    console.log(err);
});