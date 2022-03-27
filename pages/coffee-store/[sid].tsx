import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";

import { CoffeeStorePageProps, CoffeeStore } from "../../types";

import styles from "../../styles/coffee-store.module.css";

import cls from "classnames";

import { StoreContext } from "../../store/store-context";
import { useContext, useEffect, useState } from "react";

import { fetchCoffeeStoreData } from "../../lib/foursquare";
import useSWR from "swr";
import { json } from "stream/consumers";

import { handleSaveCoffeeStore } from "../../lib/coffee-stores";
import {
  createRecords,
  findRecordById,
  findStaticPageRecords,
} from "../../lib/airtable";

const emptyCoffeeStore = {
  id: null,
  address: null,
  name: null,
  neighbourhood: null,
  imgUrl: null,
  websiteUrl: null,
};

const defaultImgUrl =
  "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80";

export async function getStaticPaths() {
  console.log("in getStaticPaths");
  try {
    const dbStaticCoffeeStores = await findStaticPageRecords();
    let staticCoffeeStores: CoffeeStore[];
    if (dbStaticCoffeeStores.length !== 0) {
      console.log("found coffeestores in db");
      staticCoffeeStores = dbStaticCoffeeStores.map(
        (record) => record.fields as any
      );
    } else {
      console.log("fetching coffeestores from api");
      staticCoffeeStores = await fetchCoffeeStoreData({
        latLong: "19.3854034,-99.1680344",
        limit: 6,
      });
      staticCoffeeStores.forEach(
        (coffeeStore: CoffeeStore) => (coffeeStore.static = true)
      );
      console.log("creating records");
      createRecords(staticCoffeeStores);
    }

    const initialProps = {
      paths: staticCoffeeStores.map((coffeeStore) => {
        return { params: { sid: coffeeStore.id } };
      }),
      fallback: true,
    };
    console.log("getStaticPaths returning: ", { initialProps });
    return initialProps;
  } catch (error) {
    console.error(
      "There was an error fetching static paths in /[sid]",
      error.message
    );
  }
}

export async function getStaticProps({ params }) {
  console.log("in getStaticProps", { params });
  try {
    const dbStaticCoffeeStore = await findRecordById(params.sid);
    let coffeeStore: CoffeeStore[];
    if (dbStaticCoffeeStore?.fields) {
      console.log("found coffeestore in db");
      coffeeStore = dbStaticCoffeeStore.fields as any;
    } else {
      console.log("fetching 6 coffeestores from api");
      const coffeeStoreData = await fetchCoffeeStoreData({
        latLong: "19.3854034,-99.1680344",
        limit: 6,
      });

      coffeeStore = coffeeStoreData.find((store) => {
        return store.id.toString() === params.sid;
      }) as any;
    }
    const initialProps = {
      props: {
        coffeeStore: coffeeStore || emptyCoffeeStore,
        isStatic: true,
      },
    };
    console.log("getStaticProps returning: ", { initialProps });
    return initialProps;
  } catch (error) {
    console.error("there was an error getting static props", error.message);
    return {
      props: {
        coffeeStore: emptyCoffeeStore,
      },
    };
  }
}

export default function CoffeeStorePage(initialProps: CoffeeStorePageProps) {
  const router = useRouter();
  const { state } = useContext(StoreContext);
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const [numVotes, setNumVotes] = useState(0);

  useEffect(() => {
    const findStoreInContext = (): CoffeeStore => {
      return state.coffeeStores.find((store) => router.query.sid === store.id);
    };

    const handleFindDbRecordById = async (id: string) => {
      const recordInDb = await fetch(`/api/getCoffeeStoreById?id=${id}`);
      const json = await recordInDb.json();
      setCoffeeStore(json.record.fields);
      setNumVotes(json.record.fields.votes);
    };

    if (coffeeStore && coffeeStore.id) {
      handleSaveCoffeeStore(coffeeStore);
      return;
    }

    if (state.coffeeStores.length > 0) {
      const coffeeStoreInContext = findStoreInContext();
      setCoffeeStore(coffeeStoreInContext);
      setNumVotes(coffeeStoreInContext.votes);
      if (coffeeStoreInContext) {
        handleSaveCoffeeStore(coffeeStoreInContext);
        return;
      }
    } else {
      try {
        const getId = new RegExp("([^/]+$)");
        handleFindDbRecordById(router.asPath.toString().match(getId)[0]);
        return;
      } catch (error) {
        console.error("Error getting coffeeStore by id", {
          coffeeStore,
          error: error.message,
          errorFull: error,
        });
      }
    }
  }, []);

  const { id, name, imgUrl, neighbourhood, address } = coffeeStore
    ? coffeeStore
    : emptyCoffeeStore;
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.record && data.record.fields) {
      const swrCoffeeStoreData: CoffeeStore = data.record.fields;
      setCoffeeStore(swrCoffeeStoreData);
      setNumVotes(swrCoffeeStoreData.votes);
    }
  }, [data]);

  const handleUpVoteButton = async () => {
    setNumVotes(coffeeStore.votes + 1);
    const response = await fetch(`/api/upvoteCoffeeStore?id=${coffeeStore.id}`);
    if (response.status === 200) {
      const json = await response.json();
      const updatedCoffeeStore = json.coffeeStore;
      setCoffeeStore(updatedCoffeeStore);
      setNumVotes(updatedCoffeeStore.votes);
    } else {
      console.error("Something went wrong while upvoting");
    }
  };

  if (error) {
    return <div>Something went wrong retrieving Coffee Store page.</div>;
  } else if (router.isFallback) {
    return <div> Loading... </div>;
  } else {
    return (
      <div className={styles.layout}>
        <Head>
          <title>{name}</title>
        </Head>
        <div key={id} className={styles.container}>
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
              src={imgUrl || defaultImgUrl}
              width="100%"
              height="100%"
              // objectFit="cover"
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
              <p className={styles.text}>{numVotes}</p>
            </div>
            <button
              className={styles.upvoteButton}
              onClick={handleUpVoteButton}
            >
              Upvote
            </button>
          </div>
        </div>
      </div>
    );
  }
}
