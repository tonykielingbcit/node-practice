"use strict";

const User = require("../models/User");
const passport = require("passport");
const RequestService = require("../services/RequestService");


exports.Profile = async (req, res) => {
    const reqInfo = RequestService.reqHelper(req);
    
    if (reqInfo.authenticated) {
        const UserOps = require("../data/UserOps.js");
        const getUser = await UserOps.getUserByUsername(reqInfo.username);
        // console.log("-----------------------------getUser: ", getUser);

        res.render("user/details", {
            user: getUser.obj,
            reqInfo: reqInfo
        });
    } else
        res.redirect("/user/login?errorMessage=You must be logged in to view this page.");
};



// Displays registration form.
exports.Register = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    
    res.render("user/register", { errorMessage: "", user: {}, reqInfo: reqInfo });
};



// Handles 'POST' with registration form submission.
exports.RegisterUser = async function (req, res) {
    console.log("INSIDE USER CONTROLLERRRRRRRRRRRR");
    console.log("dont we need to check whether the user already exist??????????????");
    console.log("USERNAME: ", req.body.username, req.body.firstName, 
        req.body.lastName, req.body.email, req.body.password, req.body.passwordConfirm, "!!!!!!!!!!!!")
        
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    if (password == passwordConfirm) {
        // Creates user object with mongoose model.
        // Note that the password is not present.
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            username: req.body.username,
        });
        // Uses passport to register the user.
        // Pass in user object without password
        // and password as next parameter.
        User.register(
            new User(newUser),
            req.body.password,
            function (err, account) {
                // Show registration form with errors if fail.
                if (err) {
                    let reqInfo = RequestService.reqHelper(req);
                
                    return res.render("user/register", {
                        user: newUser,
                        errorMessage: err,
                        reqInfo: reqInfo,
                    });
                }

                // User registered so authenticate and redirect to secure area
                passport.authenticate("local")(req, res, () => res.redirect("/secure/secure-area"));
            }
        );
    } else {
        // it runs if password !== passwordConfirm
        let reqInfo = RequestService.reqHelper(req);
        res.render("user/register", {
            user: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                username: req.body.username,
            },
            errorMessage: "Passwords do not match.",
            reqInfo: reqInfo,
        });
    }
};



// Shows login form.
exports.Login = async function (req, res) {
    let reqInfo = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage;

    res.render("user/login", {
        user: {},
        errorMessage: errorMessage,
        reqInfo: reqInfo,
    });
};



// Receives login information & redirects
// depending on pass or fail.
exports.LoginUser = (req, res, next) => {
    console.log("req-CONTROLLER-USER======== ", req.body);
    passport.authenticate(
        "local", 
        {
            successRedirect: "/secure/secure-area",
            // successRedirect: `/user/login?errorMessage=Valid login AND req.body => ${JSON.stringify(req.body)}`,
            failureRedirect: "/user/login?errorMessage=Invalid login.",
        }
    )(req, res, next);
};

  

// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
    // Use Passports logout function
    req.logout((err) => {
        if (err) {
            console.log("logout error");
            return next(err);
        } else {
            // logged out.  Update the reqInfo and redirect to the login page
            let reqInfo = RequestService.reqHelper(req);
            res.render("user/login", {
                user: {},
                isLoggedIn: false,
                errorMessage: "",
                reqInfo: reqInfo,
            });
        }
    });
};

exports.NoFound = (req, res) => {
    let reqInfo = RequestService.reqHelper(req);

    res.render("notFound", { message: "User Page not found.", reqInfo })
}
