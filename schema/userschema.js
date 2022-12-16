const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const DoctorSchema = new mongoose.Schema({
      name: {
            type: String,
            required: true,
      },
      email: {
            type: String,
            required: true,
            unique: true,
      },
      password: {
            type: String,
            required: true,
      },
      cpassword: {
            type: String,
            required: true,
      },
      tokens:[{
            token :{ type: String, required: true}
       }]
});

const GallerySchema = new mongoose.Schema({
     
      photo: {
            type: String,
            required: true,
      },
      title:
      {
            type: String,
            required: true,
      },
      caption: {
            type: String ,
            required: true,
      },
      date: {
            type: Date,
            default: Date.now,
            required: true,
      },
    
});

const ReviewSchema = new mongoose.Schema({
     
      occupation:
      {
            type: String,
            required: true,
      },
       review: {
            type: String ,
            required: true,
      },
      name: {
            type: String,
            required: true,
      },
      rating: {
            type: Number ,
            required: true,
      }
});

const TickerSchema = new mongoose.Schema({
      ticker: {
            type: String,
            required: true,
      },
      link: {
            type: String,
      },
      newicon:{
            type : String,
      }
})
const SlotsSchema = new mongoose.Schema({
      date: {
            type: Date,
            default: Date.now,
      },
      slots: {
            type: Number,
            default: 20,
      }

})


// Hashing the password
DoctorSchema.pre("save", async function (next) {
      if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 12);
            this.cpassword = await bcrypt.hash(this.cpassword, 12);
      }
      next();
});
DoctorSchema.methods.generateAuthToken=async function(){
      try {
        let tokengenerated  = jwt.sign({_id:this._id},process.env.JWT_KEY)
          this.tokens = this.tokens.concat({token:tokengenerated});
         await this.save();
         return tokengenerated;
      } catch (error) {
        console.log(error);
      }
    }

const Doctor = mongoose.model("DOCTOR", DoctorSchema);
const Gallery = mongoose.model("GALLERY", GallerySchema);
const Review = mongoose.model("REVIEW", ReviewSchema);
const Ticker = mongoose.model("TICKER", TickerSchema);
const Slot = mongoose.model("SLOTS", SlotsSchema);

module.exports = {
      Doctor,
      Gallery,Review,Ticker,Slot
};

