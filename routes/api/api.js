const express = require("express");
const router = express.Router();
const passport = require("passport");

/**
 * Routing for api Pages
 */
const ApiController = require("../../controllers/ApiController");
const controller = new ApiController();

router.get("/restaurants", (req, res) =>
  controller.getAllRestaurants(req, res)
);

router.post("/getFavorites/:id_user", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(401);
    }
    if (!user) {
      return res.send({
        message: "not connected",
        user: user
      });
    }
    controller.getFavorites(req, res);
  })(req, res, next);
});

router.post("/recordfavorites/:id_restaurant", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(401);
    }
    if (!user) {
      return res.send({
        message: "not connected",
        user: user
      });
    }
    controller.recordFavorite(req, res);
  })(req, res, next);
});

router.post("/removefavorites/:id_restaurant", (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return res.status(401);
    }
    if (!user) {
      return res.send({
        message: "not connected",
        user: user
      });
    }
    controller.removeFavorite(req, res);
  })(req, res, next);
});

module.exports = router;
