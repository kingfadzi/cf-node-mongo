var mongo = require('mongodb');
var mongodbUri = require('mongodb-uri');

var ObjectId = mongo.ObjectID;

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var vcap_services = JSON.parse(process.env.VCAP_SERVICES || '{}');
var uri = vcap_services != undefined && vcap_services.mongolab != undefined ? vcap_services.mongolab[0].credentials.uri : 'mongodb://localhost:27017/cf-workshop-node';

var uriObject = mongodbUri.parse(uri);

console.log("username: "+uriObject.username);
console.log("password: "+uriObject.password);
console.log("host: "+uriObject.hosts[0].host);
console.log("port: "+uriObject.hosts[0].port);
console.log("database: "+uriObject.database);

var username = uriObject.username;
var password = uriObject.password;
var host = uriObject.hosts[0].host;
var port = uriObject.hosts[0].port;
var database = uriObject.database;

var server = new Server(host, port, {auto_reconnect: true});
db = new Db(database, server, {safe: true});

console.log(".. db: "+db);

db.open(function(err, db) {
   
   if(username && password){
        db.authenticate(username, password, function (err, val) {
                        console.log('### finished authenticating');
                        if (err) {
                             console.log('failed to authenticate.....');
                        } else {
                             console.log('yep.. authenticated.....');;




                        }
                 });
    }
    
    if(!err) {
        console.log("Connected to 'winedb' database");
       
        db.collection('wines', {strict:true}, function(errc, collection) {
                        
                        console.log("collection: "+errc);
                        console.log("collection: "+collection);


                        if(!errc) {
                            console.log("Collection exists!");
                        } else {
                            console.log("Collection doesn't exist :(");
                            db.createCollection("wines", function(err, collection){
                                console.log("collection created...");
                               
                            });        
                        }
                    });

   
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving wine: ' + id);
    db.collection('wines', function(err, collection) {
        collection.findOne({'_id':new ObjectId(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('wines', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addWine = function(req, res) {
    var wine = req.body;
    console.log('Adding wine: ' + JSON.stringify(wine));
    db.collection('wines', function(err, collection) {
        collection.insert(wine, {strict:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateWine = function(req, res) {
    var id = req.params.id;
    var wine = req.body;
    delete wine._id;
    console.log('Updating wine: ' + id);
    console.log(JSON.stringify(wine));
    db.collection('wines', function(err, collection) {
        collection.update({'_id':new ObjectId(id)}, wine, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating wine: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(wine);
            }
        });
    });
}

exports.deleteWine = function(req, res) {
    var id = req.params.id;
    console.log('Deleting wine: ' + id);
    db.collection('wines', function(err, collection) {
        collection.remove({'_id':new ObjectId(id)}, {strict:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

exports.instance = function ( req, res ){
  	
    console.log("req: "+JSON.stringify(req.body));

	 var vcapApplication = JSON.parse(process.env.VCAP_APPLICATION || '{}');
	 var vcapServices = process.env.VCAP_SERVICES;
	 
	 console.log("vcapApplication: "+vcapApplication);
	 console.log("vcapServices: "+vcapServices);

     
    var settings = new Array();

    settings.push(JSON.parse(process.env.VCAP_APPLICATION || '{}'));
    settings.push(JSON.parse(process.env.VCAP_SERVICES || '{}'));

     console.log("target: "+settings);

     res.send( settings);
  	 
};

exports.generate = function(req, res) {
    
    console.log("generating data..: ");


    populateDB(); 

    db.collection('wines', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.kill = function(req, res) {
    
    console.log("killing..: ");
    process.exit(-1);
   
};

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var wines = [
    {                                                                                     
        description: "Though subtle in its complexities, this wine is sure to please a wide range of enthusiasts. Notes of pomegranate will delight as the nutty finish completes the picture of a fine sipping experience.",
        picture: "domaine_serene.jpg"
    },
    {
        name: "BODEGA LURTON",
        year: "2011",
        grapes: "Pinot Gris",
        country: "Argentina",
        region: "Mendoza",
        description: "Solid notes of black currant blended with a light citrus make this wine an easy pour for varied palates.",
        picture: "bodega_lurton.jpg"
    },
    {
        name: "LES MORIZOTTES",
        year: "2009",
        grapes: "Chardonnay",
        country: "France",
        region: "Burgundy",
        description: "Breaking the mold of the classics, this offering will surprise and undoubtedly get tongues wagging with the hints of coffee and tobacco in perfect alignment with more traditional notes. Sure to please the late-night crowd with the slight jolt of adrenaline it brings.",
        picture: "morizottes.jpg"
    },
    {
        name: "ARGIANO NON CONFUNDITUR",
        year: "2009",
        grapes: "Cabernet Sauvignon",
        country: "Italy",
        region: "Tuscany",
        description: "Like a symphony, this cabernet has a wide range of notes that will delight the taste buds and linger in the mind.",
        picture: "argiano.jpg"
    },
    {
        name: "DINASTIA VIVANCO ",
        year: "2008",
        grapes: "Tempranillo",
        country: "Spain",
        region: "Rioja",
        description: "Whether enjoying a fine cigar or a nicotine patch, don't pass up a taste of this hearty Rioja, both smooth and robust.",
        picture: "dinastia.jpg"
    },
    {
        name: "PETALOS BIERZO",
        year: "2009",
        grapes: "Mencia",
        country: "Spain",
        region: "Castilla y Leon",
        description: "For the first time, a blend of grapes from two different regions have been combined in an outrageous explosion of flavor that cannot be missed.",
        picture: "petalos.jpg"
    },
    {
        name: "SHAFER RED SHOULDER RANCH",
        year: "2009",
        grapes: "Chardonnay",
        country: "USA",
        region: "California",
        description: "Keep an eye out for this winery in coming years, as their chardonnays have reached the peak of perfection.",
        picture: "shafer.jpg"
    },
    {
        name: "PONZI",
        year: "2010",
        grapes: "Pinot Gris",
        country: "USA",
        region: "Oregon",
        description: "For those who appreciate the simpler pleasures in life, this light pinot grigio will blend perfectly with a light meal or as an after dinner drink.",
        picture: "ponzi.jpg"
    },
    {
        name: "HUGEL",
        year: "2010",
        grapes: "Pinot Gris",
        country: "France",
        region: "Alsace",
        description: "Fresh as new buds on a spring vine, this dewy offering is the finest of the new generation of pinot grigios.  Enjoy it with a friend and a crown of flowers for the ultimate wine tasting experience.",
        picture: "hugel.jpg"
    },
    {
        name: "FOUR VINES MAVERICK",
        year: "2011",
        grapes: "Zinfandel",
        country: "USA",
        region: "California",
        description: "o yourself a favor and have a bottle (or two) of this fine zinfandel on hand for your next romantic outing.  The only thing that can make this fine choice better is the company you share it with.",
        picture: "fourvines.jpg"
    },
    {
        name: "QUIVIRA DRY CREEK VALLEY",
        year: "2009",
        grapes: "Zinfandel",
        country: "USA",
        region: "California",
        description: "Rarely do you find a zinfandel this oakey from the Sonoma region. The vintners have gone to extremes to duplicate the classic flavors that brought high praise in the early '90s.",
        picture: "quivira.jpg"
    },
    {
        name: "CALERA 35TH ANNIVERSARY",
        year: "2010",
        grapes: "Pinot Noir",
        country: "USA",
        region: "California",
        description: "Fruity and bouncy, with a hint of spice, this pinot noir is an excellent candidate for best newcomer from Napa this year.",
        picture: "calera.jpg"
    },
    {
        name: "CHATEAU CARONNE STE GEMME",
        year: "2010",
        grapes: "Cabernet Sauvignon",
        country: "France",
        region: "Bordeaux",
        description: "Find a sommelier with a taste for chocolate and he's guaranteed to have this cabernet on his must-have list.",
        picture: "caronne.jpg"
    },
    {
        name: "MOMO MARLBOROUGH",
        year: "2010",
        grapes: "Sauvignon Blanc",
        country: "New Zealand",
        region: "South Island",
        description: "Best served chilled with melon or a nice salty prosciutto, this sauvignon blanc is a staple in every Italian kitchen, if not on their wine list.  Request the best, and you just may get it.",
        picture: "momo.jpg"
    },
    {
        name: "WATERBROOK",
        year: "2009",
        grapes: "Merlot",
        country: "USA",
        region: "Washington",
        description: "Legend has it the gods didn't share their ambrosia with mere mortals.  This merlot may be the closest we've ever come to a taste of heaven.",
        picture: "waterbrook.jpg"
    }];

    db.collection('wines', function(err, collection) {
        collection.insert(wines, {strict:true}, function(err, result) {});
    });

};
