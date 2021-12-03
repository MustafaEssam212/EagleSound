<Slider {...settings}>
        
<div className='Sound'>
    <Link className='MainSoundA'>
        <i className="fas fa-play" id='PlayIcon'></i>
        <img src={Amr}></img>
        <Link id='SongName'>عمرو دياب - تملي معاك | Amr Diab - tamly m3ak</Link>
        <Link id='Artist'>Amr Diab</Link>
    </Link>
</div>

<div className='Sound'>
    <Link className='MainSoundA'>
     <i className="fas fa-play" id='PlayIcon'></i>
        <img src={Asala}></img>
        <Link id='SongName'>أصالة - قد الحروف | Asala - 2d Al Hrof</Link>
        <Link id='Artist'>Asala</Link>
    </Link>
</div><div className='Sound'>
    <Link className='MainSoundA'>
        <i className="fas fa-play" id='PlayIcon'></i>
        <img src={Amr}></img>
        <Link id='SongName'>عمرو دياب - تملي معاك | Amr Diab - tamly m3ak</Link>
        <Link id='Artist'>Amr Diab</Link>
    </Link>
</div>

<div className='Sound'>
    <Link className='MainSoundA'>
     <i className="fas fa-play" id='PlayIcon'></i>
        <img src={Asala}></img>
        <Link id='SongName'>أصالة - قد الحروف | Asala - 2d Al Hrof</Link>
        <Link id='Artist'>Asala</Link>
    </Link>
</div><div className='Sound'>
    <Link className='MainSoundA'>
        <i className="fas fa-play" id='PlayIcon'></i>
        <img src={Amr}></img>
        <Link id='SongName'>عمرو دياب - تملي معاك | Amr Diab - tamly m3ak</Link>
        <Link id='Artist'>Amr Diab</Link>
    </Link>
</div>

<div className='Sound'>
    <Link className='MainSoundA'>
     <i className="fas fa-play" id='PlayIcon'></i>
        <img src={Asala}></img>
        <Link id='SongName'>أصالة - قد الحروف | Asala - 2d Al Hrof</Link>
        <Link id='Artist'>Asala</Link>
    </Link>
</div>
<div className='Sound'>
    <Link className='MainSoundA'>
     <i className="fas fa-play" id='PlayIcon'></i>
        <img src={Asala}></img>
        <Link id='SongName'>أصالة - قد الحروف | Asala - 2d Al Hrof</Link>
        <Link id='Artist'>Asala</Link>
    </Link>
</div>

</Slider>



.Slid button:nth-child(1){
    margin-left: 40px;
    z-index: 2;
    margin-top: -25px;
    }
    
    .Slid button::before{
    color: #555555;
    font-size: 35px;
    }
    
    
    .Slid{
        padding: 10px 35px;
        position: relative;
      
    }
    
    .Slid div{
        margin: 0px 5px;
    }
    
    
    .Slid button:nth-child(3){
        margin-right: 55px;
        margin-top: -25px;
    }
    

    
    const [settings, setSettings] = useState({
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        variableWidth: true,
         responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            
          }
        },
        {
          breakpoint: 430,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            
          }
        }
      ],
        className: 'Slid',
    })
    

    <div ref={WaveSuferRef}>
    </div>



axios.post(`${process.env.REACT_APP_API}v1/getusertracks`, {email})
        .then(res => console.log(res.data))


        User.updateOne({email: userEmail}, {$push: {"tracks.$.likes": {userEmail}} }, (err, result)=>{
        
        })



        {
            Data.UsersResults.map((e)=>{
                return <div className="UserDiv">

                <Link to={`/Profile/${e._id}`}><img src={e.avatar === null ? ProfilePic : `../Data/Profiles/${e.avatar}`}></img></Link>

                <div className="UserDivDet">
                    <Link to={`/Profile/${e._id}`}>UserNameHere</Link>
                    <div>
                        <p><i className="fas fa-user-plus"></i> {e.followers.length}</p>
                        <p><i className="fas fa-music"></i> {e.tracks.length}</p>
                    </div>
                </div>

            </div>
            })
        }