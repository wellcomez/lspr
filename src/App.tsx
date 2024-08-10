import React, { SetStateAction, useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, ConfigProvider, Layout, Menu, theme } from 'antd';
import CodeMirror from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { StreamLanguage } from '@codemirror/language';
import { go } from '@codemirror/legacy-modes/mode/go';
import { javascript } from '@codemirror/lang-javascript';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { json } from '@codemirror/lang-json';
import { cpp } from '@codemirror/lang-cpp';
import { css } from '@codemirror/lang-css';
import { python } from '@codemirror/lang-python';
import { yaml } from '@codemirror/lang-yaml';
import {
  Directory,
  ToggleFileTree,
} from 'react-toggle-file-tree';
import axios from 'axios';
import path from 'path-browserify';

// import parse from 'parse-filepath';


// var parsePath = require('parse-filepath');
const get_lang_extention = (lang: [any?]): [any?] => {
  return lang
}
class langType {
  constructor(extset: Array<string>, fileset: Array<string>, type: string, extension: [any]) {
    this.extset = new Set(extset)
    this.fileset = new Set(fileset)
    this.type = type
    this.extension = extension
  }
  extset: Set<string> = new Set()
  fileset: Set<string> = new Set()
  extension: [any]
  type: string
  is(filePath: string): [any] | undefined {
    const { base, ext } = path.parse(filePath)
    if (this.fileset.has(base)) {
      return this.extension
    }
    if (this.extset.has(ext)) {
      return this.extension
    }
    return undefined
  }
}
const go_ext = new langType([".go"], ["go.mod", "go.sum"], "go", [StreamLanguage.define(go)])
const cpp_ext = new langType([".c", ".cpp", ".h", ".hpp"], [], "cpp", [cpp()])
const python_ext = new langType([".py"], [], "python", [python()])
const js_ext = new langType([".js", ".ts", ".tsx"], [], "js", [javascript({ jsx: true })])
const css_ext = new langType([".css",], [], "css", [css()])
const json_ext = new langType([".json"], [], "json", [json()])
const yaml_ext = new langType([".yml", ".yaml"], [], "yaml", [yaml()])
const markdown_ext = new langType([".md"], [], "md", [markdown({ base: markdownLanguage, codeLanguages: languages })])
function get_lang_type(filePath: string): [any?] {
  var ss = [go_ext, js_ext, go_ext, json_ext, markdown_ext, python_ext, cpp_ext, css_ext, yaml_ext]
  for (let index = 0; index < ss.length; index++) {
    const element = ss[index];
    let t = element.is(filePath)
    if (t !== undefined) {
      return t
    }
  }
  return []
}

const { Header, Sider, Content } = Layout;
type fileresp = {
  Path: string
  IsDir: boolean
  Name: string
  dirname: string
  parent: string
}
type Dir = {
  root: string;
  rootname: string;
  files: fileresp[];
  parent: string
};

type FileItem = {
  localPath: string;
  fileName: string;
  IsDir: boolean;
  properties: {
    size: string;
    anything: string;
    a: string;
  };
};


