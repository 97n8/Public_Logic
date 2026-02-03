import { PrrRouter } from "./PrrRouter.js";

export function PhillipstonShell({ cfg, auth, sp }) {
  const root = document.createElement("div");
  root.className = "phillipston-shell";

  const header = document.createElement("header");
  header.className = "phillipston-shell__header";

  const titleWrap = document.createElement("div");

  const h1 = document.createElement("h1");
  h1.textContent = "Phillipston PRR";

  const p = document.createElement("p");
  p.textContent = "Staff Operations & Institutional Record";

  titleWrap.appendChild(h1);
  titleWrap.appendChild(p);
  header.appendChild(titleWrap);

  const main = document.createElement("main");
  main.className = "phillipston-shell__main";
  main.appendChild(PrrRouter({ cfg, auth, sp }));

  root.appendChild(header);
  root.appendChild(main);

  return root;
}
