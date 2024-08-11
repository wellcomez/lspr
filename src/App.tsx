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
import { all_language } from "./langType";
import { Dir, fileresp, BasicTree ,CreateTreeState} from "./filetree";
var imageset = new Set([".png", ".jpg", ".jpeg", ".gif", ".ico"]);
// var parsePath = require('parse-filepath');
const get_lang_extention = (lang: [any?]): [any?] => {
  return lang;
};


function get_lang_type(filePath: string): [any?] {
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


function NewFunction() {
  var a: Dir = { root: "/", rootname: "", files: [], parent: "" };
  const [collapsed, setCollapsed] = useState(false);
  // const [fileList, setFileList] = useState<FileItem[]>([]);
  const [dir, setDir] = useState(a);
  var default_ext: [any?] = [];
  const [lang, setLang] = useState(default_ext);
  const [imagesrc, setImagesrc] = useState("");
  const [enabldcode, setEnabledCode] = useState(true);
  const [content, setContent] = useState("");
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
        setEnabledCode(false);
        return;
      }
      setEnabledCode(true);
      let ext = get_lang_type(root);
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
        style={{ backgroundColor: "#FFFFFF", width: 400 }}
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
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Content hidden={enabldcode}>
            <img src={imagesrc}></img>
          </Content>
          <CodeMirror
            hidden={!enabldcode}
            height="800px"
            theme={monokai}
            value={content}
            extensions={get_lang_extention(lang)} />
          ;{/* {content} */}
        </Content>
      </Layout>
    </Layout>
  );
}

