import SidebarFooter from "./SidebarFooter";
import Logo from "./Logo";
import styles from "./Sidebar.module.css";
import AppNav from "./AppNav";
import { Outlet } from "react-router-dom";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      <Outlet />
      <SidebarFooter />
    </div>
  );
}

export default Sidebar;
