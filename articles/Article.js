const Sequelize = require("sequelize");
const Category = require("../categories/Category");
const connection = require("../database/database");

const Article = connection.define('articles',{
    idArticle:{
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
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }

});


Category.hasMany(Article); // uma categoria tem muitos artigos
Article.belongsTo(Category); //um artigo pertence a uma categoria
//Article.sync({force:true}); 



module.exports = Article;