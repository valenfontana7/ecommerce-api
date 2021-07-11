const { DataTypes } = require("sequelize");
const crypto = require("crypto");

// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  var user = sequelize.define("Users", {
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        const creatSalt = user.randomSalt();
        this.setDataValue("salt", creatSalt);
        this.setDataValue(
          "password",
          crypto.createHmac("sha1", this.salt).update(value).digest("hex")
        );
      },
    },
    salt: {
      type: DataTypes.STRING,
    },
    rol: {
      type: DataTypes.ENUM,
      values: ["user", "admin"],
      defaultValue: "user",
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  user.randomSalt = function () {
    return crypto.randomBytes(32).toString("hex");
  };

  user.prototype.checkPassword = function (password) {
    return (
      crypto.createHmac("sha1", this.salt).update(password).digest("hex") ===
      this.password
    );
  };
};
