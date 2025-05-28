import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from 'react-icons/fa';
import { thunkLogout } from "../../redux/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { useNavigate } from "react-router-dom";
import "./Navigation.css"

function ProfileButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const user = useSelector((store) => store.session.user);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = async (e) => {
    e.preventDefault();
    await dispatch(thunkLogout());
    closeMenu();
  };


  return (
    <>
      <button onClick={toggleMenu}>
        <FaUserCircle />
      </button>
      {showMenu && (
        <ul className={"profile-dropdown"} ref={ulRef}>
          {user ? (
            <>
              <li><strong>{user.username}</strong></li>
              <li>{user.email}</li>
              <li><button onClick={() => { navigate('/dashboard'); closeMenu(); }}>My Dashboard</button></li>
              <li><button onClick={() => { navigate('/notes'); closeMenu(); }}>My Notes</button></li>
              <li><button onClick={() => { navigate('/notebooks'); closeMenu(); }}>My Notebooks</button></li>
              <li><button onClick={() => { navigate('/tasks'); closeMenu(); }}>My Tasks</button></li>
              <li><button onClick={logout}>Log Out</button></li>
            </>
          ) : (
            <>
              <OpenModalMenuItem
                itemText={
                  <span className="text-base font-medium hover:text-[#41E296] hover:underline cursor-pointer transition">
                    Log In
                  </span>
                }
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
              <OpenModalMenuItem
                itemText={
                  <span className="text-base font-medium hover:text-[#41E296] hover:underline cursor-pointer transition">
                    Sign Up
                  </span>
                }
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;
