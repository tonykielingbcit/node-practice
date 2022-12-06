"use strict";

const RequestService = require("../services/RequestService");

exports.Index = async (req, res) => { 
  let reqInfo = RequestService.reqHelper(req);
// console.log("----reqInfo:: ", reqInfo);
  if (reqInfo.authenticated) {
    return res.render("secure/secure-area", { reqInfo: reqInfo });
  } else {
    res.redirect("/user/login?errorMessage=You must be logged in to view this page.");
  }
};
