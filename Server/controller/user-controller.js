const User = require('../model/user-model')
const userController = {};
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

userController.Register = (req, res, next) =>{

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const ArrError = errors.array();
       return  res.send(ArrError) 

   }

  
   const user = new User({
       email: req.body.info.email,
       username: req.body.info.username.charAt(0).toUpperCase() + req.body.info.username.slice(1),    
       password: req.body.info.password
   })

    User.findOne({email: user.email}, (err, result)=>{
        if(result){
            res.send({
                message: 'This email already exist'
            })
            return;
        }else{
            user.save();
            res.send({
                message: "Register successful"
            })
        }
    })

}


userController.Login = async (req, res, next) =>{
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const ArrError = errors.array();
       return  res.send(ArrError) 

   }

   const inf = {
       email: req.body.info.email,
       password: req.body.info.password
   }


        try{
            const user = await User.findOne({email: inf.email});
            
            if(!user){
                res.send({
                    message:  `The Email is not in our records`
                })
            }else{
                user.isPasswordMatch(inf.password, user.password, (err, success)=>{
                    if(success){
                        const secret = process.env.JWT_SECRET;
                        const expire = process.env.JWT_EXPIRATION;
                        
                        const token = jwt.sign({_id: user._id}, secret, {expiresIn: expire});
                        return  res.send({token, user}) 
                    }
                    res.send({
                        message : `Invaild email or password`
                    })
            });
            }
                
        
        }catch(e){
            next(e)
        }
  
}


userController.UploadProfile = (req, res, next) =>{
    
    const Image = req.file.filename;
    const userEmail = req.body.email;

    User.updateOne({email: userEmail}, {$set: {avatar: Image}}, (err, result)=>{
        if(result){
            res.send({
                message: 'Profile picture changed successfully'
            })
        }else{
            res.send({
                message: 'Error while changing your profile picture'
            })
        }
    })
    
}


userController.UploadTrack = (req, res, next) => {
    
    const userEmail = req.body.email;

    var mongoObjectId = function () {
        var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
        return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function() {
            return (Math.random() * 16 | 0).toString(16);
        }).toLowerCase();
    };

    const track = {
        trackSong: req.files.track[0].filename,
        thumbnail: req.files.thumbnail ? req.files.thumbnail[0].filename : null,
        tags: JSON.parse(req.body.tags),
        trackName: req.body.songname ? req.body.songname : req.files.track[0].filename,
        comments: [],
        likes: [],
        id : mongoObjectId(),
        author: userEmail,
    }
    
    
    User.updateOne({email: userEmail}, {$push: {tracks: track}}, (err, result)=>{
        if(result){
            res.send({
                message: 'Track uploaded successfully'
            })
        }else{
            res.send({
                message: 'Error while uploading'
            })
        }
    })
}


userController.GetUserTracks = (req, res, next) => {
    const userEmail = req.body.email;
    
    User.findOne({email: userEmail}, {_id: false, tracks: true}, (err, result)=>{
        if(result){
            const Arr = result.tracks.reverse();
            res.send(Arr)
        }else{
            res.send({
                message: 'Failed to get data'
            })
        }
    })
}


userController.CheckLikes = (req, res, next) => {
    const Email = req.body.email;
    User.findOne({email: Email}, {_id: false, likes: true}, (err, result)=>{
        if(result){
            res.send(result.likes)
        }else{
            console.log(err)
        }
    })
}


userController.LikeTrack = (req, res, next) => {
    const userEmail = req.body.email;
    const TrackId = req.body.TrackId;
    
    User.findOne({email: userEmail}, {tracks: true}, (err, result)=>{
        if(result){
          
            
            const Tracks = result.tracks;
            Tracks.map((e)=>{
                 if(e.id === TrackId){
                    const TrackLikes = e.likes;
                    const TrackName = e.trackName;
                    var Check = false;

                    TrackLikes.map((element)=>{
                        if(element === userEmail){
                         return Check = true;        
                        }else{
                          return  Check = false
                        }
                    })
                    
                    if(Check === true){
                        User.updateOne({email: userEmail, 'tracks.trackName': TrackName}, {$pull: {"tracks.$.likes": userEmail} }, (err, result)=>{
                            if(result){
                                User.updateOne({email: userEmail}, {$pull: {likes: TrackId}}, (err, result)=>{
                                    if(result){
                                        return res.send({
                                            message: 'unLiked'
                                        })
                                    }
                                })
                                
                            }else{
                                console.log(err)
                            }
                        })
                    }else{
                        User.updateOne({email: userEmail, 'tracks.trackName': TrackName}, {$push: {"tracks.$.likes": userEmail} }, (err, result)=>{
                            if(result){
                                User.updateOne({email: userEmail}, {$push: {likes: TrackId}}, (err, result)=>{
                                    if(result){
                                        return res.send({
                                            message: 'Liked'
                                        })
                                    }
                                })
                                
                            }else{
                                console.log(err)
                            }
                        })
                    }
                } 
            })
        }else{
            console.log(err)
        }
    })
    
}


