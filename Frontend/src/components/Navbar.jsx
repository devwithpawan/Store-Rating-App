import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="navbar">

      <div className="navbar-inner">

        {/* LOGO */}
        <Link to="/" className="navbar-logo">
          <span className="logo-mark">S</span>
          <span>StoreRate</span>
        </Link>


        {/* DESKTOP NAVIGATION */}
        <nav className="navbar-links">

          {/* HOME */}
          <Link to="/">
            Home
          </Link>

          {/* USER */}
          {user?.role === "USER" && (
            <Link to="/dashboard">
              Stores
            </Link>
          )}

          {/* ADMIN */}
          {user?.role === "ADMIN" && (
            <>
              <Link to="/admin/dashboard">
                Dashboard
              </Link>

              <Link to="/admin/dashboard#stores">
                Stores
              </Link>

              <Link to="/admin/dashboard#users">
                Users
              </Link>
            </>
          )}

          {/* OWNER */}
          {user?.role === "OWNER" && (
            <Link to="/owner/dashboard">
              Dashboard
            </Link>
          )}

          {/* CHANGE PASSWORD */}
          {user && (
            <Link to="/change-password">
              Change Password
            </Link>
          )}

          {/* LOGGED OUT */}
          {!user && (
            <>
              <a href="/#features">
                Features
              </a>

              <a href="/#how-it-works">
                How It Works
              </a>

              <Link to="/login">
                Login
              </Link>

              <Link to="/register">
                Get Started
              </Link>
            </>
          )}

        </nav>


        {/* DESKTOP USER */}
        {user ? (
          <div className="navbar-user">

            <div className="user-info">

              <div className="user-avatar">
                {user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div className="user-details">

                <span className="user-name">
                  {user?.name || "User"}
                </span>

                <span className="user-role">
                  {user?.role || "USER"}
                </span>

              </div>

            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={17} />
            </button>

          </div>
        ) : (
          <div className="navbar-auth">

            <Link
              to="/login"
              className="navbar-login"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="navbar-register"
            >
              Get Started
            </Link>

          </div>
        )}


        {/* MOBILE MENU BUTTON */}
        <button
          className="mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>

      </div>


      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          {user?.role === "USER" && (
            <Link
              to="/dashboard"
              onClick={() => setMenuOpen(false)}
            >
              Stores
            </Link>
          )}

          {user?.role === "ADMIN" && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                to="/admin/dashboard#stores"
                onClick={() => setMenuOpen(false)}
              >
                Stores
              </Link>

              <Link
                to="/admin/dashboard#users"
                onClick={() => setMenuOpen(false)}
              >
                Users
              </Link>
            </>
          )}

          {user?.role === "OWNER" && (
            <Link
              to="/owner/dashboard"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          )}

          {user && (
            <Link
              to="/change-password"
              onClick={() => setMenuOpen(false)}
            >
              Change Password
            </Link>
          )}

          {!user && (
            <>
              <a
                href="/#features"
                onClick={() => setMenuOpen(false)}
              >
                Features
              </a>

              <a
                href="/#how-it-works"
                onClick={() => setMenuOpen(false)}
              >
                How It Works
              </a>

              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/register"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </button>
          )}

        </div>
      )}

    </header>
  );
};

export default Navbar;