import { copyFileSync, cpSync, mkdirSync } from "node:fs";

// Flowbite (perilaku komponen: drawer, dropdown, modal, dst.)
mkdirSync("assets/js/vendor", { recursive: true });
copyFileSync("node_modules/flowbite/dist/flowbite.min.js", "assets/js/vendor/flowbite.min.js");

// Font Ordinara: url() di dist/output.css relatif ke dist/
cpSync("node_modules/@ordinara/ui/src/fonts", "dist/fonts", { recursive: true });
cpSync("node_modules/@fontsource-variable/bricolage-grotesque/files", "dist/files", { recursive: true });
