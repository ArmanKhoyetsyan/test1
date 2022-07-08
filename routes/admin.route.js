const express = require('express');

const router = express.Router();

router.post('/login', express.urlencoded({ extended: false }), (req, res) => {
  req.session.regenerate(() => {
    if (
      req.body.email === process.env.ADMIN_EMAIL && req.body.password === process.env.ADMIN_PASSWORD
    ) {
      req.session.user = req.body;
      req.session.save(() => {
        res.status(200).json({ msg: 'Welcome' });
      });
    } else {
      res.status(401).json({ msg: 'Unauthorized' });
    }
  });
});

router.get('/logout', (req, res, next) => {
  req.session.user = null;
  req.session.save((err) => {
    if (err) next(err);

    req.session.regenerate(() => {
      if (err) next(err);
      res.status(200).json({ msg: 'By' });
    });
  });
});

module.exports = router;
