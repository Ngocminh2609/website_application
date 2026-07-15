import type { CSSProperties } from "react";

export const styles = {
  drawerBody: {
    padding: 0,
    height: "calc(100vh - 55px)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  } as CSSProperties,

  chatWrapper: {
    flex: 1,
    minHeight: 0,
    height: "100%",
  } as CSSProperties,
};
