import type { GetStaticProps, NextPage } from "next";
import matchData from "./match.json";
import Head from "next/head";
import * as d3 from "d3";
import styles from "../styles/Home.module.css";
import { scroller } from "../animation/scroller";
import { useEffect } from "react";

interface IHero {
  id: number;
  name: string;
}

interface HomeProps {
  heroes: IHero[];
}

const Home: NextPage<HomeProps> = ({ heroes }) => {
  useEffect(() => {
    let scroll = scroller().container(d3.select("body"));

    scroll();

    let lastIndex: number;
    let activeIndex = 0;

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
      });
      lastIndex = activeIndex;
    });
  }, []);

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

      <div className={`page-section ${styles.pageSection}`}>
        <h2 className={styles.pageSectionTitle}>Player Statistics</h2>
        <div>
          {heroes.map((hero) => {
            return (
              <img
                key={hero.id}
                src={`http://ddragon.leagueoflegends.com/cdn/12.7.1/img/champion/${hero.name}.png`}
                alt={hero.name}
              />
            );
          })}
        </div>
      </div>

      <div className={`page-section ${styles.pageSection}`}>
        <h2 className={styles.pageSectionTitle}>Team Gold</h2>
      </div>

      <div className={`page-section ${styles.pageSection}`}>
        <h2 className={styles.pageSectionTitle}>Build</h2>
      </div>

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
  const heroes: IHero[] = matchData.info.participants.map((entity) => ({
    id: entity.championId,
    name: entity.championName,
  }));

  return {
    props: {
      heroes,
    },
  };
};

export default Home;
