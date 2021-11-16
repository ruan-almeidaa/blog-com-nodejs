const express = require("express");
const app = express();
const Category = require("./categories/Category");
const Article = require("./articles/Article");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");

app.set('view engine','ejs');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use(express.static('public'));

connection
    .authenticate()
    .then(() =>{
        console.log("conexao feita");
    })
    .catch((error) => {
        console.log(error);
    })

app.use("/",categoriesController);
app.use("/",articlesController);


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