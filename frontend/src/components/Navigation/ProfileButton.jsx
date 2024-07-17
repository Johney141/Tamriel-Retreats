import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosMenu } from "react-icons/io";
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import './ProfileButton.css'
import { useNavigate } from 'react-router-dom';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation(); 
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const handleMangeSpots = (e) => {
    e.preventDefault();
    navigate('/spots/current')
  }

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div className='profile'>
      <button onClick={toggleMenu} className='dropdown-menu'>
        <IoIosMenu />
        <FaUserCircle />
      </button>
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <div className='user-container'>
            <div className='user-info'>
              <p>Hello, {user.username}</p>
              <p>{user.email}</p>
            </div>
            <div>
              <button
                onClick={handleMangeSpots}
                id='manageSpots'
              >
                Manage Spots
              </button>
            </div>
            <div>
              <button 
                onClick={logout} 
                id='logoutButton'>
                Log Out
              </button>
            </div>
          </div>
        ) : (
          <div className='profile-container'>
            <div className='profile-dropdown'>
              <OpenModalButton
                buttonText="Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormModal />}
                className='dropdown-button'
                
              />
            </div>
            <div className='profile-dropdown'>
              <OpenModalButton
                buttonText="Sign Up"
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal />}
                className='dropdown-button'
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileButton;