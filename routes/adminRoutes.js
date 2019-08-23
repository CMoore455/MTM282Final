const express = require('express')
const models = require('../data/models')
const adminRouter = express.Router()

adminRouter.route(`/login`).get(
    function(request, response) {
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
        response.render("register")
    }
)

module.exports = adminRouter