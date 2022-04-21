import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>LOL Match Visualizer</title>
        <meta name="description" content="A pretty web page to visualize a League of Legend match based on data from RIOT." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.pageTitle}>
        League of Legend Match Visulizer
      </h1>

      <footer className={styles.footer}>
        <a
          href="https://github.com/LixingSun/lol-match-visualizer"
          target="_blank"
          rel="noopener noreferrer"
        >
          Github
        </a>
      </footer>
    </div>
  )
}

export default Home
