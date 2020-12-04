const express = require('express');
const router  = express.Router();
const axios = require('axios');

const bookFetcher = (query, items) => {

  for (const item of items) {
    const bookTitle = item.volumeInfo.title
    const bookDesc = item.volumeInfo.description
    const search = query
    let queryValues = []
    // console.log("Title: ", item.volumeInfo.title)
    // console.log(booktext)
    if (bookTitle.toLowerCase() === search.toLowerCase()) {
      console.log("FOUND DESC: ", bookDesc.toLowerCase())
      console.log("FOUND BOOK: ", bookTitle.toLowerCase())
      queryValues.push(bookTitle)
      queryValues.push(bookDesc)
    }
    console.log(queryValues)
    return queryValues
  }
  
}

module.exports = (db) => {

  router.post("/", (req, res) => {
    // console.log("hit me")
    const { booktext } = req.body;
    // console.log(booktext)

    axios.get('https://www.googleapis.com/books/v1/volumes?q=harry+potter+inauthor:rowling&key=AIzaSyBT-iVATn5jscoq7CUm_qUmzb_s9NdR01E')
    .then(function (response) {
      // handle success
      const itemsArray = response.data.items
      // // let book = volumeInfo.title;
      // let desc = [];
      // // console.log(JSON.parse(response.data));
      // for (const item of itemsArray) {
      //   const bookTitle = item.volumeInfo.title
      //   const bookDesc = item.volumeInfo.description
      //   // console.log("Title: ", item.volumeInfo.title)
      //   // console.log(booktext)
      //   if (bookTitle.toLowerCase() === booktext.toLowerCase()) {
      //     console.log("FOUND BOOK: ", bookTitle.toLowerCase())
      //     console.log("FOUND DESC: ", bookDesc.toLowerCase())
      //     let queryValues = []
      //     queryValues.push(bookTitle)
      //     return queryValues
      //   }
      //   console.log("Author: ", item.volumeInfo.authors)
        // console.log("Desc: ", item.volumeInfo.description)
        // local compare or toLower case
        // if (itemsArray[item].book) {
        // console.log(itemsArray[item].book)
        // console.log("Volume", volume)
        // console.log("Volumes", volumes)
        // console.log("FOUND BOOK")
        // }
      // }
      
      db.query(
        `INSERT INTO items (name, description, favourite, list_id)
        VALUES ($1, $2, false, 2);
        `, bookFetcher(booktext, itemsArray))
        .then(dbres => {
          // last step if all goes well
          res.redirect("list")
        })
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
  });
  return router;
};
