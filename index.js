require("dotenv").config()

const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
//Database
const database = require("./database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//Initialize express
const booky = express();
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

//Establish Database Connection
mongoose.connect(
  process.env.MONGO_URL
).then(()=> console.log("Connection Established!!!"));

//GET ALL BOOKS
/*
Route           /
Description     Get all books
Access          Public
Parameter       NONE
Methods         GET
*/
booky.get("/", async (req,res) => {
  const getAllBooks = await BookModel.find();
  return res.json({books: getAllBooks});
});

//GET A SPECIFIC BOOK localhost:3000/12345Book
/*
Route           /is
Description     Get specific book
Access          Public
Parameter       isbn
Methods         GET
*/
booky.get("/book/:isbn",async (req,res) => {
  const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});
 
   if(!getSpecificBook) {
     return res.json({
       error: `No book found for ISBN of ${req.params.isbn}`
     });
   }
 
   return res.json({book: getSpecificBook});
 
 });

//GET BOOKS on a specific category
/*
Route           /c
Description     Get specific book
Access          Public
Parameter       category
Methods         GET
*/

booky.get("/category/:category", async (req,res)=> {

  const getSpecificBook = await BookModel.find({category: req.params.category});
  //If no specific book is returned then , the findOne funtion returns null, 
  //and to execute the not found property we have to make the condition inside if true, !null is true.
  if(!getSpecificBook) {
    return res.json({
      error: `No book found for category of ${req.params.category}`
    });
  }
  
  return res.json({book: getSpecificBook});
  
  });
//GET ALL AUTHORS
/*
Route           /author
Description     Get all authors
Access          Public
Parameter       NONE
Methods         GET
*/
booky.get("/author",async (req, res)=> {
  const getAllAuthors = await AuthorModel.find();
  return res.json({authors: getAllAuthors});
});


//GET ALL AUTHORS BASED ON A BOOK
/*
Route           /author/book
Description     Get all authors based on book
Access          Public
Parameter       isbn
Methods         GET
*/

booky.get("/author/book/:isbn",async (req,res)=> {
  const getSpecificAuthor = await AuthorModel.find({books: req.params.isbn});

if(!getSpecificAuthor) {
  return res.json({
    error: `No author found for isbn of ${req.params.isbn}`
  });
}

return res.json({authors: getSpecificAuthor});
});

//GET ALL PUBLICATIONS
/*
Route           /publications
Description     Get all publications
Access          Public
Parameter       NONE
Methods         GET
*/

booky.get("/publications", async (req,res) => { 
  const getAllPublications = await PublicationModel.find();
  return res.json({publications: getAllPublications});
});

//ADD NEW BOOKS
/*
Route           /book/new
Description     add new books
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/book/new", async (req,res)=> {
  const { newBook } = req.body;
  const addNewBook = await BookModel.create(newBook)
  return res.json({newBooks: addNewBook, message: "Book was added!"});
});

//ADD NEW AUTHORS
/*
Route           /author/new
Description     add new authors
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/author/new", async (req,res)=> {
  const { newAuthor } = req.body;
 const addNewAuthor = await AuthorModel.create(newAuthor);
  return res.json({newAuthors: addNewAuthor, message: "Author was added"});
});

//ADD NEW PUBLICATION
/*
Route           /publication/new
Description     add new publications
Access          Public
Parameter       NONE
Methods         POST
*/

booky.post("/publication/new", async (req,res)=> {
  const {newPublication} = req.body;
  const addNewPublicaton = await PublicationModel.create(newPublication);
  return res.json({newPublications: addNewPublicaton});
});

//Update a book title
/*
Route           /book/update/:isbn
Description     update title of the book
Access          Public
Parameter       isbn
Methods         PUT
*/
booky.put("/book/update/:isbn", async (req,res)=> {
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
      title: req.body.bookTitle
    },
    {
      new: true
    }
  );

  return res.json({books: updatedBook});
});




//UPADTE PUB AND BOOK
/*
Route           /publication/update/book
Description     update the pub and the book
Access          Public
Parameter       isbn
Methods         PUT
*/

booky.put("/publication/update/book/:isbn", async (req,res)=> {
  //UPDATE THE PUB DB
  // database.publication.forEach((pub) => {
  //   if(pub.id === req.body.pubId) {
  //     return pub.books.push(req.params.isbn);
  //   }
  // });

  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      books: req.params.isbn
      // books: parseInt(req.params.isbn)
    },
    {
      books: req.body.bookName
      // id: req.body.pubId
    },
    {
      new: true
    }
  );

  // return res.json({pub: updatedPublication});

  //UPDATE THE BOOK DB
  // database.books.forEach((book) => {
  //   if(book.ISBN == req.params.isbn) {
  //     book.publications = req.body.pubId;
  //     return;
  //   }
  // });

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
      // ISBN: parseInt(req.params.isbn)
    },
    {
      ISBN: req.body.bookName
      // publications: req.body.pubId
    },
    {
      new: true
    }
  );

  // return res.json({books: updatedBook});


  return res.json(
    {
      pub: updatedPublication,
      books: updatedBook,
      message: "Successfully updated!"
    }
  )

});

//DELETE A BOOK
/*
Route           /book/delete
Description     delete a book
Access          Public
Parameter       isbn
Methods         DELETE
*/

booky.delete("/book/delete/:isbn", async (req,res)=> {
  const updateBookDatabase = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn
  });

  return res.json({deletedBook: updateBookDatabase});
});


//DELETE AN AUTHOR FROM A BOOK AND VICE VERSA
/*
Route           /book/delete/author
Description     delete an author from a book and vice versa
Access          Public
Parameter       isbn, authorId
Methods         DELETE
*/

// booky.delete("/book/delete/author/:isbn/:authorId", (req,res)=> {
//   //Update the book db
//   database.books.forEach((book) => {
//     if(book.ISBN === req.params.isbn) {
//       const newAuthorList = book.author.filter(
//         (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
//       );
//       book.author = newAuthorList;
//       return;
//     }
//   });
booky.delete("/book/delete/author/:isbn/:authorId", async (req,res)=> {
  //Update the book db
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn
    },
    {
     $pull: {
       author: parseInt(req.params.authorId)
     }
   },
   {
     new: true
   }
 );

  //Update author db
  // database.author.forEach((eachAuthor) => {
  //   if(eachAuthor.id === parseInt(req.params.authorId)) {
  //     const newBookList = eachAuthor.books.filter(
  //       (book) => book !== req.params.isbn
  //     );
  //     eachAuthor.books = newBookList;
  //     return;
  //   }
  // });
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      authors: req.params.authorId
    },
    {
     $pull: {
       books: req.params.isbn
     }
   },
   {
     new: true
   }
 );

  return res.json({
    book: updatedBook,
    author: updatedAuthor,
    message: "Author and book were deleted!!!"
  });

});

booky.listen(3000,() => console.log("Server is up and running!!!"));
