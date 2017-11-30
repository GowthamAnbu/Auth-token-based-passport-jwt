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

exports.getById = (request, response, next) =>{
    let id = request.params.id;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
        Event.findById(id, (err, event)=>{
            if(err){return next(err); }
            if(event){
                response.send(event);
            }else{
                response.send(event);
            }
        });
    }else{
        response.status(201);
        response.send({message:"not event found"});
    }
};

exports.createe = (payload,next) =>{
    console.log(payload);
    Event.create(payload, (err, event)=>{
        if(err){return next(err); }
        /* if(event){
            console.log("event created successfully");
        } */
    });
};

exports.upload = (eName, photos, next) =>{
    Event.findOneAndUpdate({name:eName}, {$push: {photos:{$each: photos}}},function(err,event){
        if(event){
            console.log(" Event is ",event);
        }
    })
}