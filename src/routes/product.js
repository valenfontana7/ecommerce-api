const server = require("express").Router();
const { Products } = require("../db.js");
const { Categories } = require("../db.js");
const { Op } = require("sequelize");
const { Reviews } = require("../db.js");
const { isAdmin, isAuthenticated } = require("../auth");

//--------------------------------------------------------------------------//
// GET Muestra todos los Productsos

server.get("/", (req, res, next) => {
  Products.findAll({ include: [{ model: Categories }] })
    .then((products) => {
      console.log(products);
      res.send(products);
    })
    .catch(next);
});

//-----------a--------------------------------------------------------------//

// POST /Products
// Controla que estén todos los campos requeridos,
// si no retorna un status 400.
// Si pudo crear el Productso retorna el status 201 y
// retorna la información del Productso.

server.post("/", isAdmin, async (req, res) => {
  const { category, name, description, stock, price, img } = req.body;

  await Products.create({
    name: name,
    description: description,
    stock: stock,
    price: price,
    img: img,
  })
    .then((product) => {
      Categories.findOne({ where: { id: category } }).then(async (category) => {
        await product.setCategory(category);
        return res.status(200).send(product.dataValues);
      });
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

//--------------------------------------------------------------------------//

// PUT /Products/:id
// Modifica el Productso con id: id.
// Retorna 400 si los campos enviados no son correctos.
// Retorna 200 si se modificó con exito,
// y retorna los datos del Productso modificado.

server.put("/:id", isAuthenticated, (req, res, next) => {
  const id = req.params.id;

  Products.update(
    {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      stock: req.body.stock,
      price: req.body.price,
      img: req.body.img,
      rating: req.body.rating,
    },
    {
      where: {
        id: id,
      },
      returning: true,
    }
  )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) =>
      res
        .status(400)
        .send(err, " WARNING! -> You can´t modificate the Products")
    );
});

//---------------------------------------------------------------------------//

// DELETE /Products/:id
// Retorna 200 si se elimino con exito.

server.delete("/:id", isAdmin, (req, res, next) => {
  const id = req.params.id;
  Products.destroy({
    where: { id: id },
  }).then((removed) => {
    if (removed) {
      res.status(200).end();
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });
});

//-----------------------------------------------------------------------------------------//

// PUT /Products/category/:id
// Crea ruta para modificar categoria

server.put("/category/:id", isAdmin, (req, res) => {
  const id = req.params.id;

  Categories.update(
    {
      //update({includes: [{model: Categories }]})
      name: req.body.name,
    },
    {
      where: {
        idProducts: id,
      },
      returning: true,
    }
  )
    .then((response) => {
      res.json(response);
    })
    .catch((error) => res.send(error));
});

//-------------------------------------------------------------------------------------//

// DELETE /Products/category/:id
// Elimina una categoria

server.delete("/category/:id", isAdmin, (req, res) => {
  const id = req.params.id;
  //console.log(req.body);
  Categories.destroy({
    //update({includes: [{model: Categories }]})
    where: {
      id: id,
    }
      .then((deleteCategory) => {
        res.json(deleteCategory);
      })
      .catch((err) => res.send(err)),
  });
});

//--------------------------------------------------------------------------//

// POST /Products/:idProductso/category/:idCategoria
// Agrega la categoria al Productso.

server.post("/:idProductso/category/:idCategoria", isAdmin, (req, res) => {
  const idProducts = req.params.idProducts;
  const idCategoria = req.params.idCategoria;

  Categories.update(
    //findOrCreate()
    {
      //{include: [{model:Products}]} Creo que en este caso no iria, pero si agregaria el
      name: req.params.name, //                                       {include: [{model: Categories}]}
    },
    {
      where: {
        id: idCategoria,
      },
    }
  )
    .then((category) => {
      Products.addCategory(category);
    })
    .catch((err) => res.send(err));

  // En Productso no tengo atributo categoria
  // Productsxcategories tiene el id de categoria, lo agregaria ahí?
});

// DELETE /Products/:idProductso/category/:idCategoria
// Elimina la categoria al Productso.
server.delete("/:idProductso/category/:idCategoria", isAdmin, (req, res) => {
  const idProd = req.params.idProductso;
  const idCate = req.params.idCategoria;

  Products.findById(idProd).then((Products) => {
    Categories.destroy(idCate) //{includes: [{models: category}]} ?????????????????
      .then((category) => {
        res.send("Deleted Categorie succesfull");
      });
  });
});

//-------------------------------------------------------------------------------------------------//

// GET /Products/categoria/:nombreCat                         //Esto deberia ir en categoria.js ? e incluir {Products}
// Retorna todos los Productsos de {nombreCat} Categoría.

server.get("/categoria/:nombreCat", (req, res, next) => {
  const nameCat = req.params.nombreCat;

  Products.findAll({
    where: { category: nameCat },
  })
    .then(function (Products) {
      res.send(Products);
    })
    .catch(next);
});

//-----------------------------------------------------------------------------------------------------------//

// GET /search?query={valor}
// Retorna todos los Productsos que tengan {valor} en su nombre o descripcion.

server.get("/search", (req, res) => {
  const valor = req.query.query;

  Products.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.substring]: valor } },
        { description: { [Op.substring]: valor } },
      ],
    },
  })
    .then((Products) => {
      res.send(Products);
    })
    .catch((err) => res.send(err));
});

//----------------------------------------------------------------------------------------------------//

// GET /Products/:id
// Retorna un objeto de tipo Productso con todos sus datos. (Incluidas las categorías e imagenes).

server.get("/:id", (req, res) => {
  const id = req.params.id;
  Products.findOne({
    where: { id: id },
  })
    .then((newProducts) => {
      res.send(newProducts);
    })
    .catch((err) => res.status(404).send(err));
});

//------------------------------------------------------------------------------------------------------------//
// GET /Products/:id/review/
// Podés tener esta ruta, o directamente obtener todas las reviews en la ruta de GET Products.
server.get("/:id/review", (req, res) => {
  const id = req.params.id;
  Reviews.findAll({
    where: { ProductsId: id },
  }).then((review) => {
    res.send(review);
  });
});

//------------------------------------------------------------------------------------------------------------//

// POST /Products/:id/review

server.post("/:id/review", isAuthenticated, (req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const star = req.body.star;
  const id = req.params.id;
  const idUser = req.body.idUser;
  // const userId = req.body.userId;
  Reviews.create({
    title,
    description: description,
    star: star,
    idUser: idUser,
  })
    .then((newReviews) => {
      newReviews.setProducts(id);
      res.send(newReviews);
    })
    .catch((err) => res.status(500).send(err));
});

//------------------------------------------------------------------------------------------------------------//
// PUT /Products/:id/review/:idReviews
server.put("/:id/review/:idReviews", isAuthenticated, (req, res) => {
  const idProducts = req.params.id;
  const idReviews = req.params.idReviews;

  Reviews.update(
    {
      title: req.body.title,
      description: req.body.description,
      star: req.body.star,
    },
    {
      where: {
        id: idReviews,
      },
      returning: true,
    }
  )
    .then((response) => {
      res.send(response[1]);
    })
    .catch((err) => res.send(err.message));
});

//------------------------------------------------------------------------------------------------------------//
// DELETE /Products/:id/review/:idReviews

server.delete("/:id/review/:idReviews", isAuthenticated, (req, res) => {
  const id = req.params.id;
  const idReviews = req.params.idReviews;
  Reviews.destroy({
    where: { id: idReviews },
  }).then((removed) => {
    if (removed) {
      res.status(200).end();
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });
});

//------------------------------------------------------------------------------------------------------------//
module.exports = server;
