const express = require('express');
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const Event = require('../models/Event.model');
const User = require('../models/User.model');
const Comment = require('../models/Comment.model');

/* GET home page */

router.post("/comment-delete/:id/:eventId", async (req, res, next) => {
    try {
        const { id, eventId } = req.params;
        const loggedUser = req.session.currentUser._id;
        const commentToDelete = await Comment.findById(id)

        
        if(loggedUser == commentToDelete.author){
            await Comment.findByIdAndDelete(id)
            
            res.redirect(`/event-details/${eventId}`);
        } else {
            res.redirect(`/`);
        }

    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.get('/start', (req, res, next) => res.render('start'));

router.get('/', async (req, res, next) => {
    try {
        const events = await Event.find();
        const twoEvents = await Event.find().limit(2)
        res.render('index', { events, twoEvents });
        console.log(events);

    } catch (error) {
        console.log(error);
        next(error);
    }
})
/* router.get('/', (req, res, next) => {
  res.render('index');
}); */

router.get('/search', async (req, res, next) => {
    try {
        const { title } = req.query;
        const foundEvents = await Event.find({ title: { $regex: new RegExp(title, "i") } })
        console.log(foundEvents)
        res.render('searchResult', { foundEvents });
    } catch (error) {
        console.log(error)
    }
    /* const currentUser = req.session.user
      const { title } = req.query;
    
      Event.find({
        
           title: title 
        
      })
      .then((results) => {
        console.log(results)
        res.render('searchResult', {results, currentUser})
      })
    .catch(err => next(err)) */


})

router.get('/event-details/:id', async (req, res, next) => {
    try {

        const { id } = req.params;

        const event = await Event.findById(id)
            .populate('comments')
            .populate({
                path: "comments",
                populate: {
                    path: "author",
                    model: "User",
                },
            })
            .populate('creator')

        console.log(event);
        res.render('events/event-details', event);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

/* router.get('/event-details/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id)
            .populate('description')
            .populate({
                path: "description",
                populate: {
                    path: "creator",
                    model: "User",
                },
            })

        console.log(event);
        res.render('events/event-details', event);
    } catch (error) {
        console.log(error);
        next(error);
    }
});
 */

router.get('/event-create', (req, res, next) => res.render('events/event-create'));
router.post("/event-create", fileUploader.single('imageUrl'), async (req, res, next) => {
    try {

        let imageUrl;

        if (req.file) {
            imageUrl = req.file.path;
        }

/*       const creator = req.session.currentUser._id;
 */     const { title, description, date, hour, price, city } = req.body;
        console.log(req.body);
        const creator = req.session.currentUser._id;

        const createdEvent = await Event.create({ creator, title, description, date, hour, price, city, imageUrl });


        res.redirect(`/event-details/${createdEvent._id}`);
    } catch (error) {
        console.log(error);
        next(error);
    }
})

router.get('/event-edit/:id', async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        res.render('events/event-edit', event);
    } catch (error) {
        console.log(error);
        next(error);
    }
})

router.post("/event-edit/:id", fileUploader.single('imageUrl'), async (req, res, next) => {

    const { id } = req.params
    const { title, description, date, hour, price, city, currentImage } = req.body
    const creator = req.session.currentUser._id;

    try {

        let imageUrl;

        if (req.file) {
            imageUrl = req.file.path;
        } else {
            imageUrl = currentImage;
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, { title, description, date, hour, price, city, imageUrl });

        res.redirect(`/event-details/${updatedEvent._id}`);

    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.get("/event-delete/:id", async (req, res, next) => {
    try {

        const { id } = req.params;
        const loggedUser = req.session.currentUser._id;
        const eventToDelete = await Event.findById(id)

        if (loggedUser == eventToDelete.creator) {
            await Event.findByIdAndRemove(id)
            res.redirect("/");
        } else {
            res.redirect(`/event-details/${id}`);
        }


    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.post('/comments/create/:id', async (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;
    const author = req.session.currentUser._id;
    try {
        const newComment = await Comment.create({ content, author });
        const commentUpdate = await Event.findByIdAndUpdate(id, { $push: { comments: newComment._id } })
        const userUpdate = await User.findByIdAndUpdate(author, { $push: { createdComments: newComment._id } });

        res.redirect(`/event-details/${id}`);
    } catch (error) {
        console.log(error);
        next(error);
    }
});


/* 
        if (loggedUser == commentToDelete.author) {
            await Comment.findByIdAndDelete(id)
            res.redirect("/");
        } else {
            res.redirect(`/event-details/${eventId}`);
        }


    } catch (error) {
        console.log(error)
        next(error)
    }
}) */


module.exports = router;
