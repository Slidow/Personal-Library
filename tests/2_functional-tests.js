/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const wrongId = '659f1060b3e6d44f952ada32';
let book1;

suite('Functional Tests', function() {

  suite('Routing tests', function() {

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({
            title: 'testBook'
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, true);
            assert.property(res.body, "_id");
            assert.property(res.body, "title");
            assert.equal(res.body.title, 'testBook');
            book1 = res.body;
            done();
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field title')
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, true);
            assert.property(res.body[0], "_id");
            assert.property(res.body[0], "title");
            assert.property(res.body[0], 'commentcount');
            done();
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/659f1060b3e6d44f952ada32')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists')
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
          .get(`/api/books/${book1._id}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, true);
            assert.property(res.body, 'comments');
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.property(res.body, 'commentcount');
            done();
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post(`/api/books/${book1._id}`)
          .send({
            comment: "testComment"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, true);
            assert.property(res.body, 'comments');
            assert.property(res.body, '_id');
            assert.property(res.body, 'title');
            assert.property(res.body, 'commentcount');
            assert.include(res.body.comments, 'testComment')
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
          .post(`/api/books/${book1._id}`)
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field comment');
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post('/api/books/659f1060b3e6d44f952ada32')
          .send({
            comment: "testComment2"
          })
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists')
            done();
          })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
          .delete(`/api/books/${book1._id}`)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'delete successful')
            done();
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
          .delete('/api/books/659f1060b3e6d44f952ada32')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists')
            done();
          })
      });

    });

  });

});