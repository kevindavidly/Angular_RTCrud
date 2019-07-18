const express = require('express');
const app = express();
const server = app.listen(8000);
var path = require("path");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/task', {
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;

app.use(express.static( __dirname + '/public/dist/public' ));
app.use(express.static(__dirname + "/static"));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

//===================================================================
// Schemas
//===================================================================


var TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        default: ''
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
})
mongoose.model('Task', TaskSchema);
var Task = mongoose.model('Task');

//===================================================================
// Route to show all
//===================================================================


app.get('/task', function (req, res) {
    Task.find({}, function (err, tasks) {
        if (err) {
            console.log("Returned error", err);
            // respond with JSON
            res.json({
                message: "Error",
                error: err
            })
        } else {
            // respond with JSON
            res.json({
                message: "Success",
                data: tasks
            })
        }
    })
})

//===================================================================
// Route to show by id
//===================================================================

app.get('/task/:id', (req, res) => {
    Task.findById(req.params.id, function (err, tasks) {
        if (err) {
            console.log("Returned error", err);
            // respond with JSON
            res.json({
                message: "Error",
                error: err
            })
        } else {
            // respond with JSON
            res.json({
                message: "Success",
                data: tasks
            })
        }
    })
})

//===================================================================
// Route to add 
//===================================================================


app.post('/task/new', (req, res) => {
    Task.create(req.body, function (err, tasks) {
        if (err) {
            console.log("Returned error", err);
            // respond with JSON
            res.json({
                message: "Error",
                error: err
            })
        } else {
            // respond with JSON
            res.json({
                message: "Success",
                data: tasks
            })
        }
    })
})

//===================================================================
// Route to edit
//===================================================================

app.put('/task/:id', (req, res) => {
    Task.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
        new: true
    }, (err, tasks) => {
        if (err) {
            console.log("Returned error", err);
            res.json({
                message: "Error",
                error: err
            })
        } else {
            res.json({
                message: "Success",
                data: tasks
            })
        }
    })
})

//===================================================================
// Route to delete 
//===================================================================

app.delete('/task/:id', (req, res) => {
    Task.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log("Returned error", err);
            // respond with JSON
            res.json({
                message: "Error",
                error: err
            })
        } else {
            // respond with JSON
            res.json({
                message: "Success"
            })
        }
    })
})

//===================================================================
// 404
//===================================================================

app.all("*", (req,res,next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
  });