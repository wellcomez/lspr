import React, { SetStateAction, useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import * as filepath from 'path'
import { Button, ConfigProvider, Layout, Menu, theme } from 'antd';
import {
  createFileTree,
  Directory,
  ToggleFileTree,
} from 'react-toggle-file-tree';
import axios from 'axios';
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
    const { fileName } = event as unknown as Directory
    console.log('Clicked on paragraph:', fileName);
    if ((fileName as unknown as string) == "..") {
      fetchData(dir.parent)
      return
    }
  }
  const handle_click_dir = (event: any) => {
    const { key } = event as unknown as Directory
    if (key as unknown as string == dir.rootname) {
      return
    }
    fetchData(dir.root + key)
    console.log('Clicked on paragraph:', event);
  }
  const fetchData = async (root: string) => {
    try {
      let u = url + root
      const response = await axios.get(u); // 使用 Axios 发起请求
      // const response = await fetch('https://api.example.com/data'); // 使用 fetch API 发起请求
      setData(response.data);
    } catch (error) {
      console.log(error)
    } finally {
    }
  };
  const url = "http://localhost:18080/path"
  useEffect(() => {
    fetchData(dir.root);
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
          Content
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;