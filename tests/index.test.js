console.log("staring restaurantServer.test.js");

const expect = require("expect");
const request = require("supertest");
const { ObjectID } = require("mongodb");

// "app" is always the first priority.
const { app } = require("../index");
const { Guests } = require("../models/guests");

const guestSample = [
  {
    _id: new ObjectID(),
    title: "move foreard",
    email: "jsooon@exaple.com",
    comments: "I love my house and my family",
    password: "password",
    like: true
  },

  {
    _id: new ObjectID(),
    title: "move backward",
    email: "awb@yahoo.com",
    comments: "I hate a rude person",
    password: "notpassword",
    dislike: true
  }
];

beforeEach(done => {
  Guests.remove({})
    .then(done => {
      const guestOne = new Guests(guestSample[0]).save();
      const guestTwo = new Guests(guestSample[1]).save();

      return Promise.all([guestOne, guestTwo]);
    })
    .then(() => done());
});

describe("POST /guests", () => {
  it("it should have same email, title, comments, password", done => {
    const title = "jump up to the future";
    const comments = "I love eating so much";
    const email = "dman@aceexam.io";
    const password = "passwordisnotpassword";

    request(app)
      .post("/guests")
      .send({ title, comments, email, password })
      .expect(200)
      .expect(res => {
        // "res" is a sending data to the user
        //      by receiving and assigning "req.body"  to res.body
        expect(res.body.title).toBe(title);
      })
      .end((err, res) => {
        if (err) return done(err);

        // console.log("data sent from the server to the user: ", res.body);
        // findById => an document, not collection which is an array.
        Guests.findById(res.body._id)
          .then(guest => {
            expect(guest.title).toBe(title);
            expect(typeof guest.visitedAt).toBe("object");
            done();
          })
          .catch(err => done(err));
      });
  });
});

describe("GET /guests", () => {
  it("it should have two documents containing title, comments, email, password", done => {
    request(app)
      .get("/guests")
      .expect(200)
      .expect(res => {
        expect(res.body.list.length).toBe(2);
      })
      .end((err, res) => {
        if (err) return done(err);

        Guests.find({})
          .then(list => {
            expect(list[0].title).toBe(guestSample[0].title);
            expect(list[1].visitedAt).toBe(null);
            done();
          })
          .catch(err => done(err));
      });
  });
});

describe("GET guests/:id", () => {
  it("it should have same _ids, comments, email, and title of guestSample", done => {
    request(app)
      .get(`/guests/${guestSample[0]._id.toHexString()}`)
      .expect(200)
      .expect(res => {
        expect(res.body.post.email).toBe(guestSample[0].email);
      })
      .end(done);
  });

  it("ID should be differnt from a new id given here.", done => {
    const id = new ObjectID().toHexString();

    request(app)
      .get(`/guests/${id}`)
      .expect(404)
      .end(done);
  });
});

describe("DELETE /guests/:id", () => {
  it("it should have a single document", done => {
    const id = guestSample[1]._id.toHexString();

    request(app)
      .delete(`/guests/${id}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        Guests.findById(id)
          .then(res => {
            expect(res).toBeFalsy();
            done();
          })
          .catch(err => done(err));
      });
  });
});

describe("PATCH /guests/:id", () => {
  it("it should have a new value of visitedAt and true of like or dislike", done => {
    const id = guestSample[1]._id.toHexString();
    const timeStamp = guestSample[1]._id.getTimestamp();

    const title = "Lets finish the test";
    const comments = "I am very excited to start to production environment";
    const email = "changuenLee@example.com";
    const password = "password";
    const dislike = true;

    request(app)
      .patch(`/guests/${id}`)
      .expect(200)
      .send({ title, comments, email, password, dislike })
      .expect(res => {
        expect(res.body.updated.visitedAt).toBeTruthy();
        expect(res.body.updated.visitedAt).not.toBe(timeStamp);
      })
      .end((err, res) => {
        if (err) return done(err);

        Guests.findById(id)
          .then(updated => {
            expect(updated.dislike).toBe(true);
            expect(typeof updated.visitedAt).toBe("object");

            done();
          })
          .catch(err => done(err));
      });
  });

  it("visitiedAt should be same", done => {
    const id = guestSample[0]._id.toHexString();
    const title = "Lets go home";
    const comments = "I am very excited to combine production environment";
    const email = "chanee@aceexam.io";
    const password = "isnotdfapassword";
    const like = false;

    request(app)
      .patch(`/guests/${id}`)
      .expect(200)
      .send({ title, comments, email, password, like })
      .expect(res => {
        expect(res.body.updated.visitedAt).toBeTruthy();
      })
      .end(done);
  });
});

describe("GET /guests/login", () => {
  it("it should have a document if email and password are identified ", done => {
    const email = guestSample[0].email;
    const password = guestSample[0].password;

    request(app)
      .post("/guests/login")
      .expect(200)
      .send({ email, password })
      .expect(res => {
        expect(res.body[0]).toMatchObject({
          email: guestSample[0].email,
          title: guestSample[0].title
        });
      })
      .end(done);
  });
});

describe("GET /loginGuestbooks", () => {
  it("it should have documents containing title, comments, email, password", done => {
    request(app)
      .get("/loginGuestbooks")
      .expect(200)
      .expect(res => {
        expect(res.body.guestbooks.length).toBe(1);
      })
      .end((err, res) => {
        if (err) return done(err);

        Guests.find({})
          .then(list => {
            expect(list[0].title).toBe(guestSample[0].title);
            expect(list[1].visitedAt).toBe(null);
            done();
          })
          .catch(err => done(err));
      });
  });
});
