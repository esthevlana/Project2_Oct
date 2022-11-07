const express = require('express');
const router = express.Router();
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const Event = require('../models/Event.model');

/* GET home page */

router.get('/start', (req, res, next) => res.render ('start'));

router.get('/', isLoggedIn, async (req, res, next) => {
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

router.get('/event-details/:id', async (req, res, next) => {
  try {
      const {id} = req.params;

      const users = await User.find();

      const event = await Event.findById(id)
      .populate('reviews author')
      .populate({
          path : "reviews",
          populate: {
              path: "author",
              model: "User",
          },
      })

      console.log(event);
      res.render('events/event-details', {event, users});
  } catch (error){
      console.log(error);
      next(error);
  }
  });

router.get('/event-create', (req, res, next) => res.render ('events/event-create'));
router.post("/event-create", async (req, res, next) => {
    try {
    const {title, description, city, imageUrl} = req.body;
    
    const createdEvent = await Event.create({title, description, city, imageUrl});

    res.redirect(`/event-details/${createdEvent._id}`);
} catch (error) {
    console.log(error);
    next(error);
}
})

router.get('/event-edit/:id', async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);
        res.render('drones/update-form.hbs', book);
    } catch (error){
        console.log(error);
        next(error);
    }
    })

router.post("/book-edit/:id", async (req, res, next) => {
        try {
            const {id} = req.params /*redirect to the url*/
            const {title, author, description, rating} = req.body /*reserved to the inputs, used with post method*/

            const updatedBook = await Book.findByIdAndUpdate(id, {title, author, description, rating});

            res.redirect(`/book-details/${updatedBook._id}`);

        } catch (error) {
            console.log(error)
            next(error)
        }
    })

    //delete action just needs a button to delete and the formal action

    router.post("/book-delete/:id", async (req, res, next) => {
        try {

            const {id} = req.params;
            await Book.findByIdAndRemove(id)
            res.redirect("/book-list"); //redireciona para a pagina principal com a lista dos livros

        } catch(error) {
            console.log(error)
            next(error)
        }
    } )



module.exports = router;