userController.AlreadyLiked = (req, res, next) => {
    const userEmail = req.body.email;
    
    User.findOne({email: userEmail}, {_id: false, likes: true}, (err, result)=>{
        if(result){
            const Likes = result.likes;
            const AllTracks = []
            var RestTracks = []
            User.find({}, {_id: false, tracks: true}, (err, result)=>{
                if(result){
                                  
                    const promise1 = new Promise(function (resolve, reject){
                        
                        result.map((e)=>{
                            e.tracks.map((el)=>{
                                AllTracks.push(el)
                            })
                        })
                        resolve(AllTracks)
                        
                    })
                   promise1.then(response1 => {
                        
                            
                          
                            Likes.map((like)=>{
                                response1.map((respon)=>{
                                    if(respon.id === like){
                                        RestTracks.push(respon)
                                    }
                                })
                            })
                      
                            res.send(RestTracks)
                        
                   })
                }else{
                    console.log(err)
                }
            })
        }else{
            console.log(err)
        }
    })
}


userController.CommentTrack = (req, res, next) => {
   const CommentText = req.body.Comment;
   const userEmail = req.body.email;
   const Author = req.body.Author;
   const TrackId = req.body.TrackId;

   const CommentDetails = {
       User: userEmail,
       CommentText
   }

   User.updateOne({email: Author, 'tracks.id' : TrackId}, {$push: {"tracks.$.comments": CommentDetails}}, (err, result)=>{
       if(result){
           res.send({
               message: 'Comment Submitted'
           })
       }else{
           res.send({
               message: 'Faild to submit your comment'
           })
       }
   })

}


userController.GetComments = (req, res, next) => {
    const Author = req.body.Author;
    const TrackId = req.body.TrackId;
    
    User.findOne({email: Author}, {_id: false, tracks: true}, (err, result)=>{
        if(result){
            const UserTracks = result.tracks;
            
            const promise1 = new Promise(function(resolve, reject){
                UserTracks.map((e)=>{
                    if(e.id === TrackId){
                       return resolve(e)  
                    }   
                })
            })
            promise1.then(response1 => {

           
                var CommentsArr = [];
                response1.comments.map((element)=>{
                    
                    User.findOne({email: element.User}, {_id: false, username: true, avatar: true}, (err, result)=>{
                        if(result){
                            
                            CommentsArr.push({
                                username: result.username,
                                avatar: result.avatar,
                                Commentext: element.CommentText
                            }) 
                                        
                        }else{
                            console.log(err)
                        }
                    })
                })
                setTimeout(()=>{
                        res.send(CommentsArr.reverse())
                }, 1000)
            

         
                
            })
        }else{
            res.send(err)
        }
    })

}

userController.Search = (req, res, next) => {

    const Value = req.body.value.charAt(0).toUpperCase() + req.body.value.slice(1);
    const Track = req.body.value;
    var UsersResults = []
    var TracksResults = []
    User.find({username: {$regex : Value}}, (err, result)=>{
        if(result){
           UsersResults = result; 
        }else{
            console.log(err)
        }
    })

    User.find({}, {_id: false, tracks: true}, (err, result)=>{
        if(result){
            result.map((e)=>{
                e.tracks.map((element)=>{
                    
                    if(element.trackName.includes(Track)){
                        TracksResults.push(element)   
                    }
                })
            })
        }else{
            console.log(err)
        }
    })

    setTimeout(()=>{
        res.send({UsersResults, TracksResults})
    }, 3000)

}


userController.GetAnotherUser = (req, res, next) => {
    const UserId = req.body.id;
    
    User.findOne({_id: UserId}, (err, result)=>{
        if(result){
            res.send(result)
        }else{
            res.send(err)
        }
    })
}

userController.GetFollow = (req, res, next) => {
   const Id = req.body.id;
   User.findOne({_id: Id}, {_id: false, followers: true, following: true, tracks: true}, (err, result)=>{
       if(result){
           var tracks = result.tracks;
           var following = result.following;
           var followers = result.followers;
           res.send({following, followers, tracks})
       }else{
           console.log(err) 
       }
   })
}

userController.GetFollowers = (req, res, next) => {
    const Id = req.body.Id;
   
    var avatars = []

    User.findOne({_id: Id}, {_id: false, followers: true}, (err, result) =>{
        if(result){
           
            const Followers = result.followers;
            Followers.map((e)=>{
                User.findOne({_id: e}, {_id: false, avatar: true}, (err, result) => {
                    avatars.push(result)
                   
                })
            })

            setTimeout(()=>{
                if(avatars.length > 7){
                    avatars.slice(0, 7)
                    res.send(avatars)
                }else{
                    res.send(avatars)
                    
                }
            }, 3000)
        }else{
            console.log(err)
        }
    })

}

