const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = Express()
const port = 3000

app.use(express.static(`${__dirname}`))
app.use('view engine', 'pug')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended:true } ))

const productRoutes = require("./routes/productRoutes")
app.use("/products", productRoutes)

const adminRouter = require("./routes/adminRoutes")
app.use("/admin", adminRouter)

const siteRoutes = require("./routes/siteRoutes")
app.use("/", siteRoutes)

app.use(session({
    secret: "secretKey",
    cookie: { }
}))

app.listen(port, () => {
    console.log(`Express ready on port ${port}`)
})