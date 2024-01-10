'use strict';
const BookModel = require("../database").Book;
const CommentModel = require("../database").Comment;

module.exports = function (app) {

  app.route('/api/books')
    .get(async (req, res) => {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const books = await BookModel.find({});
      if (!books) {
        res.json('no book exists');
        return;
      }
      res.json(books);
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      if (!title) {
        res.json("missing required field title");
        return;
      }
      let newBook = new BookModel({title: title, commentcount: 0});
      newBook = await newBook.save();

      let initiateComment = new CommentModel({
        bookId: newBook._id,
        comment: []
      })
      initiateComment = await initiateComment.save();

      res.json({
        _id: newBook._id,
        title: newBook.title
      });
    })
    
    .delete(async (req, res) => {
      //if successful response will be 'complete delete successful'
      let deleteAllBook = await BookModel.deleteMany({});
      let deleteAllComment = await CommentModel.deleteMany({});
      if (deleteAllBook.deletedCount > 0 && deleteAllComment.deletedCount > 0) {
        res.json('complete delete successful');
        return;
      }else {
        res.json('delete unsuccessful');
      }
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if (!bookid) {
        res.json('no id provided');
        return;
      }
      let findBook = await BookModel.findOne({_id: bookid});
      if (!findBook) {
        res.json('no book exists')
        return;
      }
      let findComment = await CommentModel.findOne({bookId: bookid});

      res.json({
        comments: findComment.comment,
        _id: bookid,
        title: findBook.title,
        commentcount: findBook.commentcount
        
      })
    })
    
    .post(async (req, res) => {
      let bookid = req.params.id;
      let newComment = req.body.comment;
      //json res format same as .get
      if (!newComment) {
        res.json('missing required field comment');
        return;
      }
      let findBook = await BookModel.findByIdAndUpdate(bookid, {$inc : {'commentcount': 1}});
      if (!findBook) {
        res.json('no book exists');
        return;
      }
      findBook = await findBook.save();

      let addComment = await CommentModel.findOne({bookId: bookid})
        .then((data) => {
          data.comment.push(newComment);
          data.save();

          res.json({
            comments: data.comment,
            _id: bookid,
            title: findBook.title,
            commentcount: findBook.commentcount
          })
        })
    })
    
    .delete(async (req, res) => {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      let findBook = await BookModel.findOne({_id: bookid});
      if (!findBook) {
        res.json('no book exists')
        return;
      }
      let deleteBook = await BookModel.deleteOne({_id: bookid});
      let deleteComment = await CommentModel.deleteOne({bookId: bookid});

      if (deleteBook.deletedCount > 0 && deleteComment.deletedCount > 0) {
        res.json('delete successful');
        return;
      }else {
        res.json('delete unsuccessful');
      }
    });
};
