'use strict';

let t = require('../testsetup');
let Thing = require('../../models/thing');
describe("Thing", function () {
    beforeEach(function (done) {
        if (t.mongoose.connection.db) return done();
        t.mongoose.connect(t.dbURI, done);
    });

    it('save fails if you do not put in name',function (done) {
        new Thing().save(function (err, doc) {
            t.should.exist(err);
            done();
        });
    })

});

describe("Example spec for a model", function () {
    beforeEach(function (done) {
        if (t.mongoose.connection.db) return done();
        t.mongoose.connect(t.dbURI, done);
    });

    it("can be saved", function (done) {
        new Thing({name: "1"}).save(done);
    });

    it("can be listed", function (done) {
        new Thing({name: "1"}).save(function (err, model) {
            if (err) return done(err);

            new Thing({name: "2"}).save(function (err, model) {
                if (err) return done(err);

                Thing.find({}, function (err, docs) {
                    if (err) return done(err);
                    docs.length.should.equal(2); // without clearing the DB between specs, this would be 3
                    done();
                });
            });
        });
    });

    it("can clear the DB on demand", function (done) {
        new Thing({name: "5"}).save(function (err, model) {
            if (err) return done(err);

            t.clearDB(function (err) {
                if (err) return done(err);

                Thing.find({}, function (err, docs) {
                    if (err) return done(err);
                    docs.length.should.equal(0);
                    done();
                });
            });
        });
    });
});
