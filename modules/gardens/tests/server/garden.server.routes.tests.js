'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Garden = mongoose.model('Garden'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, garden;

/**
 * Garden routes tests
 */
describe('Garden CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Garden
    user.save(function () {
      garden = {
        name: 'Garden name'
      };

      done();
    });
  });

  it('should be able to save a Garden if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Garden
        agent.post('/api/gardens')
          .send(garden)
          .expect(200)
          .end(function (gardenSaveErr, gardenSaveRes) {
            // Handle Garden save error
            if (gardenSaveErr) {
              return done(gardenSaveErr);
            }

            // Get a list of Gardens
            agent.get('/api/gardens')
              .end(function (gardensGetErr, gardensGetRes) {
                // Handle Garden save error
                if (gardensGetErr) {
                  return done(gardensGetErr);
                }

                // Get Gardens list
                var gardens = gardensGetRes.body;

                // Set assertions
                (gardens[0].user._id).should.equal(userId);
                (gardens[0].name).should.match('Garden name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Garden if not logged in', function (done) {
    agent.post('/api/gardens')
      .send(garden)
      .expect(403)
      .end(function (gardenSaveErr, gardenSaveRes) {
        // Call the assertion callback
        done(gardenSaveErr);
      });
  });

  it('should not be able to save an Garden if no name is provided', function (done) {
    // Invalidate name field
    garden.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Garden
        agent.post('/api/gardens')
          .send(garden)
          .expect(400)
          .end(function (gardenSaveErr, gardenSaveRes) {
            // Set message assertion
            (gardenSaveRes.body.message).should.match('Please fill Garden name');

            // Handle Garden save error
            done(gardenSaveErr);
          });
      });
  });

  it('should be able to update an Garden if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Garden
        agent.post('/api/gardens')
          .send(garden)
          .expect(200)
          .end(function (gardenSaveErr, gardenSaveRes) {
            // Handle Garden save error
            if (gardenSaveErr) {
              return done(gardenSaveErr);
            }

            // Update Garden name
            garden.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Garden
            agent.put('/api/gardens/' + gardenSaveRes.body._id)
              .send(garden)
              .expect(200)
              .end(function (gardenUpdateErr, gardenUpdateRes) {
                // Handle Garden update error
                if (gardenUpdateErr) {
                  return done(gardenUpdateErr);
                }

                // Set assertions
                (gardenUpdateRes.body._id).should.equal(gardenSaveRes.body._id);
                (gardenUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Gardens if not signed in', function (done) {
    // Create new Garden model instance
    var gardenObj = new Garden(garden);

    // Save the garden
    gardenObj.save(function () {
      // Request Gardens
      request(app).get('/api/gardens')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Garden if not signed in', function (done) {
    // Create new Garden model instance
    var gardenObj = new Garden(garden);

    // Save the Garden
    gardenObj.save(function () {
      request(app).get('/api/gardens/' + gardenObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', garden.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Garden with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/gardens/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Garden is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Garden which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Garden
    request(app).get('/api/gardens/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Garden with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Garden if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Garden
        agent.post('/api/gardens')
          .send(garden)
          .expect(200)
          .end(function (gardenSaveErr, gardenSaveRes) {
            // Handle Garden save error
            if (gardenSaveErr) {
              return done(gardenSaveErr);
            }

            // Delete an existing Garden
            agent.delete('/api/gardens/' + gardenSaveRes.body._id)
              .send(garden)
              .expect(200)
              .end(function (gardenDeleteErr, gardenDeleteRes) {
                // Handle garden error error
                if (gardenDeleteErr) {
                  return done(gardenDeleteErr);
                }

                // Set assertions
                (gardenDeleteRes.body._id).should.equal(gardenSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Garden if not signed in', function (done) {
    // Set Garden user
    garden.user = user;

    // Create new Garden model instance
    var gardenObj = new Garden(garden);

    // Save the Garden
    gardenObj.save(function () {
      // Try deleting Garden
      request(app).delete('/api/gardens/' + gardenObj._id)
        .expect(403)
        .end(function (gardenDeleteErr, gardenDeleteRes) {
          // Set message assertion
          (gardenDeleteRes.body.message).should.match('User is not authorized');

          // Handle Garden error error
          done(gardenDeleteErr);
        });

    });
  });

  it('should be able to get a single Garden that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Garden
          agent.post('/api/gardens')
            .send(garden)
            .expect(200)
            .end(function (gardenSaveErr, gardenSaveRes) {
              // Handle Garden save error
              if (gardenSaveErr) {
                return done(gardenSaveErr);
              }

              // Set assertions on new Garden
              (gardenSaveRes.body.name).should.equal(garden.name);
              should.exist(gardenSaveRes.body.user);
              should.equal(gardenSaveRes.body.user._id, orphanId);

              // force the Garden to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Garden
                    agent.get('/api/gardens/' + gardenSaveRes.body._id)
                      .expect(200)
                      .end(function (gardenInfoErr, gardenInfoRes) {
                        // Handle Garden error
                        if (gardenInfoErr) {
                          return done(gardenInfoErr);
                        }

                        // Set assertions
                        (gardenInfoRes.body._id).should.equal(gardenSaveRes.body._id);
                        (gardenInfoRes.body.name).should.equal(garden.name);
                        should.equal(gardenInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Garden.remove().exec(done);
    });
  });
});
