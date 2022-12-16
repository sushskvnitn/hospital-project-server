const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const app = express();
app.use(express.json());
const bcrypt = require("bcrypt");
const {Doctor , Gallery , Review ,Ticker,Slot }  = require("../schema/userschema");

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
    return res.status(422).json({ error: "make sure all fields are filled up " });
  }
      //here User is from user schema 
    const userlogin= await Doctor.findOne({ email: email,name:username });
    if (!userlogin) {
      return res.status(400).json({ msg: "User does not exist" });
    }
        // password is from the user and userlogin.password() is from database     
    const isMatch = await bcrypt.compare(password, userlogin.password);
    const token = await userlogin.generateAuthToken();
    res.cookie("jwtoken", token, {
      expires: new Date(Date.now() + 7200000),
      httpOnly: true,
    });
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    res.status(201).json({ msg: "User login successfully" });
  } catch (error) {
    console.log(error);
  }
})
router.post('/addphoto' ,authenticate,async (req, res) => {
  const { title, caption,photo} = req.body;
  if ( !title || !caption || !photo ) {
    res.status(400).json({ msg: "Please fill all the fields" });
  }
  try {
    const data = new Gallery({
      photo,
      title,
      caption,
    });
    console.log(data);
     await data.save();
    res.json({ success: "image uploaded successfully" });
    window.alert("image uploaded successfully");

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
     data.save();
    res.status(200).json({ success: "image uploaded successfully" });

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

router.post("/addslots", async (req, res) => {
  const { date, slots } = req.body;
  try {
    const data = new Slot({ 
      date,
      slots,
     }); 
    const res = await data.save();
     res.send( "Slots created successfully" );
  } catch (error) {
    console.log(error);
  }
});
router.get("/getslots", async (req, res) => {
  try {
    Slot.find({}, (err, slots) => {
      if (err) {
        throw err;
      }
      res.send(slots);
    });
  } catch (err) {
    console.log(err);
  }
});
router.put("/decreaseslots", async (req, res) => {
  const { _id, slots } = req.body;
  try {
    const data = await Slot.findOne({ _id: _id});
    if(data){
      const newslots = slots;
      await Slot.updateOne({ _id: _id }, { $set: { slots: newslots } });
      res.send( "Slots updated successfully" );
    } else {
      res.status(400).json({ msg: "Slots not found" });
    }
  } catch (error) {
    console.log(error);
  }
});
router.get("/doctorinfo",authenticate , (req, res) => {
  res.send(req.user);
});

module.exports = router;