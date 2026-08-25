// Sticky top navigation with a burger dropdown for secondary links.
// On desktop the dropdown holds Projects.
// On mobile all links collapse into the dropdown.
import type React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

function NavBar(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="navbar">
      <NavLink to="/" end className="nav-brand">
        <span className="mobile-hide">Alex Steeves</span>
        <span className="mobile-show">Alex S.</span>
      </NavLink>

      <div className="nav-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Portfolio
        </NavLink>
        <NavLink
          to="/projects"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Projects
        </NavLink>

        <ThemeToggle />

        <div className="burger-wrapper">
          <button
            className={`burger-btn${open ? " open" : ""}`}
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>

          <AnimatePresence>
            {open && (
              <>
                <motion.div
                  className="burger-backdrop"
                  onClick={close}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.div
                  className="burger-dropdown"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
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
                    to="/projects"
                    className={({ isActive }) =>
                      `burger-link mobile-only${isActive ? " active" : ""}`
                    }
                    onClick={close}
                  >
                    Projects
                  </NavLink>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
