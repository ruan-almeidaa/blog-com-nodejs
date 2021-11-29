const Sequelize = require("sequelize");
const connection = require("../database/database");

const User = connection.define('users',{
    idUser:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },password:{
        type: Sequelize.STRING,
        allowNull: false
    }

});

//User.sync({force:true}); 

module.exports = User;