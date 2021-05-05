import React, { RefObject } from "react";
import "./WorldMap.css";
import Translate from "./translate.json";
import * as d3 from "d3";
import { Select } from "antd";

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
  world: "none",
  asia: "translate(-2370, -650) scale(3.8)",
  europe: "translate(-1720, -366) scale(3.6)",
  north_america: "translate(-670, -170) scale(2.3)",
  south_america: "translate(-1350, -760) scale(3)",
  africa: "translate(-1820, -600) scale(3)",
  oceania: "translate(-5560, -1760) scale(6)",
};

class WorldMap extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: true,
      worldMap: {},
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

  handleChange = (e: any) => {
    const g = d3.select(".WorldMap").select("svg").select("g");
    g.attr("transform", AREA[e]);
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
      .text("无数据");
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
      return <div className="WorldMap"></div>;
    }

    const that = this;
    const type = this.props.type;
    const maxData: any = this.props.maxData;
    console.log("Start rendering world map, type " + type);

    const ref: RefObject<HTMLDivElement> = React.createRef();

    const width = document.getElementsByClassName("ant-tabs-content-holder")[0].clientWidth;
    const height = document.getElementsByClassName("ant-tabs-content-holder")[0].clientHeight;
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

    // 缩放相关
    const zoom = d3
      .zoom()
      .on("zoom", (event) => {
        svg.select("g").attr("transform", event.transform);
      })
      .scaleExtent([0.5, 6]);
    svg.call((d: any) => zoom(d));

    // 图例相关
    const color: any = d3
      .scaleQuantize([0, maxData[type]], PROFILES[type].color)
      .unknown("#eeeeee");
    this.renderLegend(PROFILES[type].color, type, width, height);

    // 地图相关
    const projection = d3.geoMercator();
    const path = d3.geoPath().projection(projection);

    projection.fitSize([width, height], this.state.worldMap);
    projection.scale(100);
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
            tip.append("p").text("暂无数据");
            return;
          }
          const latest = that.props.countryData.get(iso).data.slice(-1)[0];
          PROFILES[type].properties.forEach((element: any) => {
            tip
              .append("p")
              .text(
                translate[element] +
                  "：" +
                  (latest[element] ? parseInt(latest[element]).toLocaleString() : "暂无数据")
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
      .style("fill", (d: any) => {
        const iso: string = d.properties.iso_a3;
        if (that.props.countryData.has(iso) && that.props.countryData.get(iso).data.length > 0) {
          const latest = that.props.countryData.get(iso).data.slice(-1)[0];
          return color(latest[that.props.type]);
        }
        return color(NaN);
      })
      .attr("stroke", "#dddddd");

    return (
      <div className="WorldMap" ref={ref}>
        <Select defaultValue="world" onChange={this.handleChange}>
          <Option value="world">全球</Option>
          <Option value="asia">亚洲</Option>
          <Option value="europe">欧洲</Option>
          <Option value="north_america">北美洲</Option>
          <Option value="south_america">南美洲</Option>
          <Option value="africa">非洲</Option>
          <Option value="oceania">大洋洲</Option>
        </Select>
      </div>
    );
  }
}

export default WorldMap;
