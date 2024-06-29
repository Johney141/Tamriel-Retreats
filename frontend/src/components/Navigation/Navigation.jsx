import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { FaAirbnb } from "react-icons/fa";
import './Navigation.css'
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const navigate = useNavigate();

  const sessionLinks = sessionUser ? (
    <div>
      <ProfileButton user={sessionUser} />
    </div>
  ) : (
    <>
      <div>
        <OpenModalButton
        buttonText={"Log In"}
        modalComponent={<LoginFormModal />}/>
      </div>
      <div>
        <OpenModalButton 
          buttonText={"Sign Up"}
          modalComponent={<SignupFormModal />}
        />
      </div>
    </>
  );


  const handleClick = () => {
    navigate('/')
  }
  return (
    <nav className='navbar'>
      <div className='nav-item' >
        <button
          id='home-button'
          onClick={handleClick}
        >
          <FaAirbnb />
          Tamriel Retreats
        </button>
      </div>
      {isLoaded && sessionLinks}
    </nav>
  );
}

export default Navigation;