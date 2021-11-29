const express = require("express");
const connection = require("./database/database");
const app = express();
const session = require('express-session');

//models
const Category = require("./categories/Category");
const Article = require("./articles/Article");
const User = require("./user/User");

//constrollers
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require("./user/UserController");

//config de sessões
app.use(session({
    secret: "lorem ipsum",
    cookie:{maxAge: 3000000000}
}));

//definindo EJS como minha view engine
app.set('view engine','ejs');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//definindo que arquivos estáticos ficarão na pasta public
app.use(express.static('public'));

//conexao com banco de dados
connection
    .authenticate()
    .then(() =>{
        console.log("conexao feita");
    })
    .catch((error) => {
        console.log(error);
    });

//rotas dos controllers
app.use("/",categoriesController);
app.use("/",articlesController);
app.use("/",usersController);


//rotas principais
app.get("/", (req, res) =>{
    Article.findAll({
        order:[
            ['idArticle', 'DESC']
        ],
        limit: 5
    }).then( articles =>{
        Category.findAll().then(categories =>{
            res.render("index", {articles: articles, categories: categories});
        })  
    }).catch((error) => {
        console.log(error);
    })  
});

app.get("/:slug", (req,res) =>{
    let slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories =>{
                res.render("article",{article: article, categories: categories});
            }).catch((error) => {
                console.log(error);
            })  
        }else{
            res.redirect("/");
        }
    }).catch((error) => {
        console.log(error);
    })
});

app.get("/category/:slug", (req,res) =>{
    let slug = req.params.slug;
    Category.findOne({
        where:{
            slug: slug
        },
        include:[{model: Article}]
    }).then(category =>{
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render("index",{articles: category.articles, categories:categories});
            })  
        }else{
            res.redirect("/");
        }
    }).catch((error) => {
        console.log(error);
        res.redirect("/");
    })
});

app.listen(process.env.PORT || 8080);