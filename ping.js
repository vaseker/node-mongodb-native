/**
 * Created by vaseker on 16.06.14.
 */
var MongoClient = require('./').MongoClient,
    repl = 'spec-mg01g.spec.yandex.net:27017,spec-mg01e.spec.yandex.net:27017,spec-mg01d.spec.yandex.net:27017,spec-mg01h.spec.yandex.net:27017,spec-mg01f.spec.yandex.net:27017',
    DBname = 'sochi',
    dummy = function () {},
    logger = function () {
        console.log(arguments);
    };


MongoClient.connect([
    'mongodb://',
    repl,
    '/',
    DBname
].join(''), {
    native_parser: true,
    db: {
        read_preference: 'secondaryPreferred'
    },
    replSet: {
        socketOptions: {
            pingInterval: 1000,
            pingTimeout: 100
        },
        strategy: 'ping',
        secondaryAcceptableLatencyMS: 50
    },
    logger: {
        debug: logger,
        error: logger
    }
}, function(err, db) {
    if (err) {
        return console.error(err);
    }
    console.log('Connected to MongoDB');

    var admin = db.admin(),
        copyrights = db.collection('fifa14_copyrights');

    setInterval(function () {
        db.collection('fifa14_copyrights')
            .findOne({}, {copyright: 1}, function (err, data) {
                if (err) {
                    console.log('ERROR: copyrights.findOne');
                    console.error(err);
                }
            });
    }, 1000);

    setInterval(function () {
        admin.replSetGetStatus(function (err, result) {
            if (err) {
                return console.error(err);
            }
            result.members.forEach(function (server) {
                //console.log(server.name, server.pingMs ? server.pingMs + 'ms' : 'master');
            });
        });
    }, 1000);

});
