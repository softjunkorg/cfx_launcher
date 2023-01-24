import { AliasToken } from "antd/es/theme/interface";

// Extending default theme
declare module "styled-components" {
  export interface DefaultTheme extends AliasToken {}
}
