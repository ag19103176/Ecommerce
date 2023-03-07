import React, { useState } from "react";
import Base from "../core/Base";
import { Link } from "react-router-dom";
import { signup } from "../auth/helper";

const Signup = () => {
  const [value,setValues] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    success: false
  });

  const {name,email,password,error,success} = value;
  
  const handleChange = name => event => {
    setValues({...value,error:false,[name]: event.target.value})
  }
  
  const onSubmit = event => {
    event.preventDefault();
    setValues({...value,error: false})
    signup({
        name,email,password
    })
    .then(data => {
      if(data.error){
        setValues({...value,error:data.error,success:false})
      }
      else{
        setValues({...value,
          name: "",
          email: "",
          password: "",
          error: "",
          success: true
        })
        }
    })
    .catch(console.log("Error in signup!"))
  }
//without parenthesis mean wait for some time and then run
  const signUpForm = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <form>
            <div className="form-group">
              <label className="text-light">Name</label>
              <input className="form-control" onChange={handleChange("name")} type="text" value={name}/>
            </div>
            <div className="form-group">
              <label className="text-light">Email</label>
              <input className="form-control" onChange={handleChange("email")} type="email" value={email}/>
            </div>

            <div className="form-group">
              <label className="text-light">Password</label>
              <input className="form-control" onChange={handleChange("password")} type="password" value={password} />
            </div>
            <button onClick={onSubmit} className="btn btn-success btn-block">Submit</button>
          </form>
        </div>
      </div>
    );
  };
//with parenthesis fn call means imediate call
  const successMessage = () => (
    <div className="row">
      <div className="col-md-6 offset-sm-3 text-left">
        <div className="alert alert-success"
          style={{display:success?"":"none"}}>
            New Account was created succesfully!! Please 
            <Link to="/signin">Login here!</Link>
        </div>
      </div>
    </div>
  )
  const errorMessage = () => (
    <div className="row">
      <div className="col-md-6 offset-sm-3 text-left">
        <div className="alert alert-danger"
        style={{display:error?"":"none"}}>
          {error}
        </div>
      </div>
    </div>
  )
  return (
    <Base title="Sign up page" description="A page for user to sign up!">
      {successMessage()}
      {errorMessage()}
      {signUpForm()}
      <p className="text-white text-center">
        {JSON.stringify(value)};
      </p>
    </Base>
  );
};

export default Signup;
