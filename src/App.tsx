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
import FolderTree, { NodeData, testData } from 'react-folder-tree';
import 'react-folder-tree/dist/style.css';
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
import { PiFilePngFill } from "react-icons/pi";
import { MdHtml } from "react-icons/md";
import { PiFileCssFill } from "react-icons/pi";
import { BiLogoTypescript } from "react-icons/bi";
import { SiGoland } from "react-icons/si";
import { SiMarkdown } from "react-icons/si";
import { SiTypescript } from "react-icons/si";
import { IconType } from 'react-icons/lib/cjs/iconBase';
import { DiPython } from "react-icons/di";
import { SiYaml } from "react-icons/si";

var imageset = new Set(['.png', '.jpg', '.jpeg', '.gif', '.ico'])
const BasicTree = (testData: NodeDataFile, open: (file: fileresp) => void) => {
  const FileIcon = (prop: { onClick: () => void, nodeData: NodeData }) => {
    // const { path, name, checked, isOpen, ...restData } = prop.nodeData;

    // custom event handler
    const handleClick = () => {
      // doSthBad({ path, name, checked, isOpen, ...restData });

      prop.onClick();
    };
    let name = prop.nodeData.name;
    // console.log(prop.nodeData)
    var ext = path.parse(name).ext
    if (ext === ".ts" || ext === ".tsx") {
      return <BiLogoTypescript onClick={handleClick} />
    }
    if (ext === ".html") {
      return <MdHtml onClick={handleClick} />
    }
    if (ext === ".png") {
      return <PiFilePngFill onClick={handleClick} />
    }
    for (let i = 0; i <all_language.length;i++){
      if (all_language[i].is(name))
      {
        let tag = all_language[i].icon
        let prop={onClick:handleClick}
        return tag(prop)
        // return <tag onClick={handleClick} />;
      }
    }
    // return <MySvgIcon/>
    // custom Style
    return <FaFileCode onClick={handleClick} />;
  };
  const onNameClick = (opts: { defaultOnClick: () => void, nodeData: NodeData }) => {
    opts.defaultOnClick();

    const {
      // internal data
      path, name, checked, isOpen,
      // custom data
      url, ...whateverRest
    } = opts.nodeData;
    console.log(path, name, checked, isOpen, whateverRest)
    // download(url);
    open(opts.nodeData.file)
  };
  const onTreeStateChange = (state: any, event: any) => {
    console.log(state, event);
  }
  return (
    <FolderTree
      data={testData}
      showCheckbox={false}
      onChange={onTreeStateChange}
      onNameClick={onNameClick}
      readOnly
      iconComponents={{
        FileIcon,
        /* other custom icons ... */
      }}
    />
  );
};
// import parse from 'parse-filepath';


// var parsePath = require('parse-filepath');
const get_lang_extention = (lang: [any?]): [any?] => {
  return lang
}
class NodeDataFile implements NodeData {
  [key: string]: any;
  checked?: (0 | 1 | 0.5) | undefined;
  children?: NodeData[] | undefined;
  isOpen?: boolean | undefined;
  name: string;
  file: fileresp;
  constructor(name: string, file: fileresp) {
    this.name = name;
    this.file = file
    this.children = []
  }
}
function CreateTreeState(dir: Dir): NodeDataFile {
  var Path = path.join(dir.parent, dir.root)
  var f: fileresp = { Path: Path, IsDir: false, Name: dir.rootname, parent: dir.parent, dirname: dir.rootname }
  var ret = new NodeDataFile(dir.rootname, f)
  if (ret.children) {
    let p1 = path.parse(dir.parent)
    var parent_file: fileresp =
      { Path: dir.parent, IsDir: true, Name: "..", parent: p1.dir, dirname: p1.base }
    var parent: NodeDataFile = { name: parent_file.Name, file: parent_file, children: [] }
    parent.isOpen = false
    ret.children.push(parent)

  }
  var b = dir.files.sort((a, b) => {
    if (a.IsDir !== b.IsDir && a.IsDir) {
      return -1
    }
    return a.Name.localeCompare(b.Name)
  }
  )
  b.forEach(element => {
    var a: NodeDataFile = { name: element.Name, file: element }
    if (ret.children) {
      if (element.IsDir) {
        a.children = []
        a.isOpen = false
      }
      ret.children.push(a)
    }
  });
  return ret
}
class langType {
  constructor(extset: Array<string>, fileset: Array<string>, type: string, extension: [any?],icon :IconType) {
    this.extset = new Set(extset)
    this.fileset = new Set(fileset)
    this.type = type
    this.extension = extension
    this.icon = icon
  }
  icon :IconType
  extset: Set<string> = new Set()
  fileset: Set<string> = new Set()
  extension: [any?]
  type: string
  is(filePath: string): [any?] | undefined {
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
const go_ext = new langType([".go"], ["go.mod", "go.sum"], "go", [StreamLanguage.define(go)],SiGoland)
const cpp_ext = new langType([".c", ".cpp", ".h", ".hpp"], [], "cpp", [cpp()],TbBrandCpp)
const python_ext = new langType([".py"], [], "python", [python()],DiPython)
const js_ext = new langType([".js", ".ts", ".tsx"], [], "js", [javascript({ jsx: true })],DiJavascript1)
const css_ext = new langType([".css",], [], "css", [css()],PiFileCssFill)
const json_ext = new langType([".json"], [], "json", [json()],TbJson)
const yaml_ext = new langType([".yml", ".yaml"], [], "yaml", [yaml()],SiYaml)
const git_ext = new langType([".ignore"], [".gitignore"], "git", [],FaGit)
const markdown_ext = new langType([".md"], [], "md", [markdown({ base: markdownLanguage, codeLanguages: languages })],SiMarkdown)
var all_language = [go_ext, js_ext, go_ext, json_ext, markdown_ext, python_ext, cpp_ext, css_ext, yaml_ext,git_ext]
function get_lang_type(filePath: string): [any?] {
  for (let index = 0; index < all_language.length; index++) {
    const element = all_language[index];
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
  const handle_click_file = (event: any) => {
    const file = event as unknown as FileItem
    let name = file.fileName
    if (name === "..") {
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
    var ext = path.parse(fileName).ext
    return imageset.has(ext)
  }

  const open_file = async (root: string) => {
    let u = url_open_file + root
    try {
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
  const did_click_node = (node: fileresp) => {
    if (node.IsDir) {
      open_dir(node.Path)
    } else {
      open_file(node.Path)
    }
  }
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

function new_toggle_tree(createDir: (list: Dir) => Directory, dir: Dir, handle_click_file: (event: any) => void, handle_click_dir: (event: any) => void) {
  return <ToggleFileTree
    list={createDir(dir) as Directory}
    handleFileClick={handle_click_file}
    handleDirectoryClick={handle_click_dir} />;
}
