const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');
const { getUserByEmail, addUser } = require('./credHelpers.js');

module.exports = (db) => {
  // register
  router.post("/", (req, res) => {
    console.log("listening for post...")
    const { email, password, username } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    // console.log(req.body, email, password, hashedPassword)
    getUserByEmail(db, email)
    .then(emailRes => {
      // console.log(emailRes.rows[0].email)
      if (!emailRes.rows.length === 0) {
        console.log("user exists");
        // show error
        res.redirect("credentials");
      } else {
        addUser(db, email, hashedPassword, username)
        .then(newUser => {
          // console.log(input)
          getUserByEmail(db, email)
          .then(dbres => {
            // console.log("USER: ", dbres)
            const user = dbres.rows[0]; // in this instance having [0] is okay bc we deteremined that there would only be 1 entry
            console.log("Registered User: ", user.username, user.password, user.email, user.id)
            // console.log("ID: ", user.id)
            // console.log("USER: ", user)
            // if match
            // set cookies
            req.session["user_id"] = user.id;
            // redirect to list user homepage
            res.redirect("/")
          })
        })
      }
    })
  });
  return router;
};