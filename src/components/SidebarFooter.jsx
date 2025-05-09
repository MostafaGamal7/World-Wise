import styles from "./SidebarFooter.module.css";

function SidebarFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.copyright}>
        &copy; Copyright {new Date().getFullYear()} WorldWise Inc.
      </p>
    </footer>
  );
}

export default SidebarFooter;
