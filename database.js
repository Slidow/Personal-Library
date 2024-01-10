const mongoose = require('mongoose');

// connecting to mongoDB
const db = mongoose.connect(process.env.DB);

// book schema
const bookSchema = mongoose.Schema({
    title: {type: String, required: true},
    commentcount: Number
})

// comment schema
const commentSchema = mongoose.Schema({
    bookId: String,
    comment: Array
})

// book model
const Book = mongoose.model('Book', bookSchema);

// comment model
const Comment = mongoose.model('Comment', commentSchema);

//export
exports.Book = Book;
exports.Comment = Comment;