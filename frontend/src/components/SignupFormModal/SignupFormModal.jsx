import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupFormModal.css'

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  


  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)

        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Passwords do not match"
    });
  };
  const isDisabled = 
    email.length === 0 || 
    username.length < 4 || 
    firstName.length === 0 || 
    lastName.length === 0 || 
    password.length < 6 || 
    confirmPassword.length < 6;

  return (
    <div className='signup-container'>
      <h1>Sign Up</h1>
      <div>
          {errors.email ?  <p className='error'>{errors.email}</p> : null}
          {errors.username ?  <p className='error'>{errors.username}</p> : null}
          {errors.firstName ?  <p className='error'>{errors.firstName}</p> : null}
          {errors.lastName ?  <p className='error'>{errors.lastName}</p> : null}
          {errors.password ?  <p className='error'>{errors.password}</p> : null}
          {errors.confirmPassword ?  <p className='error'>{errors.confirmPassword}</p> : null}
      </div>
      <form onSubmit={handleSubmit} id='signupForm'>
        <div className='signup-input-container'>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email'
            className='signup-input'
            required
          />
        </div>
        
        <div className='signup-input-container'>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Username'
            className='signup-input'
            required
          />
        </div>
        
        <div className='signup-input-container'>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder='First Name'
            className='signup-input'
            required
          />
        </div>
        
        <div className='signup-input-container'>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder='Last Name'
            className='signup-input'
            required
          />
        </div>
        
        <div className='signup-input-container'>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            className='signup-input'
            required
          />
        </div>
        
        <div className='signup-input-container'>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder='Confrim Password'
            className='signup-input'
            required
          />
        </div>
        <button type="submit" id='signupButton' disabled={isDisabled}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;