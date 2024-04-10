const Sequelize=require('sequelize');
require('dotenv').config();

const sequelize=new Sequelize('expence','root',process.env.DATABASE_PASSWORD,{dialect:'mysql',host:'localhost'});

module.exports=sequelize;