const express = require('express')
const router = express();
const userController = require('../controller/user-controller')
const { body } = require('express-validator');
const multer = require('multer');


const ProfileStorage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, '../Client/public/Data/Profiles');
    },
    filename: (req, file, callback) =>{
        callback(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
})  

const ProfileUpload = multer({storage: ProfileStorage});



const SoundStorage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, '../Client/public/Data/Sounds');
    },
    filename: (req, file, callback) =>{
        callback(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
})  

const SoundUpload = multer({storage: SoundStorage});
const AllSoundUpload = SoundUpload.fields([{name: 'track', maxCount: 1}, {name: 'thumbnail', maxCount: 1}])

router.post('/register',

    
        [
            body('info.email', 'Please enter a valid email').not().isEmpty(),
            body('info.password', 'Password should be at least 8 characters').isLength({min: 8}),
            body('info.username', 'please enter a valid username').not().isEmpty(),
            body('info.username', 'Username should be at least 5 characters').isLength({min: 5})
        ]
    , userController.Register)


router.post('/login', 
        [
            body('info.email', 'Please enter a valid email').not().isEmpty(),
            body('info.password', 'please enter a valid password').not().isEmpty()
        ]
,userController.Login)
        

router.post('/uploadprofile', ProfileUpload.single('profile'), userController.UploadProfile)

router.post('/uploadtrack', AllSoundUpload, userController.UploadTrack)

router.post('/getusertracks', userController.GetUserTracks)

router.post('/liketrack', userController.LikeTrack)

router.post('/checklikes', userController.CheckLikes)

router.post('/alreadyliked', userController.AlreadyLiked)

router.post('/commenttrack', userController.CommentTrack)

router.post('/getcomments', userController.GetComments)

router.post('/search', userController.Search)

router.post('/getanotheruser', userController.GetAnotherUser)

router.post('/getfollow', userController.GetFollow)

router.post('/getfollowers', userController.GetFollowers)

router.post('/follow', userController.Follow)

router.post('/gettrack', userController.GetTrack)

router.post('/getplayuser', userController.GetPlayUser)

router.post('/likesomeonetrack', userController.LikeSomeoneTrack)

router.get('/artistsshouldfollow', userController.ArtistsShouldFollow)

router.get('/mostliked', userController.MostLiked)

router.post('/followinguploads', userController.FollowingUploads)

router.post('/getuserdata', userController.GetUserData)

module.exports = router;