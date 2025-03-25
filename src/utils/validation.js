const validator = require('validator');


//validate the data before updating the profile
const validate = (req)=>{
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("All fields are mandatory");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email Id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  } // else if(firstName.length<4 || firstName.length<50){
  //     throw new Error("First Name should be of length 4 to 50");
  // }
}

const validateEditProfileData = (req)=>{
  const allowedEditFiels = [
    "firstName", 
    "lastName", 
    "emailId", 
    "age", 
    "gender", 
    "skills", 
    "photoUrl", 
    "about"
  ];
  const isEditallowed = Object.keys(req.body).every((field) => allowedEditFiels.includes(field));
  return isEditallowed;
}

const validatePassword = (req)=>{
  if(!req.body.password){
    throw new Error("Password is mandatory");
  }

  if(!validator.isStrongPassword(req.body.password)){
    throw new Error("Enter a strong password");
    }
}

module.exports = {
  validate,
  validateEditProfileData,
  validatePassword
};