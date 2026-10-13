import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "/toque/toque-admin.js";
declare module "/toque/toque-dueno.js";
declare module "/toque/toque-empleado.js";

type ToqueElementProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  theme?: "light" | "dark";
  "hide-header"?: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "toque-admin": ToqueElementProps;
      "toque-dueno": ToqueElementProps;
      "toque-empleado": ToqueElementProps;
    }
  }
}
