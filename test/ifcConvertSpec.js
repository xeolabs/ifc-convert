var ifcConvert = require('../index.js'),
    assert = require('chai').assert,
    path = require('path'),
    fs = require('fs'),
    async = require('async');

describe('ifcConvert', function() {
    it('should convert to supported formats', function(done) {

        //stp seems to take a loong time, so I skip them

        var source = relative('duplex.ifc');
        var formats = ['dae', 'obj', 'igs']; //'stp'

        var testFormat = function(format, callback) {
            var dest = relative('duplex.' + format);

            ifcConvert(source, dest, function(err) {
                assert(!err);

                fs.exists(dest, function(exists) {
                    assert(exists);
                    callback(null);
                });
            });
        };

        async.each(formats, testFormat, done);

    });

    it('should err if source does not exits', function (done) {
        ifcConvert('doesnotexists.ifc', 'doesnotexits.dae', function (err) {
            assert(err);
            assert.equal(err.message, 'Unable to open the source file.');

            done();
        });
    });

    it('should pass errors through', function (done) {
        var source = relative('erroneous.ifc');

        ifcConvert(source, 'erroneous.dae', function (err) {
            assert(err);
            done();
        });
    });

    it('should allow setting path to ifcConvert', function (done) {
        var source = relative('duplex.ifc');
        var options = {path: '/usr/local/bin'};

        ifcConvert(source, 'duplex.dae', options, function (err) {
            assert(!err);
            done();
        });
    });
});

after(function() {
    fs.unlink(relative("duplex.dae"));
    fs.unlink(relative("duplex.obj"));
    fs.unlink(relative("duplex.mtl")); //mtl file is part of the Wavefront OBJ format
    fs.unlink(relative("duplex.igs"));
});

function relative(relPath) {
    return path.resolve(__dirname, relPath);
}
