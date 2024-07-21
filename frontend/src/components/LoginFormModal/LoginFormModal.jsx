import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    
    const data = await dispatch(sessionActions.login({ credential, password }))
    console.log(data)
    
    if(data && data.message) {
      setErrors(data)
    } else {
      closeModal();
    }


  };

  const handleDemo = async (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({credential:'Demo-lition', password:'password'}))
      .then(closeModal)
  }
  const isDisabled = credential.length < 4 || password.length < 6;
  return (
    <div className='login-container'>
      <h1>Log In</h1>

      {errors.message ? <p className='error'>The provided creditnals were invalid</p> : null}

      <form onSubmit={handleSubmit} className='login-form'>
        <label>        
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder='Username or Email'
            className='login-input'
            required
          />
        </label>
        <label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            className='login-input'
            required
          />
        </label>
        {errors.credential && (
          <p>{errors.credential}</p>
        )}
        <button 
          type="submit" 
          className='login-button'
          disabled={isDisabled}
          >Log In</button>
        <div className='demo-container'>
          <button
            onClick={e => handleDemo(e)}
            id='demoButton'
          >Login as Demo User</button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;