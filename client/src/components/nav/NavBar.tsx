// Sticky top navigation with a burger dropdown for secondary links.
// On desktop the dropdown holds Projects and Toronto Events.
// On mobile all links collapse into the dropdown.
import type React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

function NavBar(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="navbar">
      <NavLink to="/" end className="nav-brand">Alex Steeves</NavLink>

      <div className="nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Portfolio
        </NavLink>
        <NavLink
          to="/senate-watch"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Senate Watch
        </NavLink>

        <div className="burger-wrapper">
          <button
            className={`burger-btn${open ? " open" : ""}`}
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>

          {open && (
            <>
              <div className="burger-backdrop" onClick={close} />
              <div className="burger-dropdown">
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `burger-link mobile-only${isActive ? " active" : ""}`
                  }
                  onClick={close}
                >
                  Portfolio
                </NavLink>
                <NavLink
                  to="/senate-watch"
                  className={({ isActive }) =>
                    `burger-link mobile-only${isActive ? " active" : ""}`
                  }
                  onClick={close}
                >
                  Senate Watch
                </NavLink>
                <NavLink
                  to="/projects"
                  className={({ isActive }) =>
                    `burger-link${isActive ? " active" : ""}`
                  }
                  onClick={close}
                >
                  Projects
                </NavLink>
                <NavLink
                  to="/toronto-events"
                  className={({ isActive }) =>
                    `burger-link${isActive ? " active" : ""}`
                  }
                  onClick={close}
                >
                  Toronto Events
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
