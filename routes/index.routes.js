const express = require('express');
const router = express.Router();
const fileUploader = require('../config/cloudinary.config');
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");
const Event = require('../models/Event.model');
const User = require('../models/User.model');
const Comment = require('../models/Comment.model');

/* GET home page */

router.get('/start', (req, res, next) => res.render('start', { layout: false }));

router.get('/', async (req, res, next) => {
    try {
        const events = await Event.find();
        const twoEvents = await Event.find().limit(2)
        res.render('index', { events, twoEvents });
        console.log(events);

        if(isLoggedIn === true) {
            res.render('index')
        } else {
            res.render('start')
        }

    } catch (error) {
        console.log(error);
        next(error);
    }
})

router.get('/search', async (req, res, next) => {
    try {
        const { title } = req.query;
        const foundEvents = await Event.find({ title: { $regex: new RegExp(title, "i") } })
        console.log(foundEvents)
        res.render('searchResult', { foundEvents });
    } catch (error) {
        console.log(error)
    }

})

router.get('/search-category/:category', async (req, res, next) => {
    try {
        const category = req.params.category

        if (category == 'outdoor'){
            const foundEvents = await Event.find({ 'category': 'Outdoor Events' })
            res.render('searchResult', { foundEvents });
        } else if (category == 'party'){
            const foundEvents = await Event.find({ 'category': 'Party and Music' })
            res.render('searchResult', { foundEvents });
        }else if (category == 'speech'){
            const foundEvents = await Event.find({ 'category': 'Speeches and Networking' })
            res.render('searchResult', { foundEvents });
        }else if (category == 'cultural'){
            const foundEvents = await Event.find({ 'category': 'Cultural Events' })
            res.render('searchResult', { foundEvents });
        }

    } catch (error) {
        console.log(error)
    }

})

router.get('/search-city', async (req, res, next) => {
    try {
        const { city } = req.query;
        const foundEvents = await Event.find({ city: { $regex: new RegExp(city, "i") } })
        console.log(foundEvents)
        res.render('searchResult', { foundEvents });
    } catch (error) {
        console.log(error)
    }

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
    
        res.render('events/event-details', event);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/event-create', (req, res, next) => res.render('events/event-create'));
router.post('/event-create', fileUploader.single('imageUrl'), async (req, res, next) => {
    try {

        let imageUrl;

        if (req.file) {
            imageUrl = req.file.path;
        }

/*       const creator = req.session.currentUser._id;
 */     const { title, description, category, date, hour, price, city} = req.body;
        console.log(req.body);
        const creator = req.session.currentUser._id;

        const createdEvent = await Event.create({ creator, title, description, category, date, hour, price, city, imageUrl });


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

router.post("/event-edit/:id", isLoggedIn, fileUploader.single('imageUrl'), async (req, res, next) => {

    const { id } = req.params
    const { title, description, category, date, hour, price, city, currentImage } = req.body
    const creator = req.session.currentUser._id;

    try {

        let imageUrl;

        if (req.file) {
            imageUrl = req.file.path;
        } else {
            imageUrl = currentImage;
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, { title, description, category, date, hour, price, city, imageUrl });

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
            await Event.findByIdAndDelete(id)
            res.redirect("/");
        } else {
            res.redirect(`/event-details/${id}`);
        }


    } catch (error) {
        console.log(error)
        next(error)
    }
})

router.get('/event-confirm/:id', isLoggedIn, async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.session.currentUser._id

        await User.findByIdAndUpdate(userId, { $push: { confirmedEvents: id } })
        await Event.findByIdAndUpdate(id, { $push: { confirmed: userId } })

        res.redirect('/auth/profile')
    } catch (error) {
        console.log(error)
    }
})

router.get('/favourite-event/:id', isLoggedIn, async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.session.currentUser._id

        await User.findByIdAndUpdate(userId, { $push: { favouriteEvents: id } })
        await Event.findByIdAndUpdate(id, { $push: { allFavourites: userId } })

        res.redirect('/auth/profile')
    } catch (error) {
        console.log(error)
    }
})

router.post('/comments/create/:id', isLoggedIn, fileUploader.single('imageUser'), async (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;
    const author = req.session.currentUser._id;
    try {
        const newComment = await Comment.create({ content, author });
        const commentUpdate = await Event.findByIdAndUpdate(id, { $push: { comments: newComment._id } })
        const userUpdate = await User.findByIdAndUpdate(author, { $push: { createdComments: newComment._id } });
        console.log(profilePicture)

        res.redirect(`/event-details/${id}`);
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.post("/comment-delete/:id/:eventId", async (req, res, next) => {
    try {
        const { id, eventId } = req.params;
        const loggedUser = req.session.currentUser._id;
        const commentToDelete = await Comment.findById(id)


        if (loggedUser == commentToDelete.author) {
            await Comment.findByIdAndDelete(id)

            res.redirect(`/event-details/${eventId}`);
        } else {
            res.redirect('/');
        }

    } catch (error) {
        console.log(error)
        next(error)
    }
})


module.exports = router;
