console.log("admin script loaded")

function updateIsActive(user_id) {
    console.log("updating user active status")

    // find user by _id
    models.User.find( { _id: user_id } , function (err, user) {
        if (err) return console.log(err)

        user.isActive = !user.isActive
        user.save(function(err){
            if (err) return console.log(err)
            console.log(`updated user to: isActive=${user.isActive}`)
        })
    })
}

function updateIsAdmin(user_id) {
    console.log("updating user admin status")
    // find user by _id
    models.User.find( { _id: user_id } , function (err, user) {
        if (err) return console.log(err)

        user.isAdmin = !user.isAdmin
        user.save(function(err){
            if (err) return console.log(err)
            console.log(`updated user to: isAdmin=${user.isAdmin}`)
        })
    })
}

module.exports = {
    updateIsAdmin,
    updateIsActive
}