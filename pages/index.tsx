import type { GetStaticProps, NextPage } from "next";
import matchData from "./match.json";
import Head from "next/head";
import * as d3 from "d3";
import styles from "../styles/Home.module.css";
import { scroller } from "../animation/scroller";
import { useEffect } from "react";

type individualPositions = "TOP" | "JUNGLE" | "MIDDLE" | "BOTTOM" | "UTILITY";

const positionPriority: individualPositions[] = [
  "TOP",
  "JUNGLE",
  "MIDDLE",
  "BOTTOM",
  "UTILITY",
];

const championImageSize = 32;
const championImageSizeWithInterval = championImageSize + 8;

interface IHero {
  id: number;
  championName: string;
  summonerName: string;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  position: individualPositions;
  teamId: number;
}

interface HomeProps {
  heroes: IHero[];
}

const setupVisualization = (heroes: IHero[]) => {
  let visualization = d3.select("#visualization");

  visualization
    .selectAll("image")
    .data(heroes)
    .join("image")
    .attr(
      "href",
      (d) =>
        `http://ddragon.leagueoflegends.com/cdn/12.7.1/img/champion/${d.championName}.png`
    )
    .attr("height", championImageSize)
    .attr("width", championImageSize)
    .attr("x", 0)
    .attr("y", (d, i) => i * (championImageSize + 8));

  visualization
    .selectAll("text.summonerName")
    .data(heroes)
    .join("text")
    .attr("class", "summonerName")
    .text((d) => d.summonerName)
    .attr("x", 40)
    .attr("y", (d, i) => i * (championImageSize + 8) + 20);
};

const playerSectionAnimation = (heroes: IHero[]) => {
  let visualization = d3.select("#visualization");

  visualization
    .selectAll("image")
    .data(heroes)
    .join("image")
    .transition()
    .attr("x", 0)
    .attr("y", (d, i) => i * championImageSizeWithInterval);

  visualization
    .selectAll("text.summonerName")
    .data(heroes)
    .join("text")
    .transition()
    .attr("x", championImageSizeWithInterval)
    .attr(
      "y",
      (d, i) =>
        i * championImageSizeWithInterval + championImageSizeWithInterval / 2
    );
};

const teamSectionAnimation = (heroes: IHero[]) => {
  let visualization = d3.select("#visualization");

  visualization
    .selectAll("image")
    .data(heroes)
    .join("image")
    .transition()
    .attr("x", (d, i) => (i % 5) * 120)
    .attr("y", (d, i) => (i < 5 ? 0 : 200));

  visualization
    .selectAll("text.summonerName")
    .data(heroes)
    .join("text")
    .transition()
    .attr("x", (d, i) => (i % 5) * 120)
    .attr("y", (d, i) =>
      i < 5
        ? championImageSizeWithInterval + championImageSizeWithInterval / 2
        : 200 +
          championImageSizeWithInterval +
          championImageSizeWithInterval / 2
    );
};

const activationFunctions = [playerSectionAnimation, teamSectionAnimation];

const Home: NextPage<HomeProps> = ({ heroes }) => {
  useEffect(() => {
    let lastIndex: number;
    let activeIndex = 0;

    let scroll = scroller().container(d3.select("body"));

    scroll();

    setupVisualization(heroes);

    //This is where most of the magic happens. Every time the user scrolls, we receive a new index. First, we find all the irrelevant sections, and reduce their opacity.
    scroll.on("active", function (index) {
      d3.selectAll(".step")
        .transition()
        .duration(500)
        .style("opacity", function (d, i) {
          return i === index ? 1 : 0.1;
        });

      //Next, we selection from a range of activationFunctions (which we create), based on the index of the current section.
      activeIndex = index;
      let sign = activeIndex - lastIndex < 0 ? -1 : 1;
      let scrolledSections = d3.range(
        lastIndex + sign,
        activeIndex + sign,
        sign
      );
      scrolledSections.forEach((i) => {
        console.log(i);
        activationFunctions[i](heroes);
      });
      lastIndex = activeIndex;
    });
  }, [heroes]);

  return (
    <>
      <Head>
        <title>LOL Match Visualizer</title>
        <meta
          name="description"
          content="A pretty web page to visualize a League of Legend match based on data from RIOT."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.pageHeader}>
        <h1 className={styles.pageHeaderTitle}>
          League of Legend Match Visualizer
        </h1>
      </header>

      <div className={styles.sections}>
        <div className={`page-section ${styles.pageSection}`}>
          <h2 className={styles.pageSectionTitle}>Player Statistics</h2>
        </div>

        <div className={`page-section ${styles.pageSection}`}>
          <h2 className={styles.pageSectionTitle}>Team Gold</h2>
        </div>
      </div>

      <svg
        id="visualization"
        className={styles.visualization}
        width="600"
        height="400"
      ></svg>

      <footer className={styles.footer}>
        <a
          href="https://github.com/LixingSun/lol-match-visualizer"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </footer>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const heroes: IHero[] = matchData.info.participants
    .map((entity) => ({
      id: entity.championId,
      championName: entity.championName,
      summonerName: entity.summonerName,
      totalDamageDealtToChampions: entity.totalDamageDealtToChampions,
      totalDamageTaken: entity.totalDamageTaken,
      position: entity.individualPosition as individualPositions,
      teamId: entity.teamId,
    }))
    .sort((a, b) => {
      if (a.teamId < b.teamId) {
        return -1;
      } else if (a.teamId > b.teamId) {
        return 1;
      } else {
        let positionA = positionPriority.indexOf(a.position);
        let positionB = positionPriority.indexOf(b.position);
        return positionA < positionB ? -1 : 1;
      }
    });

  return {
    props: {
      heroes,
    },
  };
};

export default Home;
