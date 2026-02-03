import React from "react";
import { createRoot } from "react-dom/client";
import RecordConsole from "./record-console-app.jsx";

export function mountRecordConsole(node, props) {
  const root = createRoot(node);
  root.render(<RecordConsole {...props} />);
}
