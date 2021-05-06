import React, { RefObject } from "react";
import * as d3 from "d3";
import { Select, Row, Col, Table } from "antd";
import Translate from "../WorldMap/translate.json";

const COLUMNS = [
  {
    title: "国家",
    dataIndex: "chinese",
    key: "chinese",
    width: 100,
  },
];
const translate: any = Translate;

class LineChart extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    // 表格数据
    const tableData: any = [];
    props.data.forEach((value: any, key: any) => {
      if (value.iso.startsWith("OWID_") || value.data.length === 0) {
        return;
      }
      tableData.push({ iso: value.iso, chinese: value.chinese });
    });
    this.state = {
      tableData: tableData,
      selectedCountries: [props.country],
    };
  }

  onTableChange = (selectedRowKeys: any, selectedRows: any) => {
    let tableData: Array<object> = [...this.state.tableData];
    for (let i in selectedRowKeys) {
      const iso = selectedRowKeys[i];
      let target: Array<object> = [];
      for (let j in tableData) {
        const row: any = tableData[j];
        if (iso === row.iso) {
          target = tableData.splice(parseInt(j), 1);
          break;
        }
      }
      tableData.unshift(target[0]);
    }
    this.setState({ tableData: tableData, selectedCountries: selectedRowKeys });
  };

  render() {
    const ref: RefObject<HTMLDivElement> = React.createRef();
    const country = this.props.country;
    const data = this.props.data;
    const maxData = this.props.maxData;
    const type = this.props.type;
    if (!data) {
      console.log("Loading LineChart ...");
      return <div className="LineChart"></div>;
    }
    console.log("Start rendering line chart, country " + country + ", type " + type);
    const that = this;

    // 绘图
    const margin = { top: 20, right: 20, bottom: 50, left: 80 };
    const width = document.getElementsByClassName("ant-tabs-content-holder")[0].clientWidth - 400;
    const height = document.getElementsByClassName("ant-tabs-content-holder")[0].clientHeight;

    const beginDate: any = new Date(2020, 0, 22);
    const endDate: any = new Date();

    d3.select(".LineChart").selectAll("svg").remove();
    const svg = d3.select(".LineChart").append("svg").attr("width", width).attr("height", height);

    // 刻度
    const timeFormater = d3.timeFormat("%Y-%m-%d");
    const timeParser = d3.timeParse("%Y-%m-%d");
    const xScale = d3
      .scaleTime()
      .domain([beginDate, endDate])
      .range([0, width - margin.left - margin.right]);
    const yScale = d3
      .scaleLinear()
      .domain([0, maxData[type]])
      .range([height - margin.top - margin.bottom, 0]);
    svg
      .append("g")
      .attr("class", "axis")
      .attr(
        "transform",
        "translate(" + margin.left + "," + (height - margin.top - margin.bottom) + ")"
      )
      .call(d3.axisBottom(xScale).tickFormat((d: any) => timeFormater(d)))
      .selectAll("text")
      .attr("transform", "rotate(-65)");
    svg
      .append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(yScale))
      .attr("transform", "translate(" + margin.left + ",0)");

    // 数据
    const path = d3
      .line()
      .x((d: any) => xScale(timeParser(d.date) as any))
      .y((d: any) => yScale(d[type]));

    svg
      .append("path")
      .datum(data.get(country).data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("d", (d: any) => path(d));

    return (
      <div ref={ref}>
        <Row>
          <Col span={4}>
            <Table
              columns={COLUMNS}
              dataSource={this.state.tableData}
              pagination={false}
              rowKey="iso"
              rowSelection={{
                onChange: this.onTableChange,
                selectedRowKeys: this.state.selectedCountries,
                type: "checkbox",
              }}
              scroll={{ y: height }}
            ></Table>
          </Col>
          <Col span={20}>
            <div className="LineChart"></div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default LineChart;
