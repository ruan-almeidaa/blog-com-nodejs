const Sequelize = require("sequelize");
const connection = require("../database/database");

const Category = connection.define('categories',{
    idCategory:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug:{
        type: Sequelize.STRING,
        allowNull: false
    }

});

//Category.sync({force:true}); 

module.exports = Category;