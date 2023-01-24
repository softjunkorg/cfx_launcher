import { FC, ReactNode } from "react";
import { ThemeProvider as StylesProvider } from "styled-components";
import { theme } from "antd";

interface IThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: FC<IThemeProviderProps> = (props) => {
  const { children } = props;
  const { token } = theme.useToken();
  return <StylesProvider theme={token}>{children}</StylesProvider>;
};

export default ThemeProvider;
