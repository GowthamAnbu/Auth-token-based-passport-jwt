let Event = require("../models/event");

exports.create = (request, response, next) =>{
    let payload = request.body;
    Event.create(payload, (err, event)=>{
        if(err){return next(err); }
        if(event){
            // response.status(201);
            response.json({message:"event created successfully"});
        }
    });
};

exports.get = (request, response, next) =>{
    Event.find({}, (err, event)=>{
        if(err){return next(err); }
        if(event){
            response.send(event);
        }else{
            response.send({message:"no events found"})
        }
    });
};