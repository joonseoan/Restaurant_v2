const _ = require("lodash");

const { Guests } = require("../models/guests");
// const { GuestLogin } = require("../models/guestLogin");

const { ObjectID } = require("mongodb");
require("../db/mongoose");

module.exports = app => {
  app.post("/guests", (req, res) => {
    const body = _.pick(req.body, [
      "food",
      "like",
      "dislike",
      "title",
      "comments",
      "email",
      "password",
      "servDislike",
      "servComments",
      "telephone"
    ]);

    if (body.title && body.comments && body.email && body.password) {
      const date = new Date();
      const vancouverTime = new Date(date.getTime() - 10800000).valueOf();

      if (req.body.city !== "Vancouver") {
        // console.log("date.getTime: ", date.getTime());
        // body.visitedAt = `(Date: ${date.toDateString()}, Time: ${date.toLocaleTimeString()})`;

        // console.log(date.getTime(), date.getTime().valueOf());
        body.visitedAt = date.getTime();
      } else {
        //  body.visitedAt = `(Date: ${vancouverTime.toDateString()}, Time: ${vancouverTime.toLocaleTimeString()})`;
        body.visitedAt = vancouverTime;
      }

      body.city = req.body.city;
    }

    new Guests(body).save().then(
      result => {
        res.send(result);
      },
      err => {
        res.status(400).send(err);
      }
    );
  });

  app.get("/guests", (req, res) => {
    Guests.find({})
      .then(list => {
        res.send({ list });
      })
      .catch(err => res.status(400).send(err));
  });

  // app.get("/guests/:id", (req, res) => {
  //   const id = req.params.id;

  //   if (!ObjectID.isValid(id)) return res.status(404).send();

  //   Guests.findById(id)
  //     .then(post => {
  //       if (!post) return res.status(404).send();

  //       res.send({ post });
  //     })
  //     .catch(err => res.status(400).send("post_fail"));
  // });

  app.delete("/guests/:id", (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) return res.status(404).send();

    Guests.findByIdAndRemove(id)
      .then(post => {
        if (!post) return res.status(404).send();

        res.send({ post });
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });

  /* Try on this after 2nd project
      app.patch('/guests/:id', (req, res) => {

          const id = req.params.id;

          const body = _.pick(req.body, [ 'food', 'like', 'dislike', 'title', 'comments', 'email', 'password',
                  'servDislike', 'servComments', 'telephone' ]);

          if(!ObjectID.isValid(id)) return res.status(404).send();

          if( body.title && body.comments && body.password && body.email) {

              // I gotta change it for Vancouver.
              const estTime = new Date();

              body.visitedAt = estTime.setHours(estTime.getHours() + estTime.getTimezoneOffset()/60 - 8);

          }

          // For patch to be validated, put "runValidators : true"
          Guests.findOneAndUpdate( { _id : id }, { $set : body }, { new: true }).then (updated => {

                  if(!updated) return res.status(404).send();

                  res.send({ updated });

          }).catch(err => res.status(400).send());

      });

      */

  app.post("/guests/login", async (req, res) => {
    try {
      const body = _.pick(req.body, ["email", "password"]);
      const guest = await Guests.findByCredentials(body.email, body.password);

      res.send(guest);
    } catch (e) {
      res.status(400).send();
    }
  });
};
