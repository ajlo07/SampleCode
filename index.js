const express = require('express');
const multer = require('multer');
const EventEmitter = require('events');
const event = new EventEmitter();
require('./config');
const userdata = require('./userdata');
let count = 0;

const app = express();
const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, "uploads")
        },
        filename: function(req, filename, cb) {
            cb(null, filename.filename+"-"+Date.now()+ ".jpg")
        }
    })
}).single("image");

app.use(express.json());
event.on("created", () => {
count++;
console.log("created record",count)
})

app.post('/create',async (req, resp)=> {
    let data = new userdata(req.body);
    let result = await data.save();
    resp.send(result);
    event.emit("created");
});

app.get('/list',async (req, resp)=> {
    let data = await userdata.find();
    resp.send(data);
});

app.delete('/delete/:_id',async (req, resp)=> {
    let data = await userdata.deleteOne(req.params);
    resp.send(data);
});

app.put('/update/:_id',async (req, resp)=> {

    let data = await userdata.updateOne(req.params,
        { 
            $set: req.body
        });
    resp.send(data);
});

app.get('/search/:key',async (req, resp)=> {
    let data = await userdata.find({
        $or : [{"name": {$regex: req.params.key}},
        {"city": {$regex: req.params.key}}]
    });
    resp.send(data);
});

app.post('/upload',upload, async (req, resp)=> {
    let data = new userdata(req.body);
    let result = await data.save();
    resp.send(result);
});

app.listen(7000);