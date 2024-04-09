//import core module
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const path=require('path');
const fs=require('fs')
const dotenv=require('dotenv');
dotenv.config();
const helmet=require('helmet');
const compression=require('compression');
const morgan=require('morgan');

//database import
const sequelize=require('./util/database');

//routers import
const route=require('./router/router');
const signupRouter=require('./router/signupRoute')
const loginRouter=require('./router/loginRouter');
const purchase=require('./router/purchase');
const premiumUser=require('./router/premiumuserrouter')
const forgotPassword=require('./router/forgotPasswordRouter')

//file import 
const User = require('./module/signupModule');
const Expence = require('./module/module');
const Order=require('./module/puchase');
const ForgotPassword=require('./module/forgotPasswordRequestModule')
const UrlModule=require('./module/urlDownloadData')


//file system store for matgan
const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});


//use of express module
const app=express();
app.use(helmet());
app.use(compression());
app.use(morgan('combined',{stream:accessLogStream}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use(signupRouter) //sign up page router
app.use('/password',forgotPassword);//forgot password router
app.use(loginRouter)//logn router
app.use(route);//webpage router
app.use('/purchase',purchase);//purchase on rozer pay or not
app.use('/premium',premiumUser)//premium user or not

// use of bad router address
app.use((req,res,next)=>{
    res.status(404).send('<h1>404 Error!</h1><br><h4>no page exixt like that URL!</h4>')
})

User.hasMany(Expence);
Expence.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(UrlModule);
UrlModule.belongsTo(User);

sequelize.sync().then(result=>{
    console.log("sync s")
    app.listen(process.env.PORT);
}).catch(err=>{
    console.log(err);
});
