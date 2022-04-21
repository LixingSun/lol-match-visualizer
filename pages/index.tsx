import type { GetStaticProps, NextPage } from 'next'
import matchData from './match.json'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

interface IHero {
  id: number;
  name: string;
}

interface HomeProps {
  heroes: IHero[];
}

const Home: NextPage<HomeProps> = ({ heroes }) => {
  return (
    <>
      <Head>
        <title>LOL Match Visualizer</title>
        <meta name="description" content="A pretty web page to visualize a League of Legend match based on data from RIOT." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.pageTitle}>
        League of Legend Match Visualizer
      </h1>

      {
        heroes.map(hero => {
          return <Image key={hero.id} src={`http://ddragon.leagueoflegends.com/cdn/12.7.1/img/champion/${hero.name}.png`} alt={hero.name} width={128} height={128} />
        })
      }

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
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const heroes: IHero[] = matchData.info.participants.map(entity => ({
    id: entity.championId,
    name: entity.championName
  }));

  return {
    props: {
      heroes
    },
  }
}

export default Home
