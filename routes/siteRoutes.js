const express = require('express')
const models = require('../data/models')
const siteRouter = express.Router()

siteRouter.route(['/', '/home']).get(
    function(request, response) {
        let model = models.getUiModel("Mirrors - Home", "Welcome to the Home Page", request)
        
        

        response.render("home", model )
    }
)

module.exports = siteRouter