userController.Follow = (req, res, next) => {
   const userId = req.body.Id;
   const myId = req.body.myId;

   User.findOne({_id: userId}, {_id: false, followers: true}, (err, result) => {
       if(result){
           const followersOfuser = result.followers;
           if(followersOfuser.includes(myId)){
            User.updateOne({_id: userId}, {$pull: {followers: myId}}, (err, result)=>{
                if(result){
                    console.log('')
                }else{
                    console.log(err)
                }
            })

            User.updateOne({_id: myId}, {$pull: {following: userId}}, (err, result)=>{
             if(result){
                 console.log('')
             }else{
                 console.log(err)
             }
         })
            res.send('Done')
            
           }else{
               User.updateOne({_id: userId}, {$push: {followers: myId}}, (err, result)=>{
                   if(result){
                       console.log('')
                   }else{
                       console.log(err)
                   }
               })

               User.updateOne({_id: myId}, {$push: {following: userId}}, (err, result)=>{
                if(result){
                    console.log('')
                }else{
                    console.log(err)
                }
            })

            res.send('Done')
           }    
          
       }else{
           console.log(err)
       }
   })

   
}

userController.GetTrack = (req, res, next) => {
    const Id = req.body.Id;
    const Author = req.body.Author;
    

    User.findOne({email: Author}, {_id: false, tracks: true}, (err, result) => {
        if(result){
            const Tracks = result.tracks;
            Tracks.map((e)=>{
                if(e.id === Id){
                    return res.send(e)
                }
            })
        }else{
            console.log(err)
        }
    })
}


userController.GetPlayUser = (req, res, next) => {
    const user = req.body.Author;
    
    User.findOne({email: user}, (err, result)=>{
        if(result){
            res.send(result)
        }else{
            console.log(err)
        }
    })
}

userController.LikeSomeoneTrack = (req, res, next) => {
    const Author = req.body.Author;
    const MyEmail = req.body.email;
    const TrackId = req.body.TrackId;
    
    
    User.findOne({email: Author}, {tracks: true}, (err, result)=>{
        if(result){
          
            
            const Tracks = result.tracks;
            Tracks.map((e)=>{
                 if(e.id === TrackId){
                    const TrackLikes = e.likes;
                    var Check = false;

                    TrackLikes.map((element)=>{
                        if(element === MyEmail){
                         return Check = true;        
                        }else{
                          return  Check = false
                        }
                    })
                    
                    if(Check === true){
                        User.updateOne({email: Author, 'tracks.id': TrackId}, {$pull: {"tracks.$.likes": MyEmail} }, (err, result)=>{
                            if(result){
                                User.updateOne({email: MyEmail}, {$pull: {likes: TrackId}}, (err, result)=>{
                                    if(result){
                                        return res.send({
                                            message: 'UnLiked'
                                        })
                                    }
                                })
                                
                            }else{
                                console.log(err)
                            }
                        })
                    }else{
                        User.updateOne({email: Author, 'tracks.id': TrackId}, {$push: {"tracks.$.likes": MyEmail} }, (err, result)=>{
                            if(result){
                                User.updateOne({email: MyEmail}, {$push: {likes: TrackId}}, (err, result)=>{
                                    if(result){
                                        return res.send({
                                            message: 'Liked'
                                        })
                                    }
                                })
                                
                            }else{
                                console.log(err)
                            }
                        })
                    }
                } 
            })
        }else{
            console.log(err)
        }
    })
   
}


userController.ArtistsShouldFollow = (req, res, next) => {
    var Arr = []
    User.find({}, (err, result)=>{
        if(result){
            result.map((e)=>{
                if(e.followers.length >= 1){
                    Arr.push(e)
                }   
            })
        }else{
            console.log(err)
        }

        setTimeout(()=>{
            if(Arr.length > 3){
                Arr.slice(0 , 4);
                res.send(Arr)
            }else{
                res.send(Arr)
            }
        }, 3000)
    })
}


userController.MostLiked = (req, res, next) => {
    const Arr = [];

    User.find({}, {_id: false, tracks: true}, (err, result)=>{
        if(result){
            result.map((e)=>{
                e.tracks.map((element)=>{
                    if(element.likes.length >= 1){
                        Arr.push(element)
                    }
                })
            })
        }else{
            console.log(err)
        }

        setTimeout(()=>{
            if(Arr.length > 4){
                Arr.slice(0, 5);
                res.send(Arr)
            }else{
                res.send(Arr)
            }
        }, 3000)
    })
}



userController.FollowingUploads = (req, res, next) => {
    var Tracks = [];
    User.findOne({email : req.body.email}, {following: true, _id: false}, (err, result) =>{
        if(result){
            
            result.following.map((e)=>{
                User.findOne({_id: e}, {_id: false, tracks: true}, (err, result) => {
                    
                    result.tracks.map((element)=>{
                        Tracks.push(element)
                    })
                })
            })
        }else{
            console.log(err)
        }
    })
    setTimeout(()=>{
        if(Tracks.length > 4){
            Tracks.slice(0, 5);
            res.send(Tracks)
        }else{
            res.send(Tracks)
        }
    }, 3000)
}


userController.GetUserData = (req, res, next) =>{
    User.findOne({_id: req.body.Id}, (err, result)=>{
        if(result){
            res.send(result)
        }else{
            console.log(err)
        }
    })
}

module.exports = userController;