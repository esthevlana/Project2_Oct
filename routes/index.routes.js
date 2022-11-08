const express = require('express');
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const Event = require('../models/Event.model');
const User = require('../models/User.model');
const Comment = require('../models/Comment.model');

/* GET home page */

router.get('/start', (req, res, next) => res.render('start'));

router.get('/', async (req, res, next) => {
    try {
        const events = await Event.find();
        res.render('index', { events });
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
    req.query
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

        console.log(event);
        res.render('events/event-details', event);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/event-create', (req, res, next) => res.render('events/event-create'));
router.post("/event-create", fileUploader.single('imageUrl'), async (req, res, next) => {
    try {

        let imageUrl;

        if (req.file) {
            imageUrl = req.file.path;
        }

/*       const creator = req.session.currentUser._id;
 */      const { title, description, date, hour, price, city } = req.body;
        console.log(req.body);

        const createdEvent = await Event.create({ title, description, date, hour, price, city, imageUrl });

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
    const { title, description, date, hour, price, city, imageUrl } = req.body

    try {

        let imageUrl;

        if (req.file) {
            imageUrl = req.file.path;
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, { title, description, date, hour, price, city, imageUrl });

        res.redirect(`/event-details/${updatedEvent._id}`);

    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.post("/event-delete/:id", async (req, res, next) => {
    try {

        const { id } = req.params;
        await Event.findByIdAndRemove(id)
        res.redirect("/");

    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.post('/comments/create/:id', async (req, res, next) => {
    const { id } = req.params;
    const { comments, author } = req.body;
    try {
        const newComment = await Comment.create({ comments, author });
        const commentUpdate = await Event.findByIdAndUpdate(id, { $push: { comment: newComment._id } })
        const userUpdate = await User.findByIdAndUpdate(author, { $push: { createdComments: newComment._id } });

        res.redirect(`/event-details/${id}`);
    } catch (error) {
        console.log(error);
        next(error);
    }
})



module.exports = router;
