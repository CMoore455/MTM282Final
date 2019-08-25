const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema
mongoose.connect('mongodb+srv://webfinaluser:WebFinal@number2mylord-hy3vz.mongodb.net/Number2MyLord?retryWrites=true&w=majority', {useNewUrlParser: true} )

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     // we're connected!
//     console.log('--- Creating Admin user ---')
//     let adminUser = new User(
//         {
//             username: 'admin',
//             password: bcrypt.hashSync('pass'),
//             isAdmin: true,
//             isActive: true,
//             age: 239
//         }
//     )
//     console.log(adminUser)

//     adminUser.save(function (err, fluffy) {
//         if (err) return console.error(err);
//         console.log('--- Admin saved ---')
//     });
// });

function getUiModel(pageTitle, pageHeader, request) {
    let model = {
        pageTitle: pageTitle,
        pageHeader: pageHeader
    }
    
    if (request) {
        if (request.session.username) {
            let user = {
                username: request.session.username,
                isAdmin: request.session.isAdmin
            }
            model.user = user
        }
    }

    return model
}

// Mongoose Schema represents a collection in the MongoDB
// It is the skeleton of the model
const questionSchema = new Schema({
    prompt: String,
    choices: [String]
})

// This creates a JS object based off the Schema to use in code and CRUD operations
const Question = mongoose.model('Question', questionSchema, "questions")

const responseSchema = new Schema({
    question: String,
    choice: String
})

const userSchema = new Schema({
    username: String,
    password: String, 
    email: String,
    age: Number,
    isAdmin: Boolean,
    isActive: Boolean,
    responses: [responseSchema]
})

const User = mongoose.model('User', userSchema, "users")

module.exports = 
    {
        getUiModel, 
        User,
        Question
    }
