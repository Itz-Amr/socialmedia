import { Link, useLocation } from "react-router-dom";
import styles from "./index.module.css";
import { SideMenuPaths } from "../../../../Store";
import { useEffect, useState } from "react";

export default function SideMenu() {
  const location = useLocation();
  const [activePath, setActivePath] = useState();
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);
  return (
    <nav
      className="p-2 d-flex flex-column align-items-center justify-content-between"
      id={styles.parnet}
    >
      {SideMenuPaths.map((el, index) => (
        <Link
          className={
            `d-flex align-items-center justify-content-center p-2 position-relative` +
            (el.path === activePath ? ` ${styles.activeLink}` : "")
          }
          key={index}
          to={el.path}
        >
          {el.icon}
        </Link>
      ))}
    </nav>
  );
}
