/* eslint-disable no-unused-vars */
const express = require("express");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
var csrf = require("tiny-csrf");
var cookieParser = require("cookie-parser");
const flash = require("connect-flash");

// CSRF Secret String
const csrfSecret = "This_should_be_32_character_long";
const saltRound = 10;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const { nextTick, title } = require("process");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(csrfSecret));
app.use(csrf(csrfSecret, ["POST", "PUT", "DELETE"]));
app.use(express.json());
// app.use(csrf({Cookie: true}));

app.use(
  session({
    secret: csrfSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, //24hrs
      secure: false,
      httpOnly: true,
    },
  }),
);

app.use(flash());

app.use(function (request, response, next) {
  console.log("Flash messages:", request.flash());
  response.locals.messages = request.flash();
  next();
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      User.findOne({
        where: {
          email: username,
        },
      })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done({ message: "Invalid Password" });
          }
        })
        .catch((error) => {
          return error;
        });
    },
  ),
);

passport.serializeUser((user, done) => {
  console.log("Serialing the user in seesion", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.get("/", async (request, response) => {
  console.log("Authenticated:", request.isAuthenticated());
  if (request.isAuthenticated()) {
    response.redirect("/todos");
  } else {
    response.render("index", {
      title: "Todo Application",
      csrfToken: request.csrfToken(),
    });
  }
});

app.get("/login", async (request, response) => {
  response.render("login", {
    title: "Login",
    csrfToken: request.csrfToken(),
  });
});

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("User ID:", request.user.id);
    try {
      const loggedInUser = request.user.id;
      const overdue = await Todo.overdue(loggedInUser);
      const dueToday = await Todo.dueToday(loggedInUser);
      const dueLater = await Todo.dueLater(loggedInUser);
      const completed = await Todo.completed(loggedInUser);

      if (request.accepts("html")) {
        response.render("todos", {
          title: "Todo Application",
          csrfToken: request.csrfToken(),
          overdue,
          dueLater,
          dueToday,
          completed,
          messages: request.flash(),
        });
        console.log("Rendering todos view");
      } else {
        response.json({
          overdue,
          dueLater,
          dueToday,
          completed,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      response.status(500).send("Internal Server Error");
    }
  },
);

app.get("/signup", (request, response) => {
  response.render("signup", {
    title: "Sign Up",
    csrfToken: request.csrfToken(),
  });
});

app.post("/users", async (request, response) => {
  const hashedPwd = await bcrypt.hash(request.body.password, saltRound);
  try {
    const user = await User.create({
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      email: request.body.email,
      password: hashedPwd,
    });
    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      response.redirect("/todos");
    });
  } catch (error) {
    console.error(error);
  }
});

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (request, response) => {
    response.redirect("/todos");
  },
);

app.get("/signout", (request, response, next) => {
  request.logout((err) => {
    if (err) {
      return next(err);
    }
    response.redirect("/");
  });
});

app.get("/test-flash", (req, res) => {
  req.flash("success", "Flash message test!");
  res.redirect("/todos");
});

app.get(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    try {
      const todo = await Todo.findByPk(request.params.id);
      if (!todo) {
        return response.status(404).json({ message: "Todo not found" });
      }
      return response.json(todo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  },
);

app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    try {
      const todo = await Todo.addTodo({
        title: request.body.title,
        dueDate: request.body.dueDate,
        userId: request.user.id,
      });
      // return response.json(todo);
      return response.redirect("/todos");
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  },
);

app.put(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    const todo = await Todo.findByPk(request.params.id);
    try {
      const updatedTodo = await todo.setCompletionStatus();
      return response.json(updatedTodo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  },
);

app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    console.log("We have to delete a Todo with ID: ", request.params.id);
    // FILL IN YOUR CODE HERE

    // First, we have to query our database to delete a Todo by ID.
    // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
    // response.send(true)

    /**  My Implementation Logic
  try {
    const todo = await Todo.findByPk(request.params.id);
    if (!todo) {
      return response.send(false);
    }
    await todo.destroy();

    response.send(true);
  } catch (error) {
    console.log(error);
    response.status(422).json(error);
  }
    */
    // Tutorial
    try {
      const userId = request.user.id;
      await Todo.remove(request.params.id, userId);
      return response.json({ success: true });
    } catch (error) {
      return response.status(422).json(error);
    }
  },
);

module.exports = app;
