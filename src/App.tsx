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
import FolderTree, { testData } from 'react-folder-tree';
import {
  createFileTree,
  Directory,
  ToggleFileTree,
} from 'react-toggle-file-tree';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
const { Header, Sider, Content } = Layout;
type fileresp = {
  Path: string
  IsDir: boolean
  Name: string
  dirname: string
  parent: string
}

const BasicTree = () => {
  const onTreeStateChange = (state: any, event: any) => console.log(state, event);

  return (
    <FolderTree
      data={testData}
      onChange={onTreeStateChange}
    />
  );
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
const newLocal = [
  {
    localPath: '/',
    fileName: 'inch.txt',
    properties: {
      size: '1 bit',
      anything: 'possible',
      a: 'b',
    },
  },
  {
    localPath: '/a',
    fileName: 'inch.txt',
    properties: {
      size: '1 bit',
      anything: 'possible',
      a: 'b',
    },
  }
];
function createFileTree2(list: FileItem[]): Directory {
  const expectedFileTree: Directory = { files: [] };
  for (const file of list) {
    const filePathParts = file.localPath.split('/').filter(Boolean);
    let current = expectedFileTree;
    for (const part of filePathParts) {
      if (!current[part]) {
        current[part] = { files: [] };
      }
      current = current[part] as Directory;
    }
    if (file.IsDir && filePathParts.length > 1) {
      continue
    }
    current.files.push(file);
  }
  return expectedFileTree;
}

const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [fileList, setFileList] = useState<FileItem[]>([]);

  const setData = (data: any[any]) => {
    let aa: FileItem[] = []
    data.forEach((f: fileresp) => {
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
      aa.push(a)
    });
    setFileList(aa)
  }
  const url = "http://localhost:18080/path/"
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url); // 使用 Axios 发起请求
        // const response = await fetch('https://api.example.com/data'); // 使用 fetch API 发起请求
        setData(response.data);
      } catch (error) {
        console.log(error)
      } finally {
      }
    };

    fetchData();
  }, []);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ backgroundColor: '#FFFFFF', width: 400 }}>
        <ToggleFileTree
          list={createFileTree2(fileList) as Directory}
          handleFileClick={(event) => {
            const { fileName } = event as unknown as Directory
            console.log('Clicked on paragraph:', fileName);
          }}
          handleDirectoryClick={(event) => {
            const { key } = event as unknown as Directory
            console.log('Clicked on paragraph:', event);
          }}
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