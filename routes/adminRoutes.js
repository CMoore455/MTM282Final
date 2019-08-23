const express = require('express')
const models = require('../data/models')
var bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://webfinaluser:WebFinal@number2mylord-hy3vz.mongodb.net/Number2MyLord?retryWrites=true&w=majority', {useNewUrlParser: true} )
const adminRouter = express.Router()
let errorMessage = null;

adminRouter.route('/login').get(
    function(request, response) {
        let model = models.getUiModel("Mirrors - Log In!", "User Log In")
        if (errorMessage) {
            model.errorMessage = errorMessage
            errorMessage = null
        }
        response.render('login', model)
    }
)

adminRouter.route('/login').post(
    function(request, response) {
        let postedUsernameOrEmail = request.body["usernameOrEmail"]
        let postedPassword = request.body["password"]
        console.log(request)
        models.User.find( { $or: [{email: postedUsernameOrEmail}, {username: postedUsernameOrEmail}] }, function (err, docs) {
            if (docs.length){
                console.log(postedPassword)
                console.log(docs[0].password)
                let success = bcrypt.compareSync(postedPassword, docs[0].password);
                console.log(request)
                if (success && docs[0].isActive) {
                    
                    request.session.username = docs[0].username
                    request.session.isAdmin = docs[0].isAdmin
                    request.session.secret = 'mirrors'
                    response.redirect('/')
                } else {
                    response.redirect('login')
                }
            }else{
            }
            
        });      
     
    }
)

adminRouter.route('/register').get(
    function (request, response) {
        let model = models.getUiModel("Mirrors - Register", "User Registration")
        if (errorMessage) {
            model.errorMessage = errorMessage
            errorMessage = null
        }
        response.render("register", model)
    }
)

adminRouter.route('/register').post(
    function (request, response) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(request.body.password, salt);
        let newUser = new models.User(
            {
                username: request.body.username,
                password: hash,
                email: request.body.email,
                isAdmin: false,
                isActive: true,
                age: request.body.age
            }
        )
        models.User.find( { $or: [{email: newUser.email}, {username: newUser.username}] }, function (err, docs) {
            if (docs.length){
                errorMessage = 'Email or username exist already'
                response.redirect("register")
            }else{
                newUser.save(function (err, fluffy) {
                    if (err) {
                        response.redirect("register")
                        return console.error(err);
                    }
                    response.redirect("/")
                    console.log('--- User saved ---')
                });
            }
            
        });
        
        
    }
)

module.exports = adminRouter