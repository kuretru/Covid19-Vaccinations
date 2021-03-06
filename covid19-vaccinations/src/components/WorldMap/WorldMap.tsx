import React, { RefObject } from "react";
import * as d3 from "d3";
import { Select, Row, Col, Button, Slider } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons";
import "./WorldMap.css";
import Translate from "./translate.json";

const { Option } = Select;

const WORLD_MAP = "/data/world-map-small.geo.json";

const translate: any = Translate;
const PROFILES: any = {
  total_cases: {
    color: d3.schemeOranges[9],
    properties: ["total_cases", "total_deaths", "hosp_patients"],
  },
  total_deaths: {
    color: d3.schemeReds[9],
    properties: ["total_cases", "total_deaths", "hosp_patients"],
  },
  total_vaccinations: {
    color: d3.schemeBlues[9],
    properties: ["total_vaccinations", "people_vaccinated", "people_fully_vaccinated"],
  },
  people_vaccinated: {
    color: d3.schemeGnBu[9],
    properties: ["total_vaccinations", "people_vaccinated", "people_fully_vaccinated"],
  },
  population: {
    color: d3.schemePuBu[9],
    properties: ["population", "population_density"],
  },
  median_age: {
    color: d3.schemeGreens[9],
    properties: ["median_age", "aged_65_older", "aged_70_older"],
  },
  gdp_per_capita: {
    color: d3.schemeYlGnBu[9],
    properties: ["gdp_per_capita", "hospital_beds_per_thousand", "handwashing_facilities"],
  },
  life_expectancy: {
    color: d3.schemeRdPu[9],
    properties: ["life_expectancy", "cardiovasc_death_rate", "diabetes_prevalence"],
  },
};
const AREA: any = {
  world: { width: 0, height: 0, scale: 1 },
  asia: { width: -1352, height: -812, scale: 3 },
  europe: { width: -1517, height: -762, scale: 4 },
  north_america: { width: -322, height: -312, scale: 2.3 },
  south_america: { width: -440, height: -844, scale: 2.3 },
  africa: { width: -685, height: -652, scale: 2.3 },
  oceania: { width: -2150, height: -1737, scale: 4 },
};

const TIME_FORMATTER = d3.timeFormat("%Y-%m-%d");
const BEGIN_DATE: Date = new Date(2020, 0, 22);
const END_DATE: Date = new Date();

