const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("OrderProduct", {
    idOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idProduct: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    ammount: {
      type: DataTypes.REAL,
      allowNull: false,
    },
  });
};
