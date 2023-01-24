import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./App";
import "./i18n";

const element = document.getElementById("root") as HTMLElement;
const root = createRoot(element);

root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>
);