class WorldMap extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    const max: number = Math.floor(END_DATE.getTime() / 86400000);
    this.state = {
      buttonIcon: <PlayCircleOutlined />,
      isLoading: true,
      isPlaying: false,
      worldMap: {},
      date: TIME_FORMATTER(new Date()),
      sliderMin: Math.floor(BEGIN_DATE.getTime() / 86400000) + 1,
      sliderMax: max,
      sliderValue: max - 1,
    };
    this.fetchData();
  }

  fetchData() {
    d3.json(WORLD_MAP)
      .then((data: any) => {
        this.setState({ worldMap: data });
        console.log("Fetch world map done");
      })
      .then(() => {
        this.setState({ isLoading: false });
      });
  }

  onButtonClick = (e: any) => {
    console.log(this.state.sliderValue);
    console.log(this.state.sliderMax);
    if (this.state.isPlaying) {
      this.setState({ buttonIcon: <PlayCircleOutlined />, isPlaying: false });
    } else {
      this.setState({ buttonIcon: <PauseCircleOutlined />, isPlaying: true });
      if (this.state.sliderValue + 1 >= this.state.sliderMax) {
        this.setState({ sliderValue: this.state.sliderMin });
      }
      const timer = setInterval(() => {
        const value: any = this.state.sliderValue;
        if (!this.state.isPlaying || value >= this.state.sliderMax) {
          this.setState({ buttonIcon: <PlayCircleOutlined />, isPlaying: false });
          clearInterval(timer);
        }
        this.setState({ date: TIME_FORMATTER(new Date(value * 86400000)), sliderValue: value + 1 });
      }, 1);
    }
  };

  onSliderAfterChange = (e: any) => {
    this.setState({ date: TIME_FORMATTER(new Date(e * 86400000)), sliderValue: e });
  };

  onSliderChange = (e: any) => {
    this.setState({ sliderValue: e });
  };

  sliderFormatter: any = (e: any) => {
    return TIME_FORMATTER(new Date(e * 86400000));
  };

  onSelectChange = (e: any) => {
    const g = d3.select(".WorldMap").select("svg").select("g");
    const width: number = document.getElementsByClassName("ant-tabs-content-holder")[0].clientWidth;
    const height: number =
      document.getElementsByClassName("ant-tabs-content-holder")[0].clientHeight - 150;
    const scaleWidth: number = width / 961;
    const scaleHeight: number = height / 621;
    const area: any = AREA[e];
    if (area.width === 0 && area.height === 0) {
      g.attr("transform", "none");
    } else {
      g.attr(
        "transform",
        "translate(" +
          area.width * scaleWidth +
          "," +
          area.height * scaleHeight +
          ") scale(" +
          area.scale +
          ")"
      );
    }
  };

  renderLegend(color: ReadonlyArray<string>, type: any, width: any, height: any) {
    const legend = d3
      .select(".WorldMap")
      .append("svg")
      .attr("width", width)
      .attr("height", 50)
      .append("g");
    legend
      .append("text")
      .attr("class", "label")
      .attr("x", width / 2 - 300 + 93)
      .attr("y", 20)
      .text("?????????");
    legend
      .append("text")
      .attr("class", "label")
      .attr("x", width / 2 - 300 + 165)
      .attr("y", 20)
      .text("0");
    legend
      .append("text")
      .attr("class", "label")
      .attr("x", width / 2 - 300 + 380)
      .attr("y", 20)
      .text((this.props.maxData[type] / 2).toLocaleString());
    legend
      .append("text")
      .attr("class", "label")
      .attr("x", width / 2 - 300 + 570)
      .attr("y", 20)
      .text(this.props.maxData[type].toLocaleString());

    legend
      .append("rect")
      .attr("x", width / 2 - 300 + 50)
      .attr("y", 30)
      .attr("width", 45)
      .attr("height", 15)
      .attr("stroke", "black")
      .style("fill", "#eeeeee");
    for (let i = 0; i < d3.schemeBlues[9].length; i++) {
      legend
        .append("rect")
        .attr("x", width / 2 - 300 + 140 + 45 * i)
        .attr("y", 30)
        .attr("width", 45)
        .attr("height", 15)
        .attr("stroke", "black")
        .style("fill", color[i]);
    }
  }

  render() {
    if (this.state.isLoading || !this.props.type) {
      console.log("Loading WorldMap ...");
      return (
        <div>
          <div className="WorldMap"></div>
        </div>
      );
    }

    const that = this;
    const type = this.props.type;
    const dailyData = this.props.dailyData;
    const maxData: any = this.props.maxData;
    console.log("Start rendering world map, type " + type);

    const ref: RefObject<HTMLDivElement> = React.createRef();

    const width = document.getElementsByClassName("ant-tabs-content-holder")[0].clientWidth;
    const height = document.getElementsByClassName("ant-tabs-content-holder")[0].clientHeight - 50;
    d3.select(".WorldMap").selectAll("svg").remove();

    const svg = d3
      .select(".WorldMap")
      .append("svg")
      .attr("width", width)
      .attr("height", height - 100);

    // ToolTip
    d3.selectAll(".tooltip").remove();
    const tip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
    tip.append("span");

    // ????????????
    const zoom = d3
      .zoom()
      .on("zoom", (event) => {
        svg.select("g").attr("transform", event.transform);
      })
      .scaleExtent([0.5, 6]);
    svg.call((d: any) => zoom(d));

    // ????????????
    const color: any = d3
      .scaleQuantize([0, maxData[type]], PROFILES[type].color)
      .unknown("#eeeeee");
    this.renderLegend(PROFILES[type].color, type, width, height);

    // ????????????
    const projection = d3.geoMercator();
    const path = d3.geoPath().projection(projection);

    // ??????
    projection.fitSize([width, height - 100], this.state.worldMap);
    svg
      .append("g")
      .selectAll("path")
      .data(this.state.worldMap.features)
      .join((enter) => {
        const p = enter.append("path");
        p.on("mouseover", function (event, d: any) {
          const iso = d.properties.iso_a3;
          d3.select(this).transition().duration(200).style("opacity", 0.6).attr("stroke", "black");
          tip.transition().duration(200).style("opacity", 0.9);
          tip.style("left", event.pageX + "px").style("top", event.pageY - 28 + "px");

          if (!that.props.countryData.has(iso)) {
            return;
          }
          tip.select("span").text(that.props.countryData.get(iso).chinese);
          if (that.props.countryData.get(iso).data.length === 0) {
            tip.append("p").text("????????????");
            return;
          }
          const latest = that.props.countryData.get(iso).data.slice(-1)[0];
          PROFILES[type].properties.forEach((element: any) => {
            tip
              .append("p")
              .text(
                translate[element] +
                  "???" +
                  (latest[element] ? parseInt(latest[element]).toLocaleString() : "????????????")
              );
          });
          d3.select(".WorldMap").select("svg").style("cursor", "pointer");
        });
        p.on("mouseout", function () {
          d3.select(this).transition().duration(500).style("opacity", 1).attr("stroke", "#dddddd");
          tip.transition().duration(500).style("opacity", 0);
          tip.selectAll("p").remove();
          d3.select(".WorldMap").select("svg").style("cursor", "auto");
        });
        p.on("click", function (event, d: any) {
          const iso = d.properties.iso_a3;
          that.props.onCountryClick(iso);
        });
        return p;
      })
      .attr("d", (d: any) => path(d))
      .attr("id", (d: any) => d.properties.iso_a3)
      .style("fill", (d: any) => {
        const iso: string = d.properties.iso_a3;
        const date: string = that.state.date;
        if (dailyData.has(date) && dailyData.get(date).has(iso)) {
          const value = dailyData.get(date).get(iso);
          return color(value[that.props.type]);
        }
        return color(NaN);
      })
      .attr("stroke", "#dddddd");

    const marks: any = {};
    marks[this.state.sliderMin] = TIME_FORMATTER(new Date(this.state.sliderMin * 86400000));
    marks[18444] = TIME_FORMATTER(new Date(18444 * 86400000)); // 2020-07-01
    marks[18628] = TIME_FORMATTER(new Date(18628 * 86400000)); // 2021-01-01
    marks[this.state.sliderMax] = TIME_FORMATTER(new Date(this.state.sliderMax * 86400000));
    return (
      <div>
        <div className="WorldMap" ref={ref}>
          <Select defaultValue="world" onChange={this.onSelectChange} style={{ width: 100 }}>
            <Option value="world">??????</Option>
            <Option value="asia">??????</Option>
            <Option value="europe">??????</Option>
            <Option value="north_america">?????????</Option>
            <Option value="south_america">?????????</Option>
            <Option value="africa">??????</Option>
            <Option value="oceania">?????????</Option>
          </Select>
        </div>
        <Row>
          <Col span={2}>
            <Button icon={this.state.buttonIcon} onClick={this.onButtonClick} type="text" />
          </Col>
          <Col span={20}>
            <Slider
              defaultValue={this.state.sliderMax - 1}
              tipFormatter={this.sliderFormatter}
              marks={marks}
              max={this.state.sliderMax}
              min={this.state.sliderMin + 1}
              onAfterChange={this.onSliderAfterChange}
              onChange={this.onSliderChange}
              tooltipVisible={true}
              value={this.state.sliderValue}
            />
          </Col>
          <Col span={2}></Col>
        </Row>
      </div>
    );
  }
}

export default WorldMap;
