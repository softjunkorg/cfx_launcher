import { theme } from "antd";
import { atom } from "recoil";

export const themeData = atom({
  key: "themeData",
  default: {
    token: {
      colorPrimary: "#4a79ff",
      borderRadius: 2,
      fontFamily: "Unbounded",
    },
    algorithm: theme.darkAlgorithm,
  },
});
