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
  try {
    const coffeeStoreData = await fetchCoffeeStoreData({
      latLong: "19.3854034,-99.1680344",
      limit: 6,
    });

    const initialProps = {
      paths: coffeeStoreData.map((coffeeStore) => {
        return { params: { sid: coffeeStore.id } };
      }),
      fallback: true,
    };
    return initialProps;
  } catch (error) {
    console.error("there was an error getting static paths", error.message);
  }
}

export async function getStaticProps({ params }) {
  try {
    const coffeeStoreData = await fetchCoffeeStoreData({
      latLong: "19.3854034,-99.1680344",
      limit: 6,
    });

    const findCoffeeStoreById = coffeeStoreData.find((store) => {
      return store.id.toString() === params.sid;
    });

    return {
      props: {
        coffeeStore: findCoffeeStoreById || emptyCoffeeStore,
      },
    };
  } catch (error) {
    console.error("there was an error getting static props", error.message);
    return {
      props: {
        coffeeStore: emptyCoffeeStore,
      },
    };
  }
}

const handleUpVoteButton = () => {
  console.log("handle upvote");
};

export default function CoffeeStorePage(initialProps: CoffeeStorePageProps) {
  const router = useRouter();
  const { state } = useContext(StoreContext);
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

  useEffect(() => {
    if (coffeeStore && coffeeStore.id) return;

    const findStoreInContext = (): CoffeeStore => {
      return state.coffeeStores.find((store) => router.query.sid === store.id);
    };

    const handleSaveCoffeeStore = async (newCoffeeStore: CoffeeStore) => {
      try {
        const response = await fetch("/api/saveCoffeeStore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newCoffeeStore),
        });
      } catch (error) {
        console.error("Error creating coffeestore", {
          newCoffeeStore,
          error: error.message,
        });
      }
    };

    const handleFindDbRecordById = async (id: string) => {
      const recordInDb = await fetch(`/api/getCoffeeStoreById?id=${id}`);
      const json = await recordInDb.json();
      setCoffeeStore(json.record.fields);
    };
    if (state.coffeeStores.length > 0) {
      const coffeeStoreInContext = findStoreInContext();
      setCoffeeStore(coffeeStoreInContext);
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
  }, [state.coffeeStores]);

  if (router.isFallback) return <div> Loading... </div>;

  const { id, name, imgUrl, neighbourhood, address } = coffeeStore
    ? coffeeStore
    : emptyCoffeeStore;
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
