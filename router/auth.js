const express = require("express");
const router = express.Router();
const app = express();
app.use(express.json());
const bcrypt = require("bcrypt");
const {Doctor , Gallery , Review ,Ticker }  = require("../schema/userschema");
const multer = require("multer");
router.get("/doctors", (req, res) => {
    try {
        Doctor.find({}, (err, doctors) => {
            if (err) {
                throw err;
            }
            res.send(doctors);
        });
    } catch (err) {
        console.log(err);
    } 
});
router.post("/ticker", (req, res) => {
    try {
        const { ticker, link , newicon } = req.body;
        if (!ticker ) {
            res.status(400).json({ msg: "Please fill all the fields backend" });
        }
        const data = new Ticker({
            ticker,
            link,
            newicon
        });
        data.save();
        res.status(201).json({ msg: "Ticker created successfully" });
    } catch (error) {
        console.log(error);
    }
});
router.get("/getticker", (req, res) => {
    try {
        Ticker.find({}, (err, ticker) => {
            if (err) {
                throw err;
            }
            res.send(ticker);
        });
    } catch (err) {
        console.log(err);
    }
});

router.get("/signup", (req, res) => {
  res.send("hello world from signup");
});

router.post("/register", async (req, res) => {
  const { name, email, password, cpassword } = req.body;
  if (!name || !email || !password || !cpassword) {
    res.status(400).json({ msg: "Please fill all the fields" });
  }
  try {
    const userexist = await Doctor.findOne({ email: email });
    if (userexist) {
      return res.status(400).json({ msg: "User already exists" });
    } else if (password !== cpassword) {
      return res.status(400).json({ msg: "Password does not match" });
    } else {
      const newUser = new Doctor({
             name: name,
             email: email,
              password: password,
              cpassword: cpassword,
      });
      await newUser.save();
      res.status(201).json({ msg: "User created successfully" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post('/login',async (req, res) => {
  try {
const{ username,email,password}= req.body;
if ( !username ||!email || !password) {
    return res
      .status(422)
      .json({ error: "make sure all fields are filled up " });
  }
      //here User is from user schema 
    const userlogin= await Doctor.findOne({ email: email,name:username });
    // console.log(req.body);
        //password is from the user and userlogin.password() is from database     
    if(userlogin){
        const isMatch = await bcrypt.compare(password, userlogin.password)
        if(!isMatch) {
        res.status(400).json({ error: "invalid credentials in ismatch" });
    }else{
         res.status(201).json({ success: "user login  successfully " });
    }
    }else{
        res.status(400).json({ error: "invalid credentials" });
    }
  } catch (error) {
    console.log(error);
  }
})
const storage = multer.diskStorage({  
  destination: function (req, file, cb) {
    cb(null, 'public/images');
  },
  filename: function (req, file, cb) { 
    cb(null,  Date.now()+file.originalname);
  }
})
const upload = multer({ storage  })

router.post('/addphoto',upload.single('Name') ,async (req, res) => {
  let photo = (req.file) ? req.file.filename : null;
  const { title, caption} = req.body;
  if ( !title || !caption ) {
    res.status(400).json({ msg: "Please fill all the fields" });
  }
  try {
    const data = new Gallery({
      photo,
      title,
      caption,
    });
    console.log(data);
    const res = await data.save();
    res.json({ success: "image uploaded successfully" });

  } catch (error) {
    console.log(error);
  }
});
router.post('/addreview' ,async (req, res) => {
  const { occupation, review, name, rating} = req.body;
  console.log(req.body);
  if ( !occupation || !review || !name || !rating ){
    res.status(400).json({ msg: "Please fill all the fields" });
  }
  try {
    const data = new Review({
      occupation,
      review,
      name,
      rating
    });
    const res = await data.save();
    res.json({ success: "image uploaded successfully" });

  } catch (error) {
    console.log(error);
  }
});
router.get('/getreviews' ,async (req, res) => {
  try {
    Review.find({}, (err, review) => {
        if (err) {
            throw err;
        }
        res.send(review);
    });
} catch (err) {
    console.log(err);
}
})
router.get('/gallery',async (req, res) => {
  try {
    const gallery = await Gallery.find();
    res.status(201).json({ gallery: gallery });
  } catch (error) {
    console.log(error);
  }
})




module.exports = router;