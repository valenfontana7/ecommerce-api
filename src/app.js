const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const UserSchema = require("./models/Users");
const { Users } = require("./db");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const session = require("express-session");
var cors = require("cors");

require("./db.js");

const server = express();

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  if ("OPTIONS" == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

server.name = "API";
server.use("/imagenes", express.static("imagenes"));
server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));
server.use(cookieParser("secretcode"));
server.use(morgan("dev"));
// server.use(cors());
passport.initialize();
passport.session();

server.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
    rolling: true,
    cookie: {
      maxAge: 1 * 60 * 60 * 1000,
    },
  })
);
server.use(passport.initialize());
server.use(passport.session());
// server.use((req, res, next) => {
//   res.locals.user = req.user || null;
//   next();
// });

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const user = await Users.findOne({
        where: {
          email: email,
        },
      });
      if (!user.dataValues) {
        done(null, false, {
          message: "Incorrect credentials.",
        });
      } else if (user.checkPassword(password)) {
        done(null, user.dataValues);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await Users.findOne({
    where: {
      id: id,
    },
  });

  if (!user) {
    done(null, false, { message: "User does not exist" });
  } else {
    done(null, user.dataValues);
  }
});
server.use("/", routes);

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
