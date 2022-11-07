const express = require('express');
const router = express.Router();

/* GET home page */
router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find();
    res.render('index', {events});
    console.log(events);   
 
}   catch (error) {
console.log(error);
next(error);
}
})
/* router.get('/', (req, res, next) => {
  res.render('index');
}); */

router.get('/search', async (req, res, next) => {
  req.query 
})



module.exports = router;