const App: React.FC = () => {
  var a: Dir = { root: "/", rootname: "", files: [], parent: "" };
  const [collapsed, setCollapsed] = useState(false);
  // const [fileList, setFileList] = useState<FileItem[]>([]);
  const [dir, setDir] = useState(a);
  var default_ext: [any?] = []
  const [lang, setLang] = useState(default_ext);
  const [imagesrc, setImagesrc] = useState("")
  const [enabldcode, setEnabledCode] = useState(true);
  const [content, setContent] = useState("");
  // const [rootname, setRootName] = useState("");
  // const [root, setRoot] = useState("/");
  const setData = (data: Dir) => {
    setDir(data);
    // let aa: FileItem[] = []
    // setRootName(data.rootname)
    // setRoot(data.root)
    // data.files.forEach((f: fileresp) => {
    //   let a = {
    //     IsDir: f.IsDir,
    //     localPath: f.parent,
    //     fileName: f.Name,
    //     properties: {
    //       size: '1 bit',
    //       anything: 'possible',
    //       a: 'b',
    //     },
    //   }
    //   aa.push(a)
    // });
    // setFileList(aa)
  }
  function createDir(list: Dir): Directory {
    const expectedFileTree: Directory = { files: [] };
    const root: Directory = { files: [] };
    let a = {
      localPath: "..",
      fileName: "..",
      properties: {
        size: '1 bit',
        anything: 'possible',
        a: 'b',
      },
    }
    root.files.push(a)
    // root[".."] = { files: [] }

    expectedFileTree[list.rootname] = root
    dir.files.forEach(f => {
      if (f.IsDir) {
        root[f.Name] = { files: [] }
      } else {
        let a = {
          IsDir: f.IsDir,
          localPath: f.parent,
          fileName: f.Name,
          properties: {
            size: '1 bit',
            anything: 'possible',
            a: 'b',
          },
        }
        root.files.push(a)
      }
    });
    return expectedFileTree
  }
  // function createFileTree2(list: FileItem[]): Directory {
  //   const expectedFileTree: Directory = { files: [] };
  //   for (const file of list) {
  //     const filePathParts = file.localPath.split('/').filter(Boolean);
  //     let current = expectedFileTree;
  //     for (const part of filePathParts) {
  //       if (!current[part]) {
  //         current[part] = { files: [] };
  //       }
  //       current = current[part] as Directory;
  //     }
  //     if (file.IsDir && filePathParts.length > 1) {
  //       continue
  //     }
  //     current.files.push(file);
  //   }
  //   return expectedFileTree;
  // }
  const handle_click_file = (event: any) => {
    const file = event as unknown as FileItem
    let name = file.fileName
    if (name == "..") {
      open_dir(dir.parent)
    } else {
      if (dir.root.length == 1) {
        open_file("/" + name)
      } else {
        var path = [dir.root, name].join("/")
        open_file(path)
      }
    }
  }
  const handle_click_dir = (event: any) => {
    const { key } = event as unknown as Directory
    if (key as unknown as string == dir.rootname) {
      return
    }
    open_dir(dir.root + key)
    console.log('Clicked on paragraph:', event);
  }
  function isPng(fileName: string): boolean {
    // 使用正则表达式匹配文件名中的扩展名部分
    const fileExtension = fileName.match(/\.(\w+)$/);
    // 检查是否有匹配结果并且扩展名是否为 "png"
    return fileExtension ? fileExtension[1].toLowerCase() === 'png' : false;
  }

  const open_file = async (root: string) => {
    try {
      let u = url_open_file + root
      if (isPng(u)) {
        setImagesrc(u)
        setEnabledCode(false)
        return
      }
      setEnabledCode(true)
      let ext = get_lang_type(root)
      setLang(ext)
      const response = await axios.get(u, { responseType: 'text' }); // 使用 Axios 发起请
      console.log(response.data)
      setContent(response.data)
    } catch (error) {
      console.log(error)
    } finally {
    }
  };
  const open_dir = async (root: string) => {
    try {
      let u = url_open_dir + root
      const response = await axios.get(u); // 使用 Axios 发起请求
      // const response = await fetch('https://api.example.com/data'); // 使用 fetch API 发起请求
      setData(response.data);
    } catch (error) {
      console.log(error)
    } finally {
    }
  };
  const url_open_dir = "http://localhost:18080/path"
  const url_open_file = "http://localhost:18080/open"
  useEffect(() => {
    open_dir(dir.root);
  }, []);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ backgroundColor: '#FFFFFF', width: 400 }}>
        <ToggleFileTree
          list={createDir(dir) as Directory}
          handleFileClick={handle_click_file}
          handleDirectoryClick={handle_click_dir}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Content hidden={enabldcode}><img src={imagesrc}></img></Content>
          <CodeMirror
            hidden={!enabldcode}
            height='800px'
            theme={monokai}
            value={content}
            extensions={get_lang_extention(lang)} />;
          {/* {content} */}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;