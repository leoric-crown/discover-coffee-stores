import Head from "next/head";
import Image from "next/image";
import Banner from "../components/banner";
import Card from "../components/card";
import styles from "../styles/home.module.css";

import { CoffeeStore, HomeProps } from "../types";

import { ActionTypes, StoreContext } from "../store/store-context";
import { useContext, useEffect, useState } from "react";
import useLocation from "../hooks/useLocation";

import { decodeCoffeeStoreURIs, getImgUrl } from "../lib/coffee-stores";
import { findStaticPageRecords } from "../lib/airtable";
import { parseRecords } from "../lib/parse-records";

import { createRecords } from "../lib/airtable";
import { fetchNewStaticCoffeeStores, defaultLatLong } from "../lib/foursquare";

export async function getStaticProps(context: any) {
  try {
    const dbStaticCoffeeStores = await findStaticPageRecords();
    let staticCoffeeStores: CoffeeStore[];
    if (dbStaticCoffeeStores.length !== 0) {
      staticCoffeeStores = parseRecords(dbStaticCoffeeStores);
    } else {
      staticCoffeeStores = await fetchNewStaticCoffeeStores(defaultLatLong, 6);
      staticCoffeeStores.forEach(
        (coffeeStore: CoffeeStore) => (coffeeStore.static = true)
      );
      createRecords(staticCoffeeStores);
    }

    return { props: { staticCoffeeStores } };
  } catch (error) {
    console.error("There was an error fetching static props in /");
  }
}

export default function Home(props: HomeProps) {
  const { state, dispatch } = useContext(StoreContext);
  const { latLong } = state;
  const [coffeeStoresError, setCoffeeStoresError] = useState("");
  const [isFetchingData, setIsFetchingData] = useState(false);

  const { latLongResult, handleLocation, locationErrorMsg, isFindingLocation } =
    useLocation();

  const fetchLatLongCoffeeStores = async (newLatLong: string) => {
    try {
      const response = await fetch(
        `/api/getCoffeeStores?latLong=${newLatLong}&limit=${12}`
      );
      const responseCoffeeStores: CoffeeStore[] = await response.json();
      if (responseCoffeeStores.length > 0) {
        dispatch({
          type: ActionTypes.SetCoffeeStores,
          payload: decodeCoffeeStoreURIs(responseCoffeeStores),
        });

        dispatch({
          type: ActionTypes.SetHaveResults,
          payload: true,
        });
        setIsFetchingData(false);
        setCoffeeStoresError("");
      }
    } catch (error) {
      setCoffeeStoresError(error.message);
    }
  };

  useEffect(() => {
    if (latLongResult.length > 0 && latLongResult !== latLong) {
      dispatch({
        type: ActionTypes.SetLatLong,
        payload: latLongResult,
      });
      dispatch({
        type: ActionTypes.SetHaveResults,
        payload: false,
      });
    }
  }, [latLongResult]);

  useEffect(() => {
    if (latLong.length > 0 && latLongResult.length > 0) {
      setIsFetchingData(true);
      fetchLatLongCoffeeStores(latLong);
    }
  }, [latLong]);

  const handleOnBannerBtnClick = () => {
    handleLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.heroImage}>
        <Image src="/static/hero-image.png" width={700} height={400}></Image>
      </div>

      <main className={styles.main}>
        <Banner
          buttonText={
            isFindingLocation
              ? "Finding your location..."
              : "View shops near you"
          }
          disableButton={isFindingLocation || isFetchingData}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg.length > 0 && (
          <p>Something went wrong: {locationErrorMsg}</p>
        )}
        {coffeeStoresError.length > 0 && (
          <p>Something went wrong: {coffeeStoresError}</p>
        )}
        {(isFindingLocation || isFetchingData || state.haveResults) && (
          <div>
            {true && (
              <h2 className={styles.heading2}>
                {state.haveResults ? "Stores near you" : "Loading..."}
              </h2>
            )}
            <div className={styles.cardLayout}>
              {state.haveResults &&
                state.coffeeStores.map((store: CoffeeStore) => {
                  return (
                    <Card
                      key={store.id}
                      name={store.name}
                      imgUrl={
                        getImgUrl(store.imgUrl, 250, 250) ||
                        "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                      }
                      href={`/coffee-store/${store.id}`}
                    />
                  );
                })}
            </div>
          </div>
        )}
        <div>
          {props.staticCoffeeStores.length > 0 && (
            <h2 className={styles.heading2}>Stores in CDMX</h2>
          )}
          <div className={styles.cardLayout}>
            {props.staticCoffeeStores.map((store: CoffeeStore) => {
              return (
                <Card
                  key={store.id}
                  name={store.name}
                  imgUrl={
                    getImgUrl(store.imgUrl, 250, 250) ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${store.id}`}
                />
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
