'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Flow = mongoose.model('Flow'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, flow;

/**
 * Flow routes tests
 */
describe('Flow CRUD tests', function () {

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

    // Save a user to the test db and create new Flow
    user.save(function () {
      flow = {
        name: 'Flow name'
      };

      done();
    });
  });

  it('should be able to save a Flow if logged in', function (done) {
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

        // Save a new Flow
        agent.post('/api/flows')
          .send(flow)
          .expect(200)
          .end(function (flowSaveErr, flowSaveRes) {
            // Handle Flow save error
            if (flowSaveErr) {
              return done(flowSaveErr);
            }

            // Get a list of Flows
            agent.get('/api/flows')
              .end(function (flowsGetErr, flowsGetRes) {
                // Handle Flow save error
                if (flowsGetErr) {
                  return done(flowsGetErr);
                }

                // Get Flows list
                var flows = flowsGetRes.body;

                // Set assertions
                (flows[0].user._id).should.equal(userId);
                (flows[0].name).should.match('Flow name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Flow if not logged in', function (done) {
    agent.post('/api/flows')
      .send(flow)
      .expect(403)
      .end(function (flowSaveErr, flowSaveRes) {
        // Call the assertion callback
        done(flowSaveErr);
      });
  });

  it('should not be able to save an Flow if no name is provided', function (done) {
    // Invalidate name field
    flow.name = '';

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

        // Save a new Flow
        agent.post('/api/flows')
          .send(flow)
          .expect(400)
          .end(function (flowSaveErr, flowSaveRes) {
            // Set message assertion
            (flowSaveRes.body.message).should.match('Please fill Flow name');

            // Handle Flow save error
            done(flowSaveErr);
          });
      });
  });

  it('should be able to update an Flow if signed in', function (done) {
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

        // Save a new Flow
        agent.post('/api/flows')
          .send(flow)
          .expect(200)
          .end(function (flowSaveErr, flowSaveRes) {
            // Handle Flow save error
            if (flowSaveErr) {
              return done(flowSaveErr);
            }

            // Update Flow name
            flow.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Flow
            agent.put('/api/flows/' + flowSaveRes.body._id)
              .send(flow)
              .expect(200)
              .end(function (flowUpdateErr, flowUpdateRes) {
                // Handle Flow update error
                if (flowUpdateErr) {
                  return done(flowUpdateErr);
                }

                // Set assertions
                (flowUpdateRes.body._id).should.equal(flowSaveRes.body._id);
                (flowUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Flows if not signed in', function (done) {
    // Create new Flow model instance
    var flowObj = new Flow(flow);

    // Save the flow
    flowObj.save(function () {
      // Request Flows
      request(app).get('/api/flows')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Flow if not signed in', function (done) {
    // Create new Flow model instance
    var flowObj = new Flow(flow);

    // Save the Flow
    flowObj.save(function () {
      request(app).get('/api/flows/' + flowObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', flow.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Flow with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/flows/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Flow is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Flow which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Flow
    request(app).get('/api/flows/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Flow with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Flow if signed in', function (done) {
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

        // Save a new Flow
        agent.post('/api/flows')
          .send(flow)
          .expect(200)
          .end(function (flowSaveErr, flowSaveRes) {
            // Handle Flow save error
            if (flowSaveErr) {
              return done(flowSaveErr);
            }

            // Delete an existing Flow
            agent.delete('/api/flows/' + flowSaveRes.body._id)
              .send(flow)
              .expect(200)
              .end(function (flowDeleteErr, flowDeleteRes) {
                // Handle flow error error
                if (flowDeleteErr) {
                  return done(flowDeleteErr);
                }

                // Set assertions
                (flowDeleteRes.body._id).should.equal(flowSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Flow if not signed in', function (done) {
    // Set Flow user
    flow.user = user;

    // Create new Flow model instance
    var flowObj = new Flow(flow);

    // Save the Flow
    flowObj.save(function () {
      // Try deleting Flow
      request(app).delete('/api/flows/' + flowObj._id)
        .expect(403)
        .end(function (flowDeleteErr, flowDeleteRes) {
          // Set message assertion
          (flowDeleteRes.body.message).should.match('User is not authorized');

          // Handle Flow error error
          done(flowDeleteErr);
        });

    });
  });

  it('should be able to get a single Flow that has an orphaned user reference', function (done) {
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

          // Save a new Flow
          agent.post('/api/flows')
            .send(flow)
            .expect(200)
            .end(function (flowSaveErr, flowSaveRes) {
              // Handle Flow save error
              if (flowSaveErr) {
                return done(flowSaveErr);
              }

              // Set assertions on new Flow
              (flowSaveRes.body.name).should.equal(flow.name);
              should.exist(flowSaveRes.body.user);
              should.equal(flowSaveRes.body.user._id, orphanId);

              // force the Flow to have an orphaned user reference
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

                    // Get the Flow
                    agent.get('/api/flows/' + flowSaveRes.body._id)
                      .expect(200)
                      .end(function (flowInfoErr, flowInfoRes) {
                        // Handle Flow error
                        if (flowInfoErr) {
                          return done(flowInfoErr);
                        }

                        // Set assertions
                        (flowInfoRes.body._id).should.equal(flowSaveRes.body._id);
                        (flowInfoRes.body.name).should.equal(flow.name);
                        should.equal(flowInfoRes.body.user, undefined);

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
      Flow.remove().exec(done);
    });
  });
});
