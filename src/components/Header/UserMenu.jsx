import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classnames from 'https://esm.sh/classnames@2';
import { useAuth0 } from '@auth0/auth0-react';
import { setUserSettingsOpen, setRecurringOpen } from '../../slices/app.js';

function UserMenu() {
  const [profileActive, setProfileActive] = useState(false);
  const { isAuthenticated, user, logout } = useAuth0();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.app.token);
  const menuRef = useRef(null);

  // Close menu if clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileActive(false);
      }
    }

    // Add event listener when menu is open
    if (profileActive) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileActive]);

  if (!isAuthenticated) {
    return null;
  }
  if (!user) {
    console.error('User object is not available');
    return null;
  }
  if (!user.picture) {
    console.error('user.picture is not defined');
  }
  return (
    <div
      ref={menuRef}
      className={classnames('user', {
        'profile-active': profileActive
      })}
    >
      <img
        src={user.picture}
        onClick={() => {
          setProfileActive(!profileActive);
        }}
      />
      <ul className="profile">
        <li>{user.name}</li>
        <li
          className="recurring"
          onClick={() => {
            dispatch(setRecurringOpen(true));
          }}
        >
          Recurring
        </li>
        <li
          className="settings"
          onClick={() => dispatch(setUserSettingsOpen(true))}
        >
          Settings
        </li>
        <li className="jwt-token">
          <details>
            <summary>JWT Token</summary>
            {token}
          </details>
        </li>
        <li
          className="logout"
          onClick={() =>
            logout({
              logoutParams: {
                returnTo: window.location.href
              }
            })
          }
        >
          Log Out
        </li>
      </ul>
    </div>
  );
}

export default UserMenu;
