import React from "react";
import logo from "./logo.svg";
import "./App.css";
import WorldMap from "./components/WorldMap/WorldMap";
import { Layout, Menu, Tabs, Slider, Row, Col, Tag, Button } from "antd";
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
  PlayCircleOutlined,
} from "@ant-design/icons";
import SubMenu from "antd/lib/menu/SubMenu";

const { Header, Footer, Sider, Content } = Layout;
const { TabPane } = Tabs;

class App extends React.Component {
  state = {
    type: "total_vaccinations",
  };
  handlerClick = (e: any) => {
    this.setState({ type: e.key });
  };
  render() {
    return (
      <div className="App">
        <Layout style={{ height: "100vh" }}>
          <Header className="header">
            <div className="logo">
              <img src={logo} className="App-logo" alt="logo" />
            </div>
            <h1>COVID-19数据可视化分析框架</h1>
          </Header>

          <Content style={{ padding: "25px 25px 0 25px" }}>
            <Layout
              className="site-layout-background"
              style={{ padding: "24px 0", height: "100%" }}
            >
              <Sider width={180}>
                <Menu
                  mode="inline"
                  onClick={this.handlerClick}
                  defaultOpenKeys={["epidemic", "vaccine", "others"]}
                  defaultSelectedKeys={["total_vaccinations"]}
                  style={{ height: "100%" }}
                >
                  <SubMenu key="epidemic" title="疫情数据" icon={<ReconciliationOutlined />}>
                    <Menu.Item key="total_cases" icon={<UserAddOutlined />}>
                      确诊数据
                    </Menu.Item>
                    <Menu.Item key="total_deaths" icon={<UserDeleteOutlined />}>
                      致死数据
                    </Menu.Item>
                  </SubMenu>
                  <SubMenu key="vaccine" title="疫苗数据" icon={<MedicineBoxOutlined />}>
                    <Menu.Item key="total_vaccinations" icon={<PushpinOutlined />}>
                      接种数据
                    </Menu.Item>
                    <Menu.Item key="people_vaccinated" icon={<SmileOutlined />}>
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
                    <Menu.Item key="gdp_per_capita" icon={<PercentageOutlined />}>
                      人均GDP
                    </Menu.Item>
                    <Menu.Item key="life_expectancy" icon={<ContactsOutlined />}>
                      平均寿命
                    </Menu.Item>
                  </SubMenu>
                </Menu>
              </Sider>
              <Content style={{ padding: "10px", minHeight: 280 }}>
                <Tabs defaultActiveKey="map" type="card">
                  <TabPane tab="地图" key="map">
                    <WorldMap type={this.state.type} />
                    <Row>
                      <Col span={2}>
                        <Button type="text" icon={<PlayCircleOutlined />} />
                      </Col>
                      <Col span={2}>
                        <Tag color="default">2020-01-28</Tag>
                      </Col>
                      <Col span={16}>
                        <Slider defaultValue={30} />
                      </Col>
                      <Col span={2}>
                        <Tag color="default">2021-04-30</Tag>
                      </Col>
                      <Col span={2}></Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="图表" key="chart">
                    图表
                  </TabPane>
                  <TabPane tab="表格" key="table">
                    表格
                  </TabPane>
                </Tabs>
              </Content>
            </Layout>
          </Content>
          <Footer>
            COVID-19 Data Visualization © ZJUT.{"{"}汪悟真，周文，杨敏慧{"}"}
          </Footer>
        </Layout>
      </div>
    );
  }
}

export default App;
