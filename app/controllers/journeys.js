var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.saveJourney = function (req, res) {
    //The route object to push to user.routes: 
    var route = {
        name: req.body.name,
        coords: req.body.coords
    };
    var email = req.body.email;

    //save coords into user.routes array
    User.findOneAndUpdate({
            'local.email': email
        }, {
            $push: {
                routes: route
            }
        }, {
            safe: true,
            upsert: true
        },
        function (err, result) {
            // console.log(err);
            if (err) {
                res.send(err);
            } else {
                res.send(result);
            }
        }
    );
};

module.exports.getJourneys = function (req, res) {
    if (!req.payload._id) {
        res.status(401).json({
            'message': 'Unauthorized request'
        });
    } else {
        // Return the users array of 'routes' using the jwt _id
        User
            .findById(req.payload._id)
            .exec(function (err, user) {
                res.status(200).json(user.routes);
            });
    }
};

module.exports.deleteJourney = function (req, res) {
    var userID = req.payload._id;
    if (!userID) {
        res.status(401).json({
            'message': 'Unauthorized request'
        });
    } else {
        var journeyID = req.query.journeyID;

        User
            .findById(userID, function (err, user) {
                if (!err) {
                    for (var i = 0; i < user.routes.length; i++) {
                        if (user.routes[i].id === journeyID) {
                            user.routes.splice([i], 1);
                        }
                    }
                }
                user.save(function (err) {
                    if(err) {
                        console.error(err);
                    }
                });
            }).exec(function (err, user) {
                return res.status(200).json(user.routes);
            });
    }
};