import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaAirbnb } from 'react-icons/fa';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  const handleClick = () => {
    navigate('/')
  }


  return (
    <nav className='navbar'>
      <div className='nav-item'>
      <button
          id='home-button'
          onClick={handleClick}
        >
          <FaAirbnb />
          Tamriel Retreats
      </button>
      </div>
      {isLoaded && (
        <div>
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;