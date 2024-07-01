import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import { IoIosMenu } from "react-icons/io";
import * as sessionActions from '../../store/session';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import './ProfileButton.css'

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
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

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu} className='dropdown-menu'>
        <IoIosMenu />
        <FaUserCircle />
      </button>
      <div className={ulClassName} ref={ulRef}>
        {user ? (
          <>
            <div>{user.username}</div>
            <div>{user.firstName} {user.lastName}</div>
            <div>{user.email}</div>
            <div>
              <button onClick={logout}>Log Out</button>
            </div>
          </>
        ) : (
          <div className='profile-container'>
            <div className='profile-dropdown'>
              <OpenModalButton
                buttonText="Log In"
                modalComponent={<LoginFormModal />}
                className='dropdown-button'
                
              />
            </div>
            <div className='profile-dropdown'>
              <OpenModalButton
                buttonText="Sign Up"
                modalComponent={<SignupFormModal />}
                className='dropdown-button'
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default ProfileButton;