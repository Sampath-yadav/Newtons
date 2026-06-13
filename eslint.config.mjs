import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

// Canonical Next.js 15 + ESLint 9 flat config. FlatCompat bridges the
// eslintrc-style "next/core-web-vitals" + "next/typescript" presets (shipped by
// eslint-config-next 15) into ESLint 9's flat-config format.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default eslintConfig;
