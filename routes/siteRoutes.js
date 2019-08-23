const express = require('express')
const models = require('../data/models')
const siteRouter = express.Router()

siteRouter.route(['/', '/home']).get(
    function(request, response) {
        let model = models.getUiModel("Mirrors - Home", "Welcome to the Home Page")
        
        if (request.session.username) {
            let user = {
                username: request.session.username,
                isAdmin: request.session.isAdmin
            }
            model.user = user
        }

        response.render("home", model )
    }
)

module.exports = siteRouter
