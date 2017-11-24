let Event = require("../models/event");

exports.create = (request, response, next) =>{
    let payload = request.body;
    Event.create(payload, (err, event)=>{
        if(err){return next(err); }
        if(event){
            response.status(201);
            response.send("event created successfully");
        }
    });
};