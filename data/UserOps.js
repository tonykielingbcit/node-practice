"use strict";

const User = require("../models/User");

class UserOps {
  // Constructor
  UserOps() {}

  // get user on DB by email
  async getUserByEmail(email) {
    let user = await User.findOne({ email: email });
    if (user) {
      const response = { obj: user, errorMessage: "" };
      return response;
    } else {
      return null;
    }
  }

  // get user on DB by username
  async getUserByUsername(username) {
    let user = await User.findOne({ username: username });
    if (user) {
      const response = { obj: user, errorMessage: "" };
      return response;
    } else {
      return null;
    }
  }
}

// module.exports = UserOps;
module.exports = new UserOps();
