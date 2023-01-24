import { ThemeConfig } from "antd/es/config-provider/context";
import { theme } from "antd";
import { atom } from "recoil";

export const themeData = atom<ThemeConfig>({
  key: "themeData",
  default: {
    token: {
      colorPrimary: "#4a79ff",
      borderRadius: 4,
      fontFamily: "Raleway",
    },
    algorithm: theme.darkAlgorithm,
  },
});
