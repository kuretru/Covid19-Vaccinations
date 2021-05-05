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
  },
  {
    title: "总确诊人数",
    dataIndex: "total_cases",
    key: "total_cases",
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "当日新增确诊人数",
    dataIndex: "new_cases",
    key: "new_cases",
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "总致死人数",
    dataIndex: "total_deaths",
    key: "total_deaths",
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "当日新增致死人数",
    dataIndex: "new_deaths",
    key: "new_deaths",
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "ICU人数",
    dataIndex: "icu_patients",
    key: "icu_patients",
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "住院人数",
    dataIndex: "hosp_patients",
    key: "hosp_patients",
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "接种人次",
    dataIndex: "total_vaccinations",
    key: "total_vaccinations",
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "接种人数",
    dataIndex: "people_vaccinated",
    key: "people_vaccinated",
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "完成接种人数",
    dataIndex: "people_fully_vaccinated",
    key: "people_fully_vaccinated",
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "人口",
    dataIndex: "population",
    key: "population",
    render: (text: string) => {
      return text.replace(".0", "");
    },
  },
  {
    title: "人均土地面积",
    dataIndex: "population_density",
    key: "population_density",
  },
  {
    title: "平均年龄",
    dataIndex: "median_age",
    key: "median_age",
  },
  {
    title: "人均GDP",
    dataIndex: "gdp_per_capita",
    key: "gdp_per_capita",
  },
  {
    title: "人均寿命",
    dataIndex: "life_expectancy",
    key: "life_expectancy",
  },
];

class DataTable extends React.Component<any, any> {
  state = {
    country: "CHN",
  };
  constructor(props: any) {
    super(props);
  }

  handleChange = (e: any) => {
    this.setState({ country: e });
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

    let width = ref.current?.clientWidth;
    let height = ref.current?.clientHeight;
    console.log(ref);
    console.log("width", width);
    console.log("height", height);

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
              pagination={{ pageSize: 50 }}
              rowKey="date"
              scroll={{ x: "100%", y: 600 }}
              size="middle"
            ></Table>
          </Col>
        </Row>
      </div>
    );
  }
}

export default DataTable;
