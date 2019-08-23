const Express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const app = Express()
const port = 3000


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://webfinaluser:<password>@number2mylord-hy3vz.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


app.use(Express.static(`${__dirname}`))
app.set('view engine', 'pug')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded( { extended:true } ))

const adminRouter = require("./routes/adminRoutes")
app.use("/admin", adminRouter)

const siteRouter = require("./routes/siteRoutes")
app.use("/", siteRouter)

app.use(session({
    secret: "secretKey",
    cookie: { }
}))

app.listen(port, () => {
    console.log(`Express ready on port ${port}`)
})