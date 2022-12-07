"use strict";

const RequestService = require("../services/RequestService");

exports.Index = async (req, res) => {
    let reqInfo = RequestService.reqHelper(req);
    
    res.render("notFound", { message: "Index Page not found.", reqInfo });
}