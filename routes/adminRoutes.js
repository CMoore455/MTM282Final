const express = require('express')
const models = require('../data/models')
var bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://webfinaluser:WebFinal@number2mylord-hy3vz.mongodb.net/Number2MyLord?retryWrites=true&w=majority', {useNewUrlParser: true} )
const adminRouter = express.Router()
let errorMessage = null;

adminRouter.route(`/login`).get(
    function(request, response) {
        let model = models.getUiModel("Mirrors - Log In!", "User Log In")
        if (errorMessage) {
            model.errorMessage = errorMessage
            errorMessage = null
        }
        response.render('login', model)
    }
)

adminRouter.route(`/login`).post(
    function(request, response) {
        let postedUsername = response.body.username
        let postedPassword = response.body.password
        let success = postedUsername == 'root' && postedPassword == 'admin'
        
        // mongo db fetch?
        let mongoUserDoc = {
            username: postedUsername,
            password: postedPassword,
            userId: 100
        }
        
        if (success) {
            request.session.userId = mongoUserDoc.userId
            request.session.secret = 'kars'
            response.redirect('/')
        } else {
            response.redirect('login')
        }
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