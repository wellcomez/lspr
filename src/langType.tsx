import { FaBitcoin, FaFileCode } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";
import { FaGit } from "react-icons/fa";
import { FaGolang } from "react-icons/fa6";
import { RiJavascriptLine } from "react-icons/ri";
import { DiJavascript1 } from "react-icons/di";
import { MdCss } from "react-icons/md";
import { TbJson } from "react-icons/tb";
import { TbBrandGolang } from "react-icons/tb";
import { TbBrandTypescript } from "react-icons/tb";
import { TbFileTypeCss } from "react-icons/tb";
import { TbBrandCpp } from "react-icons/tb";
import { PiFileCssFill } from "react-icons/pi";
import { SiGoland } from "react-icons/si";
import { SiMarkdown } from "react-icons/si";
import { SiTypescript } from "react-icons/si";
import { IconType } from "react-icons/lib/cjs/iconBase";
import { DiPython } from "react-icons/di";
import { SiYaml } from "react-icons/si";
import path from 'path-browserify';

import { javascript } from "@codemirror/lang-javascript";
import { StreamLanguage } from "@codemirror/language";
import { go } from "@codemirror/legacy-modes/mode/go";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { json } from "@codemirror/lang-json";
import { cpp } from "@codemirror/lang-cpp";
import { css } from "@codemirror/lang-css";
import { python } from "@codemirror/lang-python";
import { yaml } from "@codemirror/lang-yaml";
import { html } from "@codemirror/lang-html";
import { languages } from "@codemirror/language-data";
import { IoLogoCss3 } from "react-icons/io5";
import { FaHtml5 } from "react-icons/fa6";

class langType {
  constructor(
    extset: Array<string>,
    fileset: Array<string>,
    type: string,
    extension: [any?],
    icon: IconType,
  ) {
    this.extset = new Set(extset);
    this.fileset = new Set(fileset);
    this.type = type;
    this.extension = extension;
    this.icon = icon;
  }
  icon: IconType;
  extset: Set<string> = new Set();
  fileset: Set<string> = new Set();
  extension: [any?];
  type: string;
  is(filePath: string): [any?] | undefined {
    const { base, ext } = path.parse(filePath);
    if (this.fileset.has(base)) {
      return this.extension;
    }
    if (this.extset.has(ext)) {
      return this.extension;
    }
    return undefined;
  }
}
const go_ext = new langType(
  [".go"],
  ["go.mod", "go.sum"],
  "go",
  [StreamLanguage.define(go)],
  SiGoland,
);
const cpp_ext = new langType(
  [".c", ".cpp", ".h", ".hpp"],
  [],
  "cpp",
  [cpp()],
  TbBrandCpp,
);
const python_ext = new langType([".py"], [], "python", [python()], DiPython);
const js_ext = new langType(
  [".js", ".ts", ".tsx"],
  [],
  "js",
  [javascript({ jsx: true })],
  DiJavascript1,
);
const css_ext = new langType([".css"], [], "css", [css()], IoLogoCss3);
const json_ext = new langType([".json"], [], "json", [json()], TbJson);
const yaml_ext = new langType([".yml", ".yaml"], [], "yaml", [yaml()], SiYaml);
const git_ext = new langType([".git"], [".gitignore"], "git", [], FaGit);
const html_ext = new langType([".html"], [], "html", [], FaHtml5);
const markdown_ext = new langType(
  [".md"],
  [],
  "md",
  [markdown({ base: markdownLanguage, codeLanguages: languages })],
  SiMarkdown,
);
var all_language = [
  go_ext,
  js_ext,
  go_ext,
  json_ext,
  markdown_ext,
  python_ext,
  cpp_ext,
  css_ext,
  yaml_ext,
  git_ext,
  html_ext
];
export { all_language };
