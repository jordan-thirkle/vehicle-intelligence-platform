import "./styles.css";
import "./marketing.css";
import { renderApp } from "./ui/render.js";
import { renderMarketing } from "./ui/renderMarketing.js";

const root = document.querySelector("#app");
const productRoute = window.location.pathname.startsWith("/passport");

if (productRoute) {
  document.title = "Vehicle Passport — FG11 YKC | Vehicle Intelligence";
  renderApp(root);
} else {
  renderMarketing(root);
}
