const express = require("express");
const app = express();
const Article = require("./articles/Article");
const Category = require("./categories/Category");
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
    res.render("index");
});

app.listen(8080, () => {
    console.log("servidor ta online");
});