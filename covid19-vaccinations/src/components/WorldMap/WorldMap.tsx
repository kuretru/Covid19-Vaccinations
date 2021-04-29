import React, { RefObject } from "react";
import "./WorldMap.css";
import * as d3 from "d3";

const WORLD_MAP = "/data/world-map.geo.json";
const COUNTRY_NAME = "/data/country_name.csv";
// const ALL_DATA = "https://github.com/owid/covid-19-data/raw/master/public/data/owid-covid-data.csv";
const ALL_DATA = "/data/owid-covid-data.csv";

const types = [
  "total_cases",
  "total_deaths",
  "total_vaccinations",
  "people_vaccinated",
  "population",
  "median_age",
  "gdp_per_capita",
  "life_expectancy",
];

const colors: any = {
  total_cases: d3.schemeOranges[9],
  total_deaths: d3.schemeReds[9],
  total_vaccinations: d3.schemeBlues[9],
  people_vaccinated: d3.schemeGnBu[9],
  population: d3.schemePuBu[9],
  median_age: d3.schemeGreens[9],
  gdp_per_capita: d3.schemeYlGnBu[9],
  life_expectancy: d3.schemeRdPu[9],
};

class WorldMap extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoading: true,
      countryData: new Map(),
      maxData: {
        total_cases: 0,
        total_deaths: 0,
        total_vaccinations: 0,
        people_vaccinated: 0,
        population: 0,
        median_age: 0,
        gdp_per_capita: 0,
        life_expectancy: 0,
      },
      worldMap: {},
    };
    this.fetchData();
  }

  create(iso: string) {
    if (!this.state.countryData.has(iso)) {
      this.state.countryData.set(iso, {
        iso: iso,
        chinese: "",
        data: [],
      });
    }
  }

  fetchData() {
    Promise.all([
      d3.json(WORLD_MAP).then((data: any) => {
        this.setState({ worldMap: data });
        console.log("Fetch world map done");
      }),
      d3.csv(COUNTRY_NAME).then((data: any) => {
        data.forEach((element: any) => {
          const iso: string = element.iso_code;
          this.create(iso);
          this.state.countryData.get(iso).chinese = element.chinese;
        });
        console.log("Fetch Chinese name done");
      }),
      d3.csv(ALL_DATA).then((data: any) => {
        data.forEach((element: any) => {
          const iso: string = element.iso_code;
          this.create(iso);
          this.state.countryData.get(iso).data.push(element);
        });
        console.log("Fetch all data done");
      }),
    ]).then(() => {
      console.log("Start processing data");
      this.state.countryData.forEach((element: any) => {
        const iso: string = element.iso;
        if (iso.startsWith("OWID_") || element.data.length === 0) {
          return;
        }
        const lastDay: any = element.data.slice(-1)[0];
        const maxData: any = this.state.maxData;
        types.forEach((element: string) => {
          maxData[element] = Math.max(maxData[element], lastDay[element]);
        });
      });
      this.setState({ isLoading: false });
      console.log("Max data is: ", this.state.maxData);
    });
  }

  renderLegend(color: ReadonlyArray<string>, width: any, height: any) {
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
      .text((this.state.maxData.total_vaccinations / 2).toLocaleString());
    legend
      .append("text")
      .attr("class", "label")
      .attr("x", width / 2 - 300 + 570)
      .attr("y", 20)
      .text(this.state.maxData.total_vaccinations.toLocaleString());

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
    if (this.state.isLoading) {
      console.log("Loading ...");
      return <div className="WorldMap"></div>;
    }
    const type = this.props.type;
    const maxData: any = this.state.maxData;
    console.log("Start rendering world map, type " + type);

    const that = this;
    const ref: RefObject<HTMLDivElement> = React.createRef();

    const width = document.getElementsByClassName("WorldMap")[0].clientWidth;
    const height = document.getElementsByClassName("WorldMap")[0].clientHeight;
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
        svg.attr("transform", event.transform);
      })
      .scaleExtent([0.5, 1.5]);
    svg.call((d: any) => {
      zoom(d);
    });

    // 图例相关
    const color: any = d3.scaleQuantize([0, maxData[type]], colors[type]).unknown("#eeeeee");
    this.renderLegend(colors[type], width, height);

    // 地图相关
    const projection = d3.geoMercator();
    const path = d3.geoPath().projection(projection);

    d3.json(WORLD_MAP).then((data: any) => {
      projection.fitSize([width, height], data);
      projection.scale(100);
      svg
        .append("g")
        .selectAll("path")
        .data(data.features)
        .join((enter) => {
          const p = enter.append("path");
          p.on("mouseover", function (event, d: any) {
            const iso = d.properties.ISO_A3;
            d3.select(this)
              .transition()
              .duration(200)
              .style("opacity", 0.6)
              .attr("stroke", "black");
            tip.transition().duration(200).style("opacity", 0.9);
            tip.style("left", event.pageX + "px").style("top", event.pageY - 28 + "px");

            if (!that.state.countryData.has(iso)) {
              return;
            }
            tip.select("span").text(that.state.countryData.get(iso).chinese);
            if (that.state.countryData.get(iso).data.length === 0) {
              tip.append("p").text("暂无数据");
              return;
            }
            const latest = that.state.countryData.get(iso).data.slice(-1)[0];
            tip
              .append("p")
              .text(
                "接种人次：" +
                  (latest.total_vaccinations
                    ? parseInt(latest.total_vaccinations).toLocaleString()
                    : "暂无数据")
              );
            tip
              .append("p")
              .text(
                "接种人数：" +
                  (latest.people_vaccinated
                    ? parseInt(latest.people_vaccinated).toLocaleString()
                    : "暂无数据")
              );
            tip
              .append("p")
              .text(
                "完成接种人数：" +
                  (latest.people_fully_vaccinated
                    ? parseInt(latest.people_fully_vaccinated).toLocaleString()
                    : "暂无数据")
              );
          });
          p.on("mouseout", function () {
            d3.select(this)
              .transition()
              .duration(500)
              .style("opacity", 1)
              .attr("stroke", "#dddddd");
            tip.transition().duration(500).style("opacity", 0);
            tip.selectAll("p").remove();
          });
          return p;
        })
        .attr("d", (d: any) => path(d))
        .style("fill", (d: any) => {
          const iso: string = d.properties.ISO_A3;
          if (that.state.countryData.has(iso) && that.state.countryData.get(iso).data.length > 0) {
            const latest = that.state.countryData.get(iso).data.slice(-1)[0];
            return color(latest[that.props.type]);
          }
          return color(NaN);
        })
        .attr("stroke", "#dddddd");
    });

    return <div className="WorldMap" ref={ref}></div>;
  }
}

export default WorldMap;
