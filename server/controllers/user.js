
const User = require('../models/User');
const bcrypt = require("bcryptjs");
const {errorHandler, createAccessToken} = require("../auth");


// Registration
module.exports.registerUser = (req, res) => {
    let newUser = new User({
      username: req.body.username,
      email: req.body.email,
    //   isAdmin: req.body.isAdmin,
      password: bcrypt.hashSync(req.body.password, 10)
    });
  
    const isValidEmail = (email) => {
      return email.includes('@');
    };
  
    const isValidPassword = (password) => {
      return password.length >= 8;
    };
  
    const { username, email, password } = req.body;
  
    if(!isValidEmail(email)) {
      return res.status(400).send({ message: 'Invalid email format.'});
    } else if(!isValidPassword(password)) {
      return res.status(400).send({ message: 'Password must be atleast 8 characters long.' });
    }
  
    User.find({email: req.body.email}).then(result => {
      if(result.length > 0) {
        return res.status(409).send({message: "Email already exists."})
      }
      
      return newUser.save()
      .then((result) => {
        res.status(201).send({ message: 'User registered successfully', result});
      }).catch(err => errorHandler(err, req, res))

    }).catch(err => errorHandler(err, req, res))

    
};


// Authentication
module.exports.loginUser = (req, res) => {
  if(!req.body.email.includes('@')) {
    return res.status(400).send({ message: "Invalid Email" });
  }

  return User.findOne({ email: req.body.email }).then((result) => {
      if (result == null) { 
        return res.status(404).send({ message: "No email found" });
      } else {

        const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

        if (isPasswordCorrect) {
            return res.status(200).send({access : createAccessToken(result)});
        } else {
            return res.status(401).send({ message: "Email and password do not match" });
        }

      }
    })
    .catch((err) => errorHandler(err, req, res));
};


// get user details here
module.exports.getUserDetails = (req, res) => {
  return User.findById(req.user.id).then(user => {
    if(user) {
      return res.status(200).send({user});
    } else {
      return res.status(404).send({ message: "User not found"});
    }
  }).catch(err => errorHandler(err, req, res));
}
