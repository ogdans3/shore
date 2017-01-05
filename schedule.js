var moment = require("moment");

//Variables populated in init function
var watch;
var watchDB;

var watchedList = [];

var schedule = function(time, cb){
    if(time < 0)
        time = 0;
    setTimeout(function(){
        cb();
    }, time * 1000);
}

var updateLastScanTime = function(doc){
    //This will update the record in the database, but not the record that is being used in the wrapper functions.
    //This will probably be fine, as we do not use the lastScan time in the record in the wrapper function
    watchDB.update({_id: doc._id}, {$set: {lastScan: moment().unix()}}, function(err){
        if(err)
            console.error(err);
    });
}

var wrapper = function(timeLeft, doc){
    schedule(timeLeft, function(){
        watch.single(doc, function(){
            updateLastScanTime(doc);

            var rescanIn = moment.duration(doc.howOften, "hours").asSeconds();
            wrapper(rescanIn, doc);
            console.log("Periodic scan of playlist completed");
            console.log("Rescan scheduled in", rescanIn, "seconds");
        });
    });                
}

var scheduleAll = function(app){
    app.get("dbs").watch.find({}).exec(function(err, docs){
        if(err){
            console.error("An error happened when trying to find all watched objects");
            throw err;
            process.exit(1);
        }
        
        var currTime = moment();
        for(var i = 0; i < docs.length; i++){
            var doc = docs[i];
            //We do not want to rewatch a playlist
//            if(watchedList.indexOf(doc._id) > -1)
//                continue;
            var lastTime = moment.unix(doc.lastScan);
            
            //doc.howOften = .001; //For testing //TODO: Remove this line
            var timeLeft = doc.howOften - currTime.diff(lastTime, "hours");
            timeLeft = moment.duration(timeLeft, "hours").asSeconds();
                
            watchedList.push(doc._id);
            wrapper(timeLeft, doc);
            console.log("Scanning", doc.url, "in", timeLeft, "seconds");
        }    
    })
}

var init = function(app){
    watch = app.get("watch");
    watchDB = app.get("dbs").watch;
}

module.exports = {
    single: schedule,
    all: scheduleAll,
    init: init
}