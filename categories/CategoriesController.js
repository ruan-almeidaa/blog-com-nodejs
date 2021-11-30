const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require ("slugify");
const adminAuth = require("../middlewares/adminAuth");


//rotas POST

//salvar categoria no banco de dados
router.post("/categories/save", adminAuth,(req,res) => {
    var title = req.body.title;
    if(title != undefined){
        Category.create({
            title : title,
            slug: slugify(title)
        }).then(() =>{
            res.redirect("/admin/categories");
        })
    }else{
        res.redirect("/admin/categories/new");
    }
});

 //deletar categoria do banco de dados
router.post("/categories/delete", adminAuth,(req,res) =>{
    let id = req.body.id;
    if(id != undefined && id != isNaN){

        Category.destroy({
            where:{
                idCategory: id
            }
        }).then(() =>{
            res.redirect("/admin/categories");
        }).catch((error) => {
            console.log(error);
        });
    }else{
        res.redirect("/admin/categories");
    }
});

 //atualizar uma categoria e seu slug no banco de dados
router.post("/categories/update", adminAuth,(req, res) =>{
    let id = req.body.id;
    let title = req.body.title;

    Category.update({title:title, slug: slugify(title)}, {
        where:{
            idCategory: id
        }
    }).then(()=>{
        res.redirect("/admin/categories");
    }).catch((error) => {
        console.log(error);
    });

});


//rotas GET

//acessar página de cadastro de categorias
router.get("/admin/categories/new", adminAuth, (req,res) => {
    res.render("admin/categories/new");
});

router.get("/admin/categories", adminAuth, (req,res) => {
    Category.findAll().then(categories =>{
       res.render("admin/categories/index",{categories : categories});
    });
});

//acessar página de editar uma categoria
router.get("/admin/categories/edit/:id", adminAuth, (req,res) =>{
    let id = req.params.id;

    if(isNaN(id)){
        res.redirect("/admin/categories");
    }

    Category.findByPk(id).then(category =>{
        if(category != undefined){
            res.render("admin/categories/edit",{category : category});
        }else{
            res.redirect("/admin/categories");
        }
    }).catch(erro =>{
        res.redirect("/admin/categories");
    });
});

module.exports = router;

