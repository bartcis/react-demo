import { PropsWithChildren } from "react";
import { Header } from "../header/header";

import styles from "./layout.module.css";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <main className={styles.Container}>{children}</main>
    </>
  );
};
