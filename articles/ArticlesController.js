const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("../articles/Article");
const slugify = require("slugify");



//rotas POST

router.post("/articles/save", (req,res) =>{
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryIdCategory: category
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(erro =>{
        res.redirect("/admin/articles");
    });
});

router.post("/articles/delete", (req,res) =>{
    let id = req.body.id;
    if(id != undefined && id != isNaN){

        Article.destroy({
            where:{
                idArticle: id
            }
        }).then(() =>{
            res.redirect("/admin/articles");
        }).catch((error) => {
            console.log(error);
        });
    }else{
        res.redirect("/admin/articles");
    }
});


//rotas GET
router.get("/admin/articles", (req,res) => {
    Article.findAll({
        include:[{model: Category}]
    }).then(articles =>{
        res.render("admin/articles/index", {articles:articles});
    })
    
});

//acessar página de cadastro de artigos
router.get("/admin/articles/new", (req,res) => {
    Category.findAll().then(categories => {
        res.render("admin/articles/new", {categories:categories});
    }).catch(erro =>{
        res.redirect("/articles");
    });
    
});

module.exports = router;

