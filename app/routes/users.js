const express = require('express');
const router = express.Router();
const userCtr = require('../controllers/userCtr');
/* GET users listing. */
router.post('/login', function (req, res) {
  if (req.session.currentUser) return res.json({ ok: true, data: req.session.currentUser });
  if (!req.body || !req.body.username || !req.body.password) return res.status(400).send('Error');
  userCtr.getByUsername({ data: req.body }, (err, result) => {
    if (err) return res.json({ ok: false, message: err + '' });
    if (!result.ok) return res.json(result);
    req.session.currentUser = result.data;
    res.json(result);
  });
});

router.post('/currentUser', function (req, res, next) {
  if (req.session.currentUser) res.json({ ok: true, data: req.session.currentUser });
  else res.json({ ok: false });
});

router.post('/logout', function (req, res, next) {
  req.session.destroy((err) => {
    res.json({ ok: true });
  })
});

// router.post('/new', (req, res) => {
//   if (req.session.currentUser) return res.sendStatus(400);
//   let newUser = req.body;
//   if (!newUser || !newUser.username || !newUser.password || !newUser.fullname) return res.sendStatus(400);
//   userCtr.new(newUser, (err, data) => {
//     if (err) return res.json({ ok: false, error: err + '' });
//     req.session.currentUser = data;
//     res.json({ ok: true, data });
//   })
// });

router.post('/getAll', (req, res) => {
  if (!req.session.currentUser || req.session.currentUser.username !== 'admin') return res.sendStatus(404);
  userCtr.getAll({ data: req.body }, (err, result) => {
    if (err) return res.json({ok: false, message: err+''});
    res.json(result);
  })
})

module.exports = router;
