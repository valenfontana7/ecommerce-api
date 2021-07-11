const server = require("express").Router();
const { OrderProduct } = require("../db");
const { isAdmin } = require("../auth");

// GET /orders
// Esta ruta puede recibir el query string status y deberá devolver sólo las ordenes con ese status.
server.get("/", (req, res, next) => {
  //   const qstatus = req.query.status;
  //   OrderProduct.findAll({
  //     where: { status: qstatus },
  //   })
  //     .then((response) => {
  //       res.status(200).json(response);
  //     })
  //     .catch((err) =>
  //       res.status(400).send(err, " WARNING! -> Order id does not exist")
  //     );
  // });
  OrderProduct.findAll()
    .then((orderproducts) => {
      res.send(orderproducts);
    })
    .catch(next);
});

// GET /orders/:id

server.get("/:id", (req, res) => {
  const id = req.params.id;
  OrderProduct.findAll({
    where: { idOrder: id },
  })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) =>
      res.status(400).send(err, " WARNING! -> Order id does not exist")
    );
});

// PUT /orders/:id

server.put("/:id", isAdmin, (req, res) => {
  const id = req.params.id;

  OrderProduct.update(
    {
      idOrder: req.body.idOrder,
      idProduct: req.body.idProduct,
      price: req.body.price,
      ammount: req.body.ammount,
    },
    {
      where: {
        idOrder: id,
      },
      returning: true,
    }
  )
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) =>
      res.status(400).send(err, " WARNING! -> You can´t modificate the Order")
    );
});

server.post("/", (req, res) => {
  OrderProduct.create({
    idOrder: req.body.idOrder,
    idProduct: req.body.idProduct,
    price: req.body.price,
    ammount: req.body.ammount,
  })
    .then((response) => {
      res.json(response);
    })
    .catch((err) =>
      res.status(400).send(err, " WARNING! -> You can´t modificate the Order")
    );
});

module.exports = server;
