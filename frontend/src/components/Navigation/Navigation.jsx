import { useSelector } from 'react-redux';
import { FaAirbnb } from 'react-icons/fa';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { useNavigate } from 'react-router-dom';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/')
  }
  const handleCreateSpot = () => {
    navigate('/spots/create-a-spot')
  }

  return (
    <nav className='navbar'>
      <div className='nav-item'>
      <button
          id='home-button'
          onClick={handleHomeClick}
        >
          <FaAirbnb />
          Tamriel Retreats
      </button>
      </div>
      {isLoaded && (
        <div className='spot-profile-container'>
          {sessionUser ? (
            <button 
              id='createSpotButton'
              onClick={handleCreateSpot}
              >
              Create a New Spot
            </button>
          ) : null}

          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;