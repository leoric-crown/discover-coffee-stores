import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import { CoffeeStorePageProps, CoffeeStore } from "../../types";

import styles from "../../styles/coffee-store.module.css";

import cls from "classnames";

import { StoreContext } from "../../store/store-context";
import { useContext, useEffect, useState } from "react";

import { getCoffeeStoreData } from "../../data/foursquare";

export async function getStaticPaths() {
  const coffeeStoreData = await getCoffeeStoreData();

  return {
    paths: coffeeStoreData.map((coffeeStore) => {
      return { params: { sid: coffeeStore.id } };
    }),
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  console.log("fetching data again");
  const coffeeStoresData = await getCoffeeStoreData();
  const findCoffeeStoreById = coffeeStoresData.find((store) => {
    return store.id.toString() === params.sid;
  });
  return {
    props: {
      coffeeStore: findCoffeeStoreById || {}
    },
  };
}

const handleUpVoteButton = () => {
  console.log("handle upvote");
};

export default function CoffeeStorePage(initialProps: CoffeeStorePageProps) {
  const router = useRouter();
  const { state } = useContext(StoreContext);
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  console.log("context state in coffeestorepage", state);

  if (router.isFallback) return <div> Loading... </div>;

  useEffect(() => {
    if (Object.keys(coffeeStore).length === 0) {
      const findStore = findStoreInContext() || {
        id: null,
        address: null,
        name: null,
        neighbourhood: null,
        imgUrl: null,
        websiteUrl: null,
      };
      setCoffeeStore(findStore);
    }
  },[router.query.id]);

  const findStoreInContext = (): CoffeeStore => {
    return state.coffeeStores.find((store) => router.query.sid === store.id);
  };

  const { address, name, neighbourhood, imgUrl } = coffeeStore
  console.log("in [sid]", { initialProps }, { state });
  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={2}
            height={2}
            className={styles.storeImg}
            alt={name}
            layout="responsive"
          ></Image>
        </div>
        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              className={styles.filterCafeDark}
              src="/static/icons/places.svg"
              width="32"
              height="32"
            />
            <p className={styles.text}>{address}</p>
          </div>
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                className={styles.filterCafeDark}
                src="/static/icons/nearMe.svg"
                width="32"
                height="32"
              />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              className={styles.filterCafeDark}
              src="/static/icons/star.svg"
              width="32"
              height="32"
            />
            <p className={styles.text}>1</p>
          </div>
          <button className={styles.upvoteButton} onClick={handleUpVoteButton}>
            Upvote
          </button>
        </div>
      </div>
    </div>
  );
}
