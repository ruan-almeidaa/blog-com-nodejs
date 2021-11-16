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

router.post("/article/update", (req,res) =>{
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;

    Article.update({title: title, body: body, categoryIdCategory: category, slug: slugify(title)},{
        where:{
            idArticle: id
        }
    }).then(() =>{
        res.redirect("/admin/articles");
    }).catch(err => {
        console.log(err);
        res.redirect("/");
    });
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

router.get("/admin/articles/edit/:id", (req,res) =>{
    
    let id = req.params.id;

    Article.findByPk(id).then(article =>{

        if(article != undefined){
            //preciso passar as categorias para a view para exibir o dropdown
            Category.findAll().then(categories =>{
                res.render("admin/articles/edit", {categories:categories, article:article});
            });
            
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        console.log(err);
        res.redirect("/");

    })
});

router.get("/articles/page/:num", (req, res) =>{
    let page = req.params.num;
    let offset = 0;

    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = parseInt(page)*5;
    }

    Article.findAndCountAll({
        limit:5,
        offset: offset,
        order:[
            ['idArticle', 'DESC']
        ]
    }).then(articles =>{

        let next;

        if(offset + 5 >= articles.count){
            next = false;
        }else{
            next = true;
        }


        let result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
          res.render("admin/articles/page", {result: result, categories:categories}); 
        })
        
    })
});

module.exports = router;

