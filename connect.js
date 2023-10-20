const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator"); // Import validation functions

mongoose.connect("mongodb://localhost:27017/product");
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
db.once("open", function (callback) {
  console.log("connection succeeded");
});

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

// Define validation rules using express-validator
const validateForm = [
  check("name").notEmpty().withMessage("Name is required"),
  check("num").isMobilePhone().withMessage("Invalid phone number"),
  check("email").isEmail().withMessage("Invalid email address"),
  check("pwd").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

app.post("/sign_up", validateForm, function (req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If validation errors are present, send them back to the client
    return res.status(400).json({ errors: errors.array() });
  }

  // If validation passes, proceed to save the data to MongoDB
  const Name = req.body.name;
  const Number = req.body.num;
  const Email = req.body.email;
  const Password = req.body.pwd;
  const RoomType = req.body.RT;
  const NumberofAdults = req.body.NA;
  const NumberofKids = req.body.NK;
  




  const data = {
    name: Name,
    num: Number,
    email: Email,
    pwd: Password,
    RT: RoomType,
    NA: NumberofAdults,
    NK: NumberofKids,
  };

  db.collection("details").insertOne(data, function (err, collection) {
    if (err) throw err;
    console.log("Record inserted Successfully");
  });

  return res.redirect("success.html");
});

app.listen(8000, () => {
  console.log("Server listening at port 8000");
});
