import React, { useState, useEffect, RefObject } from "react";
import "./WorldMap.css";
import * as d3 from "d3";
import { color } from "d3";

const WorldMap = () => {
  const WORLD_MAP = "/data/world-map.geo.json";
  const COUNTRY_DATA =
    "https://cdn.jsdelivr.net/gh/owid/covid-19-data/public/data/vaccinations/locations.csv";
  const COUNTRY_NAME = "/data/country_name.csv";
  const ALL_DATA = "https://cdn.jsdelivr.net/gh/owid/covid-19-data/public/data/owid-covid-data.csv";
  const VACCINATION_DATA =
    "https://cdn.jsdelivr.net/gh/owid/covid-19-data/public/data/vaccinations/vaccinations.csv";

  const country_data = new Map();
  const max_data = {
    total_vaccinations: 0,
    total_vaccinations_per_hundred: 0,
    daily_vaccinations_raw: 0,
    daily_vaccinations: 0,
    daily_vaccinations_per_million: 0,
    people_vaccinated: 0,
    people_vaccinated_per_hundred: 0,
    people_fully_vaccinated: 0,
    people_fully_vaccinated_per_hundred: 0,
  };

  const [myState, setMyState] = useState<Boolean>(true);
  const ref: RefObject<HTMLDivElement> = React.createRef();

  useEffect(() => {
    const create = (iso: string) => {
      if (!country_data.has(iso)) {
        country_data.set(iso, {
          iso: iso,
          chinese: "",
          information: null,
          vaccination: [],
        });
      }
    };

    Promise.all([
      d3.csv(COUNTRY_DATA).then((data: any) => {
        data.forEach((element: any) => {
          const iso: string = element.iso_code;
          create(iso);
          country_data.get(iso).information = element;
        });
        console.log("fetch country done");
      }),
      d3.csv(VACCINATION_DATA).then((data: any) => {
        data.forEach((element: any) => {
          const iso: string = element.iso_code;
          create(iso);
          country_data.get(iso).vaccination.push(element);
        });
        console.log("fetch vaccination done");
      }),
      d3.csv(COUNTRY_NAME).then((data: any) => {
        data.forEach((element: any) => {
          const iso: string = element.iso_code;
          create(iso);
          country_data.get(iso).chinese = element.chinese;
        });
        console.log("fetch chinese done");
      }),
    ])
      .then(() => {
        console.log("ok");
        country_data.forEach((element: any) => {
          const iso: string = element.iso;
          if (iso.startsWith("OWID_") || element.vaccination.length === 0) {
            return;
          }
          const lastDay = element.vaccination.slice(-1)[0];
          max_data.total_vaccinations = Math.max(
            max_data.total_vaccinations,
            lastDay.total_vaccinations
          );
          max_data.total_vaccinations_per_hundred = Math.max(
            max_data.total_vaccinations_per_hundred,
            lastDay.total_vaccinations_per_hundred
          );
          max_data.people_vaccinated = Math.max(
            max_data.people_vaccinated,
            lastDay.people_vaccinated
          );
          max_data.people_vaccinated_per_hundred = Math.max(
            max_data.people_vaccinated_per_hundred,
            lastDay.people_vaccinated_per_hundred
          );
          max_data.people_fully_vaccinated = Math.max(
            max_data.people_fully_vaccinated,
            lastDay.people_fully_vaccinated
          );
          max_data.people_fully_vaccinated_per_hundred = Math.max(
            max_data.people_fully_vaccinated_per_hundred,
            lastDay.people_fully_vaccinated_per_hundred
          );
        });
        console.log(max_data);
      })
      .then(() => draw());
  });

  const draw = () => {
    const width = document.getElementsByClassName("chart")[0].clientWidth;
    const height = document.getElementsByClassName("chart")[0].clientHeight;
    const svg = d3
      .select(".chart")
      .select("svg")
      .attr("width", width)
      .attr("height", height - 100);

    const tip = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
    tip.append("span");

    // 缩放相关
    console.log(d3.schemeBlues);

    // 图例相关
    const color = d3
      .scaleQuantize([0, max_data.total_vaccinations], d3.schemeBlues[9])
      .unknown("#eeeeee");
    const legend = d3
      .select(".chart")
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
      .text((max_data.total_vaccinations / 2).toLocaleString());
    legend
      .append("text")
      .attr("class", "label")
      .attr("x", width / 2 - 300 + 570)
      .attr("y", 20)
      .text(max_data.total_vaccinations.toLocaleString());
    legend
      .append("rect")
      .attr("x", width / 2 - 300 + 50)
      .attr("y", 30)
      .attr("width", 45)
      .attr("height", 15)
      .attr("stroke", "black")
      .style("fill", "#dddddd");

    for (let i = 0; i < d3.schemeBlues[9].length; i++) {
      legend
        .append("rect")
        .attr("x", width / 2 - 300 + 140 + 45 * i)
        .attr("y", 30)
        .attr("width", 45)
        .attr("height", 15)
        .attr("stroke", "black")
        .style("fill", d3.schemeBlues[9][i]);
    }

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
            tip.select("span").text(country_data.get(iso).chinese);
            if (!country_data.has(iso) || country_data.get(iso).vaccination.length === 0) {
              tip.append("p").text("暂无数据");
              return;
            }
            const latest = country_data.get(iso).vaccination.slice(-1)[0];
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
          if (country_data.has(iso) && country_data.get(iso).vaccination.length > 0) {
            const latest = country_data.get(iso).vaccination.slice(-1)[0];
            return color(latest.total_vaccinations);
          }
          return color(NaN);
        })
        .attr("stroke", "#dddddd");
    });
  };

  return (
    <div className="WorldMap" ref={ref}>
      <svg />
    </div>
  );
};

export default WorldMap;
