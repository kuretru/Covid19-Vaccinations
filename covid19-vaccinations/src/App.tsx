import React, { FC } from "react";
import logo from "./logo.svg";
import "./App.css";
import WorldMap from "./components/WorldMap/WorldMap";
import { Layout, Menu } from "antd";
import { UserAddOutlined, SmileOutlined } from "@ant-design/icons";
import SubMenu from "antd/lib/menu/SubMenu";

const { Header, Footer, Sider, Content } = Layout;

const App: FC = () => (
  <div className="App">
    <Layout>
      <Header className="header">
        <div className="logo">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <h1>COVID-19疫苗数据可视化</h1>
      </Header>
      <Content style={{ padding: "25px 25px 0 25px" }}>
        <Layout className="site-layout-background" style={{ padding: "24px 0" }}>
          <Sider width={180}>
            <Menu
              mode="inline"
              defaultOpenKeys={["vaccinated"]}
              defaultSelectedKeys={["vaccineDoses"]}
              style={{ height: "100%" }}
            >
              <SubMenu key="vaccinated" title="疫苗数据">
                <Menu.Item key="vaccineDoses" icon={<UserAddOutlined />}>
                  疫苗注射情况
                </Menu.Item>
                <Menu.Item key="2" icon={<SmileOutlined />}>
                  完成注射
                </Menu.Item>
              </SubMenu>
              <SubMenu key="confirmed" title="确诊数据">
                <Menu.Item key="3">疫苗数据</Menu.Item>
                <Menu.Item key="4">确诊数据</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Content style={{ padding: "10px", minHeight: 280 }}>
            <div className="chart">
              <WorldMap />
            </div>
          </Content>
        </Layout>
      </Content>
      <Footer>
        COVID-19 Visual Big Data © ZJUT.{"{"}汪悟真，周文，杨敏慧{"}"}
      </Footer>
    </Layout>
  </div>
);

export default App;
