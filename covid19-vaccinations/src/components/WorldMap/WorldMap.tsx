import React, { useState, useEffect, RefObject } from "react";
import "./WorldMap.less";
import * as d3 from "d3";

const WorldMap = () => {
  const WORLD_MAP = "/data/world-map.geo.json";
  const COUNTRY_DATA =
    "https://cdn.jsdelivr.net/gh/owid/covid-19-data/public/data/vaccinations/locations.csv";
  const VACCINATION_DATA =
    "https://cdn.jsdelivr.net/gh/owid/covid-19-data/public/data/vaccinations/vaccinations.csv";

  const country_data = new Map();
  const max_data = {};

  const [myState, setMyState] = useState<Boolean>(true);
  const ref: RefObject<HTMLDivElement> = React.createRef();

  const fetch_data = () => {
    const fetch = Promise.all([
      d3.csv(COUNTRY_DATA).then((data: any) => {
        data.forEach((element: any) => {
          const iso: string = element.iso_code;
          if (!country_data.has(iso)) {
            country_data.set(iso, {
              iso: iso,
              information: null,
              vaccination: [],
            });
          }
          country_data.get(iso).information = element;
        });
        console.log("country done");
      }),
      d3.csv(VACCINATION_DATA).then((data: any) => {
        data.forEach((element: any) => {
          const iso: string = element.iso_code;
          if (!country_data.has(iso)) {
            country_data.set(iso, {
              iso: iso,
              information: null,
              vaccination: [],
            });
          }
          country_data.get(iso).vaccination.push(element);
        });
        console.log("vaccination done");
      }),
    ]).then(() => {
      console.log("ok");
      country_data.forEach((element: any) => {
        console.log(element);
      });
    });
  };

  useEffect(() => {
    fetch_data();
    draw();
  });

  const draw = () => {
    const width = 800;
    const height = 500;
    const svg = d3.select("svg").attr("width", width).attr("height", height);

    const color = d3.scaleQuantize([1, 10], d3.schemeBlues[9]);

    const projection = d3.geoMercator().center([0, 5]).scale(150);
    const path = d3.geoPath().projection(projection);

    d3.json(WORLD_MAP).then((data: any) => {
      projection.fitSize([width, height], data);
      console.log(country_data.get("CHN"));
      svg
        .append("g")
        .selectAll("path")
        .data(data.features)
        .join((enter) => {
          const p = enter.append("path");
          p.on("mouseenter", (e, d: any) => {
            console.log(d);
            d3.select(d).raise();
          });
          p.append("title");
          return p;
        })
        .attr("d", (d: any) => path(d))
        .style("fill", (d: any) => {
          const iso: string = d.properties.ISO_A3;
          if (country_data.has(iso)) {
            const latest = country_data.get(iso).vaccination.slice(-1)[0];
            // return color(latest.total_vaccinations);
            return color(4);
          }
          return color(0);
        });
    });
  };

  return (
    <div className="WorldMap" ref={ref}>
      <svg />
    </div>
  );
};

export default WorldMap;
