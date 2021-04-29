import React, { FC } from "react";
import logo from "./logo.svg";
import "./App.css";
import WorldMap from "./components/WorldMap/WorldMap";
import { Layout, Menu } from "antd";
import {
  ReconciliationOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  MedicineBoxOutlined,
  PushpinOutlined,
  SmileOutlined,
  PaperClipOutlined,
  TeamOutlined,
  PayCircleOutlined,
  PercentageOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import SubMenu from "antd/lib/menu/SubMenu";

const { Header, Footer, Sider, Content } = Layout;

const App: FC = () => (
  <div className="App">
    <Layout style={{ height: "100vh" }}>
      <Header className="header">
        <div className="logo">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <h1>COVID-19数据可视化分析框架</h1>
      </Header>

      <Content style={{ padding: "25px 25px 0 25px" }}>
        <Layout className="site-layout-background" style={{ padding: "24px 0", height: "100%" }}>
          <Sider width={180}>
            <Menu
              mode="inline"
              defaultOpenKeys={["vaccine"]}
              defaultSelectedKeys={["vaccinations"]}
              style={{ height: "100%" }}
            >
              <SubMenu key="epidemic" title="疫情数据" icon={<ReconciliationOutlined />}>
                <Menu.Item key="confirmed" icon={<UserAddOutlined />}>
                  确诊数据
                </Menu.Item>
                <Menu.Item key="deaths" icon={<UserDeleteOutlined />}>
                  致死数据
                </Menu.Item>
              </SubMenu>
              <SubMenu key="vaccine" title="疫苗数据" icon={<MedicineBoxOutlined />}>
                <Menu.Item key="vaccinations" icon={<PushpinOutlined />}>
                  接种数据
                </Menu.Item>
                <Menu.Item key="fully_vaccinated" icon={<SmileOutlined />}>
                  完成接种数据
                </Menu.Item>
              </SubMenu>
              <SubMenu key="others" title="其他数据" icon={<PaperClipOutlined />}>
                <Menu.Item key="population" icon={<TeamOutlined />}>
                  人口数据
                </Menu.Item>
                <Menu.Item key="median_age" icon={<PayCircleOutlined />}>
                  平均年龄
                </Menu.Item>
                <Menu.Item key="gdp" icon={<PercentageOutlined />}>
                  人均GDP
                </Menu.Item>
                <Menu.Item key="life_expectancy" icon={<ContactsOutlined />}>
                  平均寿命
                </Menu.Item>
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
