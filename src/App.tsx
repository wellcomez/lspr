import React, { SetStateAction, useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, ConfigProvider, Layout, Menu, theme } from "antd";
import CodeMirror from "@uiw/react-codemirror";
import { monokai } from "@uiw/codemirror-theme-monokai";

import { Directory, ToggleFileTree } from "react-toggle-file-tree";
import axios from "axios";
import path from "path-browserify";
// import "./style.css";
import { all_language, langType } from "./langType";
import { Dir, fileresp, BasicTree, CreateTreeState } from "./filetree";
import { IoMdArrowRoundBack, IoMdArrowRoundForward } from "react-icons/io";
import ButtonGroup from "antd/es/button/button-group";
import { Editor } from "@monaco-editor/react";
import Markdown from "react-markdown";
var imageset = new Set([".png", ".jpg", ".jpeg", ".gif", ".ico"]);
// var parsePath = require('parse-filepath');
const get_lang_extention = (lang: [any?]): [any?] => {
  return lang;
};

function get_lang(filePath: string): langType | undefined {
  for (let index = 0; index < all_language.length; index++) {
    const element = all_language[index];
    let t = element.is(filePath);
    if (t !== undefined) {
      return element;
    }
  }
}

function get_lang_extension(filePath: string): [any?] {
  for (let index = 0; index < all_language.length; index++) {
    const element = all_language[index];
    let t = element.is(filePath);
    if (t !== undefined) {
      return t;
    }
  }
  return [];
}

const { Header, Sider, Content } = Layout;



const App: React.FC = () => {
  return NewFunction();
};

export default App;
function convert_lang(s: string): string {

  let t = get_lang(s)
  if (t) { return t.type }
  return "txt"
}
const view_type_markdown = "markdown";
const view_type_image = "image";
const view_type_code = "code"
function NewFunction() {
  var a: Dir = { root: "/", rootname: "", files: [], parent: "" };
  const [collapsed, setCollapsed] = useState(false);
  // const [fileList, setFileList] = useState<FileItem[]>([]);
  const [dir, setDir] = useState(a);
  var default_ext: [any?] = [];
  const [lang, setLang] = useState(default_ext);
  const [imagesrc, setImagesrc] = useState("");
  const [view_type, set_view_type] = useState(view_type_code);
  const [content, setContent] = useState("xdafdafadfadfasdfasdfasdfasf");
  const [filepath, setFilepath] = useState("");
  // const [rootname, setRootName] = useState("");
  // const [root, setRoot] = useState("/");
  const setData = (data: Dir) => {
    setDir(data);
  };

  function isPng(fileName: string): boolean {
    var ext = path.parse(fileName).ext;
    return imageset.has(ext);
  }

  const open_file = async (root: string) => {
    let u = url_open_file + root;
    try {
      if (isPng(u)) {
        setImagesrc(u);
        set_view_type(view_type_image)
        return;
      }
      let lang = get_lang(root)
      if (lang && lang.type == "markdown") {
        set_view_type(view_type_markdown)
      } else {
        set_view_type(view_type_code)
      }
      setFilepath(root)
      let ext: [any?] = []
      if (lang) {
        ext = lang.extension
      }
      setLang(ext);
      const response = await axios.get(u, { responseType: "text" }); // 使用 Axios 发起请
      console.log(response.data);
      setContent(response.data);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  const open_dir = async (root: string) => {
    try {
      let u = url_open_dir + root;
      const response = await axios.get(u); // 使用 Axios 发起请求

      // const response = await fetch('https://api.example.com/data'); // 使用 fetch API 发起请求
      setData(response.data);
    } catch (error) {
      console.log(error);
    } finally {
    }
  };
  const did_click_node = (node: fileresp) => {
    if (node.IsDir) {
      open_dir(node.Path);
    } else {
      open_file(node.Path);
    }
  };
  const url_open_dir = "http://localhost:18080/path";
  const url_open_file = "http://localhost:18080/open";
  useEffect(() => {
    open_dir(dir.root);
  }, []);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={"400px"}
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* {new_toggle_tree(createDir, dir, handle_click_file, handle_click_dir)} */}
        {BasicTree(CreateTreeState(dir), did_click_node)}
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }} />
        </Header>
        <div hidden={view_type != view_type_image} style={{ height: "10px" }}>
          <ButtonGroup >
            <Button icon={<IoMdArrowRoundBack />} onClick={() => {
              get_prev_image();
            }} />
            <Button icon={<IoMdArrowRoundForward />} onClick={() => {
              get_next_image();
            }} />
          </ButtonGroup>
          <span style={{ marginLeft: "20px" }}>{path.parse(imagesrc).name}</span>
        </div>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Content hidden={view_type_markdown != view_type}>
            <Markdown >
              {content}
            </Markdown>
          </Content>
          <Content hidden={view_type_image != view_type}>
            <div>
              <img src={imagesrc}></img>
            </div>
          </Content>
          <Content hidden={view_type != view_type_code}>
            <Editor
              width="100%"
              height="90vh"
              defaultLanguage={convert_lang(filepath)}
              defaultValue=""
              // theme="vs-dark"
              value={content}
              path={filepath}
              language={convert_lang(filepath)}
            />
          </Content>
          {/* <CodeMirror
            hidden={!enabldcode}
            height="800px"
            theme={monokai}
            value={content}
            extensions={get_lang_extention(lang)} /> */}
        </Content>


      </Layout>
    </Layout>
  );

  function get_next_image() {
    let index = current_image_index();
    if (index == -1) return
    let j = (index + 1 + dir.files.length) % dir.files.length;
    for (let i = 0; i < dir.files.length; i++) {
      let file = dir.files[j];
      if (isPng(file.Name)) {
        open_file(file.Path);
        break;
      }
      j = (j + 1 + dir.files.length) % dir.files.length;
    }
  }

  function get_prev_image() {
    let index = current_image_index();
    if (index == -1) return
    let j = (index - 1 + dir.files.length) % dir.files.length;
    for (let i = 0; i < dir.files.length; i++) {
      let file = dir.files[j];
      if (isPng(file.Name)) {
        open_file(file.Path);
        break;
      }
      j = (j - 1 + dir.files.length) % dir.files.length;
    }
    console.log(index);
  }

  function current_image_index() {
    return dir.files.findIndex((file) => {
      let { name, ext } = path.parse(imagesrc)
      return name + ext === file.Name;
    });
  }
}

