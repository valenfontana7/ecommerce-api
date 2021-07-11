const server = require("express").Router();
const { Products } = require("../db.js");
const { Categories } = require("../db.js");
const { isAdmin } = require("../auth");

server.get("/", (req, res, next) => {
  Categories.findAll()
    .then((category) => {
      res.send(category);
    })
    .catch(next);
});

server.post("/", isAdmin, (req, res) => {
  Categories.create({
    name: req.body.name,
  })
    .then((category) => {
      res.send({ category });
    })
    .catch((err) => res.send(err));
});

server.put("/:id", isAdmin, (req, res, next) => {
  const id = req.params.id;

  Categories.update(
    {
      name: req.body.name,
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
      res.status(400).send(err, " WARNING! -> You can´t modificate the product")
    );
});

server.delete("/:id", isAdmin, (req, res, next) => {
  const id = req.params.id;
  Categories.destroy({
    where: { id: id },
  }).then((removed) => {
    if (removed) {
      res.status(200).end();
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });
});

server.get("/:id", (req, res) => {
  const id = req.params.id;
  Categories.findOne({
    where: { id: id },
  })
    .then((category) => {
      res.send(category);
    })
    .catch((err) => res.status(404).send(err));
});

module.exports = server;
