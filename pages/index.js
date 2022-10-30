import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>ml-app</title>
        <meta name="description" content="ml-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">ml-app!</a>
        </h1>

        <div className={styles.grid}>
          <Link href="/hand-pose-detection" className={styles.card}>
            <h2> Detection &rarr;</h2>
            <p>Hand pose detection by TensorFlow 👋</p>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}
