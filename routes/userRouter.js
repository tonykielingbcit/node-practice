"use strict";

const express = require("express");
const userRouter = express.Router();
const UserController = require("../controllers/UserController");

userRouter.get("/register", UserController.Register);
userRouter.post("/register", UserController.RegisterUser);

userRouter.get("/login", UserController.Login);
// userRouter.post("/login", UserController.LoginUser);
userRouter.post(
    "/login", 
    ((req, res, next) => {
        console.log("req.body-ROUTER======== ", req.body);
        next();
    })
    , UserController.LoginUser
);

userRouter.get("/logout", UserController.Logout);

userRouter.get("/", UserController.Profile);

userRouter.use("/asd", 
    (req, res) => res.render("notFound", {message: "User Page not found."})
);



module.exports = userRouter;
