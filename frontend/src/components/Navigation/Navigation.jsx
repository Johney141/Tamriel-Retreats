import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import { FaAirbnb } from "react-icons/fa";
import './Navigation.css'

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
        <NavLink to="/login">Log In</NavLink>
      </div>
      <div>
        <NavLink to="/signup">Sign Up</NavLink>
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