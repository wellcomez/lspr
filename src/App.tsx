import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, ConfigProvider, Layout, Menu, theme } from 'antd';
import FolderTree, { testData } from 'react-folder-tree';
import {
  createFileTree,
  Directory,
  ToggleFileTree,
} from 'react-toggle-file-tree';
const { Header, Sider, Content } = Layout;

const BasicTree = () => {
  const onTreeStateChange = (state: any, event: any) => console.log(state, event);

  return (
    <FolderTree
      data={testData}
      onChange={onTreeStateChange}
    />
  );
};
const App: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const list = [
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
      localPath: '/',
      fileName: 'inch.txt',
      properties: {
        size: '1 bit',
        anything: 'possible',
        a: 'b',
      },
    }]
  const handleFileClick = () => {
    console.log('handleFileClick');
  };

  const handleDirectoryClick = () => {
    console.log('handleDirectoryClick');
  };
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ backgroundColor: '#FFFFFF', width: 400 }}>
        <ToggleFileTree
          list={createFileTree(list) as Directory}
          handleFileClick={handleFileClick}
          handleDirectoryClick={handleDirectoryClick}
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