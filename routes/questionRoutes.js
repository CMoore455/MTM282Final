const express = require('express')
const models = require('../data/models')
const questionRouter = express.Router()
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://webfinaluser:WebFinal@number2mylord-hy3vz.mongodb.net/Number2MyLord?retryWrites=true&w=majority', {useNewUrlParser: true} )


questionRouter.route('/questions').get(
    function (request, response) {
        models.Question.find({}, function (err, docs) {
            if (docs.length) {
                response.send(docs);
            }
        })
    }
)

questionRouter.route('/responses').get(
    function (request, response) {
        models.User.aggregate([
            { $unwind :'$responses'},
            { $project : { _id:0,  question: '$responses.question', choice : '$responses.choice' } }
          ], function(err, docs) {
                response.send(docs)
          });
        // response.send(models.User.aggregate([
        //     { $unwind :'$responses'},
        //     { $project : { _id:0,  question: '$responses.question', choice : '$responses.choice' } }
        // ]))
    }
)


module.exports = questionRouter