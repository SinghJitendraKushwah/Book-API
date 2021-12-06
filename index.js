require("dotenv").config()

const express = require("express");
// var bodyParser = require("body-parser");
const mongoose = require("mongoose");

//Initialize
const booky = express();
//express instance created inside the ep
booky.use(express.json());
// booky.use(bodyParser.urlencoded({extended: true}));
// booky.use(bodyParser.json());

//Establish Database Connection
mongoose.connect(
    process.env.MONGO_URL
  ).then(()=> console.log("Connection Established!!!"));
  
  
//Database
// const database = require("./database");

//Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");
//HTTP methods
//GET
//POST
//PUT
//DELETE
//GET all books, authors, publictions
/*
Route           /
Description     Get all books, authors, publictions
Access          Public
Parameter       NONE
Methods         GET
*/
booky.get("/", async (req,res) => {
    const getAllBooks = await BookModel.find();
    const getAllAuthors = await AuthorModel.find();
    const getAllPublications = await PublicationModel.find();
    return res.json({
        books: getAllBooks,
        authors: getAllAuthors,
        publications: getAllPublications
    });
  });

//GET all books
/*
Route           /books
Description     Get all books
Access          Public
Parameter       NONE
Methods         GET
*/
booky.get("/books", async (req,res) => {
    const getAllBooks = await BookModel.find();
    return res.json(getAllBooks);
  });

//GET specific book
/*
Route           /book
Description     Get specific book
Access          Public
Parameter       isbn
Methods         GET
*/
booky.get("/book/:isbn",async (req,res) => {
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});
   
     if(!getSpecificBook) {
       return res.json({
         error: `No Book found for ISBN of ${req.params.isbn}`
       });
     }
   
     return res.json({book: getSpecificBook});
   
   });

//GET all books on specific category
/*
Route           /books/category
Description     Get all books on specific category
Access          Public
Parameter       c
Methods         GET
*/
booky.get("/books/category/:c", async (req,res)=> {

    const getBooksOnCategory = await BookModel.find({category: req.params.c});
    //If no specific book is returned then , the findOne funtion returns null, 
    //and to execute the not found property we have to make the condition inside if true, !null is true.
    if(!getBooksOnCategory) {
      return res.json({
        error: `No Books found for category of ${req.params.c}`
      });
    }
    
    return res.json({booksOnCategory: getBooksOnCategory});
    
    });

//GET all books on specific language
/*
Route           /books/language
Description     Get all books on specific language
Access          Public
Parameter       l
Methods         GET
*/
booky.get("/books/language/:l", async (req,res)=> {

    const getBooksOnLanguage = await BookModel.find({language: req.params.l});
    //If no specific book is returned then , the findOne funtion returns null, 
    //and to execute the not found property we have to make the condition inside if true, !null is true.
    if(!getBooksOnLanguage) {
      return res.json({
        error: `No Books found for language of ${req.params.l}`
      });
    }
    
    return res.json({booksOnLanguage: getBooksOnLanguage});
    
    });

//GET all authors
/*
Route           /authors
Description     Get all authors
Access          Public
Parameter       NONE
Methods         GET
*/
booky.get("/authors",async (req, res)=> {
    const getAllAuthors = await AuthorModel.find();
    return res.json({authors: getAllAuthors});
  });

//GET specific author
/*
Route           /author
Description     Get specific author
Access          Public
Parameter       name
Methods         GET
*/
booky.get("/author/:name",async (req,res) => {
    const getSpecificAuthor = await AuthorModel.findOne({name: req.params.name});
   
     if(!getSpecificAuthor) {
       return res.json({
         error: `No Author found for name of ${req.params.name}`
       });
     }
   
     return res.json({specificAuthor: getSpecificAuthor});
   
   });
 
//GET all authors based on a book name
/*
Route           authors/books
Description     Get all authors based on a book name
Access          Public
Parameter       isbn
Methods         GET
*/
booky.get("/authors/books/:isbn",async (req,res)=> {
    const getAuthorsOnBook = await AuthorModel.find({books: req.params.isbn});
  
  if(!getAuthorsOnBook) {
    return res.json({
      error: `No Authors found for book of ${req.params.isbn}`
    });
  }
  
  return res.json({authorsBook: getAuthorsOnBook});
  });

//GET all publications
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

//GET specific publication
/*
Route           /publication
Description     Get specific publication
Access          Public
Parameter       name
Methods         GET
*/
booky.get("/publication/:name",async (req,res) => {
    const publicationName = await PublicationModel.findOne({name: req.params.name});
   
     if(!publicationName) {
       return res.json({
         error: `No Publication found for name of ${req.params.name}`
       });
     }
   
     return res.json({publicationName: publicationName});
   
   });

//GET all publication based on a book name
/*
Route           publication/books
Description     Get all publication based on a book name
Access          Public
Parameter       isbn
Methods         GET
*/
booky.get("/publication/book/:isbn",async (req,res)=> {
    const getPublicationOnBook = await PublicationModel.find({books: req.params.isbn});
  
  if(!getPublicationOnBook) {
    return res.json({
      error: `No Publication found for book of ${req.params.isbn}`
    });
  }
  
  return res.json({publicationBook: getPublicationOnBook});
  });

//ADD NEW BOOK
/*
Route           /book/new
Description     add new book
Access          Public
Parameter       NONE
Methods         POST
*/
booky.post("/book/new", async (req,res)=> {
    const { newBook } = req.body;
    const addNewBook = await BookModel.create(newBook)
    return res.json({newBooks: addNewBook, message: "Book was added!"});
  });

//ADD NEW author
/*
Route           /author/new
Description     add new author
Access          Public
Parameter       NONE
Methods         POST
*/
booky.post("/author/new", async (req,res)=> {
    const { newAuthor } = req.body;
   const addNewAuthor = await AuthorModel.create(newAuthor);
    return res.json({newAuthors: addNewAuthor, message: "Author was added"});
  });

//ADD NEW publication
/*
Route           /publication/new
Description     add new publication
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
  
  
//UPADTE PUBLICATION AND BOOK
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
        // authors: req.params.authorId
        id: parseInt(req.params.authorId)

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
  
booky.listen(3000, () => console.log("The server is up & running"));