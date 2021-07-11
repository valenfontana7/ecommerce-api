const server = require("express").Router();
const { Users } = require("../db.js");
const { Op } = require("sequelize");
const { Order } = require("../db.js");
const OrderProduct = require("../models/OrderProduct.js");
const passport = require("passport");
const { isAdmin } = require("../auth");

// GET /users
server.get("/", isAdmin, (req, res, next) => {
  User.findAll()
    .then((users) => {
      res.send(users);
    })
    .catch(next);
});

server.post("/login", (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (!user) {
      res.json({
        success: false,
        message: "Usuario y/o contraseña incorrectos",
      });
    }
    await req.logIn(user, (err) => {
      res.json({
        success: true,
        message: "Te has logueado correctamente!",
        user,
      });
    });
  })(req, res, next);
});

server.get("/logout", (req, res, next) => {
  req.logout();
  res.json({ logout: true, message: "Has cerrado sesión correctamente!" });
});

server.get("/session", (req, res, next) => {
  res.json({ user: req.user });
});

// POST /users
server.post("/", (req, res, next) => {
  const { name, lastname, email, password, phone, address } = req.body;

  User.create({
    name: name,
    lastname: lastname,
    email: email,
    password: password,
    phone: phone,
    address: address,
  })
    .then((newUser) => {
      res.send(newUser);
    })
    .catch((err) => res.status(400).send(err));
});

// PUT /users/:id
server.put("/:id", (req, res, next) => {
  const id = req.params.id;

  User.update(
    {
      name: req.body.name,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      address: req.body.address,
      rol: req.body.rol,
      image: req.body.image,
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
      res.status(400).send(err, " WARNING! -> You can´t modificate the User")
    );
});

// DELETE /users/:id

server.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  User.destroy({
    where: { id: id },
  }).then((removed) => {
    if (removed) {
      res.status(200).end();
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });
});

// GET /users/:idUser/cart

server.get("/:id/cart", (req, res, next) => {
  const id = req.params.id;
  Order.findOne({
    where: { idUser: id },
  })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) =>
      res.status(400).send(err, " WARNING! -> UserCart does not exist")
    );
});

// POST /users/:idUser/cart

server.post("/:id/cart", (req, res, next) => {
  const id = req.params.id;
  Order.create({
    idUser: id,
    date: req.body.date,
    priceTotal: req.body.priceTotal,
    status: req.body.status,
    address: req.body.address,
    description: req.body.description,
    paymentmethod: req.body.paymentmethod,
    shipping: req.body.shipping,
  })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) =>
      res
        .status(400)
        .send(err, " WARNING! -> You can´t modificate the UserCart")
    );
});

// PUT /users/:idUser/cart

server.put("/:id/cart", (req, res, next) => {
  const id = req.params.id;

  Order.update(
    {
      date: req.body.date,
      priceTotal: req.body.priceTotal,
      status: req.body.status,
      address: req.body.address,
      description: req.body.description,
      paymentmethod: req.body.paymentmethod,
      shipping: req.body.shipping,
    },
    {
      where: {
        idUser: id,
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
        .send(err, " WARNING! -> You can´t modificate the ShoppingCart")
    );
});

// DELETE /users/:idUser/cart/

server.delete("/:id/cart", (req, res, next) => {
  const id = req.params.id;
  Order.destroy({
    where: { idUser: id },
  }).then((removed) => {
    if (removed) {
      res.status(200).end();
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });
});

// GET /users/:id/orders

server.get("/:id/orders", (req, res) => {
  const id = req.params.id;
  Order.findAll({
    where: { idUser: id },
  })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) =>
      res.status(400).send(err, " WARNING! -> Order does not exist")
    );
});

server.put("/:id/orders/:idOrder", (req, res) => {
  const idOrder = req.params.idOrder;

  Order.update(
    {
      date: req.body.date,
      priceTotal: req.body.priceTotal,
      status: req.body.status,
      address: req.body.address,
      description: req.body.description,
      paymentmethod: req.body.paymentmethod,
      shipping: req.body.shipping,
    },
    {
      where: {
        id: idOrder,
      },
      returning: true,
    }
  )
    .then((response) => {
      res.send(response);
    })
    .catch((err) => res.send(err.message));
});

server.delete("/:id/orders/:idOrder", (req, res, next) => {
  const idOrder = req.params.idOrder;
  Order.destroy({
    where: { id: idOrder },
  }).then((removed) => {
    if (removed) {
      res.status(200).end();
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });
});

server.get("/orders", (req, res) => {
  Order.findAll()
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) =>
      res.status(400).send(err, " WARNING! -> Order does not exist")
    );
});

server.get("/orders/search", (req, res) => {
  const valor = req.query.query;
  Order.findAll({
    where: {
      [Op.or]: [{ status: valor }],
    },
  })
    .then((orders) => {
      res.send(orders);
    })
    .catch((err) => res.send(err));
});

server.get("/:id", (req, res) => {
  const id = req.params.id;
  User.findOne({
    where: { id: id },
  })
    .then((User) => {
      res.send(User);
    })
    .catch((err) => res.status(404).send(err));
});

server.post("/:id/orders", (req, res, next) => {
  const id = req.params.id;
  Order.create({
    idUser: id,
    date: Date.now(),
    priceTotal: req.body.priceTotal,
    status: req.body.status,
    address: req.body.address,
    description: req.body.description,
    paymentmethod: req.body.paymentmethod,
    shipping: req.body.shipping,
  })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) =>
      res
        .status(400)
        .send(err, " WARNING! -> You can´t modificate the UserCart")
    );
});

// Auth

server.post("/signup", async (req, res) => {
  const user = await Users.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (user) {
    return res.json({ message: "Ya existe ese mail", success: false });
  }
  if (!user) {
    await Users.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      address: req.body.address,
      phone: req.body.phone,
    })
      .then((response) => {
        console.log("Usuario " + response.dataValues.email + " creado");
        return res.json({
          message: "Usuario creado correctamente",
          success: true,
        });
      })
      .catch((err) => res.send(err));
  }
});
module.exports = server;
