const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("Orders", {
    idUser: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    priceTotal: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("confirmado", "pendiente"),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentmethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    shipping: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
};
