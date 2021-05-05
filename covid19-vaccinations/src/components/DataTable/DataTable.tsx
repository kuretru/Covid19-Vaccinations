import React, { RefObject } from "react";
import { Row, Col, Table, Select, Tag } from "antd";
import "./DataTable.css";

const { Option } = Select;

const COLUMNS = [
  {
    title: "日期",
    dataIndex: "date",
    key: "date",
    width: 105,
    fixed: "left" as const,
  },
  {
    title: "总确诊人数",
    dataIndex: "total_cases",
    key: "total_cases",
    width: 100,
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "当日新增确诊人数",
    dataIndex: "new_cases",
    key: "new_cases",
    width: 120,
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "总致死人数",
    dataIndex: "total_deaths",
    key: "total_deaths",
    width: 100,
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "当日新增致死人数",
    dataIndex: "new_deaths",
    key: "new_deaths",
    width: 120,
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "ICU人数",
    dataIndex: "icu_patients",
    key: "icu_patients",
    width: 100,
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "住院人数",
    dataIndex: "hosp_patients",
    key: "hosp_patients",
    width: 100,
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "接种人次",
    dataIndex: "total_vaccinations",
    key: "total_vaccinations",
    width: 100,
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "接种人数",
    dataIndex: "people_vaccinated",
    key: "people_vaccinated",
    width: 100,
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "完成接种人数",
    dataIndex: "people_fully_vaccinated",
    key: "people_fully_vaccinated",
    width: 100,
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "人口",
    dataIndex: "population",
    key: "population",
    width: 100,
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "人均土地面积",
    dataIndex: "population_density",
    key: "population_density",
    width: 100,
  },
  {
    title: "平均年龄",
    dataIndex: "median_age",
    key: "median_age",
    width: 100,
  },
  {
    title: "人均GDP",
    dataIndex: "gdp_per_capita",
    key: "gdp_per_capita",
    width: 100,
  },
  {
    title: "人均寿命",
    dataIndex: "life_expectancy",
    key: "life_expectancy",
    width: 100,
  },
];

class DataTable extends React.Component<any, any> {
  state = {
    country: "CHN",
    pageSize: 50,
  };
  constructor(props: any) {
    super(props);
  }

  handleChange = (e: any) => {
    this.setState({ country: e });
  };

  onTableChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    if (extra.action === "paginate") {
      this.setState({ pageSize: pagination.pageSize });
    }
  };

  render() {
    const ref: RefObject<HTMLDivElement> = React.createRef();
    const data: any = this.props.data;
    if (!data.has(this.state.country)) {
      return (
        <div className="DataTable" ref={ref}>
          <Table bordered columns={COLUMNS}></Table>
        </div>
      );
    }
    const options: any = [];
    data.forEach((value: any, key: any) => {
      if (value.iso.startsWith("OWID_") || value.data.length === 0) {
        return;
      }
      options.push({ iso: value.iso, chinese: value.chinese });
    });

    const width = document.getElementsByClassName("ant-tabs-content-holder")[0].clientWidth;
    const height = document.getElementsByClassName("ant-tabs-content-holder")[0].clientHeight;

    return (
      <div className="DataTable" ref={ref}>
        <Row>
          <Col span={2}>
            <Tag color="default">选择国家：</Tag>
          </Col>
          <Col span={4}>
            <Select
              defaultValue="CHN"
              onChange={this.handleChange}
              optionFilterProp="children"
              placeholder={"选择一个国家"}
              showSearch
              style={{ width: 150 }}
            >
              {options.map((item: any) => (
                <Option key={item.iso} value={item.iso}>
                  {item.chinese}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              bordered
              columns={COLUMNS}
              dataSource={data.get(this.state.country).data.reverse()}
              pagination={{ pageSize: this.state.pageSize }}
              onChange={this.onTableChange}
              rowKey="date"
              scroll={{ x: 1785, y: height - 120 }}
              size="middle"
            ></Table>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DataTable;
