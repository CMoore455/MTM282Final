const express = require('express')
const models = require('../data/models')
var bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://webfinaluser:WebFinal@number2mylord-hy3vz.mongodb.net/Number2MyLord?retryWrites=true&w=majority', {useNewUrlParser: true} )
const adminRouter = express.Router()
let errorMessage = null;

adminRouter.route('/login').get(
    function(request, response) {
        let model = models.getUiModel("Mirrors - Log In!", "User Log In", request)
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

        models.User.find( { $or: [{email: postedUsernameOrEmail}, {username: postedUsernameOrEmail}] }, function (err, docs) {
            if (docs.length){
                let success = bcrypt.compareSync(postedPassword, docs[0].password);
                if (success) {
                    if (docs[0].isActive) {
                        request.session.username = docs[0].username
                        request.session.isAdmin = docs[0].isAdmin
                        request.session.secret = 'mirrors'

                        if (docs[0].isAdmin) {
                            response.redirect('/admin')
                            return
                        } else {
                            response.redirect('/')
                            return
                        }
                    } else {
                        // not active
                        errorMessage = "Unable to log in because your account is in-active!"
                        response.redirect('login')
                        return
                    }
                }
            }

            // failed log-in
            console.log("login failed")
            errorMessage = "Wrong username or password"
            response.redirect('login')
            return
        });
    }
)

adminRouter.route('/register').get(
    function (request, response) {
        let model = models.getUiModel("Mirrors - Register", "User Registration", request)
        models.Question.find({}, function (err, docs) {
            if(docs.length){
                model.questions = docs
                if (errorMessage) {
                    model.errorMessage = errorMessage
                    errorMessage = null
                }
                response.render("register", model)
            }

        })

    }
)

adminRouter.route('/register').post(
    function (request, response) {
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(request.body.password, salt);
        var numOfQuestions = 3
        var userResponses = []
        for (let i = 0; i < numOfQuestions; i++){
            splitArray = request.body["question"+i].split(":")
            userResponses.push({
                question: splitArray[0],
                choice: splitArray[1]
            })
        }
        console.log(userResponses)
        let newUser = new models.User(
            {
                username: request.body.username,
                password: hash,
                email: request.body.email,
                isAdmin: false,
                isActive: true,
                age: request.body.age,
                responses: userResponses
            }
        )
        models.User.find( { $or: [{email: newUser.email}, {username: newUser.username}] }, function (err, docs) {
            if (docs.length){
                errorMessage = 'Email or username already exists'
                response.redirect("register")
            }else{
                newUser.save(function (err, fluffy) {
                    if (err) {
                        response.redirect("register")
                        return console.error(err);
                    }
                    request.session.username = newUser.username
                    request.session.isAdmin = newUser.isAdmin
                    request.session.secret = 'mirrors'
                    response.redirect('/')
                    console.log('--- User saved ---')
                });
            }
        });
    }
)

// Shows a table listing all of the users, theirs user information and current status (active,  suspended.)
// Give the admin user the ability to suspend/activate user accounts.
adminRouter.route('/').get(
    function(request, response) {
        if (!request.session.username || !request.session.isAdmin) {
            // not logged in or is not admin
            // alert("You must be an admin to view that page!")
            response.redirect('/')
            return
        }

        let model = models.getUiModel("Admin Page", "Admin Page", request)
        let promises = []

        // get all users
        promises.push(new Promise(function(resolve, reject) {
            models.User.find( { username: { $ne: "admin" } }, function (err, docs) {
                if (err) return console.log(err)
                if (docs) {
                    if (docs.length) {
                        resolve(docs)
                    } else {
                        resolve(null)
                    }
                }
            })
        }))

        promises.push(new Promise(function(resolve, reject) {
            models.Question.find({}, function (err, docs) {
                if (err) return console.log(err)
                if (docs) {
                    let questions = []
                    if (docs.length) {
                        for (let question of docs) {
                            questions.push(question.prompt)
                        }
                        resolve(questions)
                    }
                } else {
                    resolve( ["", "", ""] )
                }
            })
        }))

        Promise.all(promises).then( (dataArray) => {
            if (dataArray[0] == null) {
                model.errorMessage = "No users to display"
            } else {
                model.allUsers = dataArray[0]
            }

            model.questions = dataArray[1]
            response.render("admin", model)
            return
        })
    }
)

adminRouter.route('/update').post(
    function(request, response) {
        // check if the body object has changed
        //                                  ACTIVE      ==      NOT EXISTS                  RETURN TRUE
        //                                  ACTIVE      ==      EXISTS                      RETURN FALSE
        let chkIsActive = request.body['chkIsActive'] ? true : false
        let chkIsAdmin = request.body['chkIsAdmin'] ? true : false
        let wasActive = request.query.wasActive === 'true'
        let wasAdmin = request.query.wasAdmin === 'true'
        let changeActiveStatus = wasActive === chkIsActive ? false : true
        let changeAdminStatus = wasAdmin === chkIsAdmin ? false : true
        // console.log("\nwasActive : isActive")
        // console.log(`${wasActive} === ${chkIsActive} -> change: ${changeActiveStatus}`)
        // console.log("\nwasAdmin : isAdmin")
        // console.log(`${wasAdmin} === ${chkIsAdmin} -> change: ${changeAdminStatus}`)
        if (changeActiveStatus || changeAdminStatus) {
            // update one or both fields
            let dbPromise = new Promise(function(resolve, reject) {
                models.User.find({ _id: request.query.userId }, function (err, users) {
                    if (err) return console.log(err)
                    resolve(users[0])
                })
            })

            dbPromise.then( (dbUser) => {
                dbUser.isActive = changeActiveStatus ? !dbUser.isActive: dbUser.isActive
                dbUser.isAdmin = changeAdminStatus ? !dbUser.isAdmin: dbUser.isAdmin
                dbUser.save(function(err) {
                    if (err) return console.log(err)

                    response.redirect('/admin')
                    return
                })
            })
        } else {
            response.redirect('/admin')
            return
        }
    }
)

adminRouter.route('/logout').get(
    function(request, response) {
        request.session.destroy()
        let model = models.getUiModel("Mirrors - Logout", "Logged Out")
        response.render("logout", model)
})

adminRouter.route('/profile').get(
    function(request, response) {
        models.User.find({username: request.session.username}, function(err, users){
            let model = models.getUiModel("Mirrors - Profile", "Profile", request)
            models.Question.find({}, function (err, questions){

                model.user = users[0]
                model.questions = questions
                console.log(users[0])
                response.render("profile", model)
            })

        })
    }
)

adminRouter.route('/profile').post(
    function(request, response) {
        var numOfQuestions = 3
        var userResponses = []
        for (let i = 0; i < numOfQuestions; i++){
            splitArray = request.body["question"+i].split(":")
            userResponses.push({
                question: splitArray[0],
                choice: splitArray[1]
            })
        }
        let newPassword = request.body.newPassword

        let userUpdates = {
            username: request.body.username,
            email: request.body.email,
            responses: userResponses
        }
        if (newPassword!==""){
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(newPassword, salt);
            userUpdates.password = hash
        }
        models.User.updateOne({username: request.session.username}, userUpdates,
             function(err, numberAffected, rawResponse) {
                console.log("--User Updated--")
                response.redirect('/profile')
           //handle it
        })
    }
)

module.exports = adminRouter
