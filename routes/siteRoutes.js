const express = require('express')
const models = require('../data/models')
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://webfinaluser:WebFinal@number2mylord-hy3vz.mongodb.net/Number2MyLord?retryWrites=true&w=majority', {useNewUrlParser: true} )
const siteRouter = express.Router()

siteRouter.route(['/', '/home']).get(
    function(request, response) {
        let model = models.getUiModel("Mirrors - Home", "Welcome to the Home Page", request)
        response.render("home", model )
    }
)


module.exports = siteRouter
