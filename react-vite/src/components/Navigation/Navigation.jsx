import { NavLink, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

export default function Navigation() {
  const user = useSelector((state) => state.session.user);
  const location = useLocation();

  const isOnLandingPage = location.pathname === "/";

  return (
    <nav className="nav-bar">
      <div className="nav-left">
        <NavLink to="/" className="logo">
          <img src="/default.svg" alt="Neuronote logo" className="logo-img" />
        </NavLink>

        {!user && isOnLandingPage && (
          <>
            <HashLink smooth to="#about">About</HashLink>
            <HashLink smooth to="#features">Features</HashLink>
            <HashLink smooth to="#contact">Contact</HashLink>
          </>
        )}

        {user && (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/notes">My Notes</NavLink>
            <NavLink to="/notebooks">My Notebooks</NavLink>
            <NavLink to="/tags">Tags</NavLink>
          </>
        )}
      </div>

      <div className="nav-right">
        <ProfileButton />
      </div>
    </nav>
  );
}

