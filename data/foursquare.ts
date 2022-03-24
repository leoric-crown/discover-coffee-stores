import { CoffeeStore } from "../types";

interface QueryParameters {
  query: string;
  latLong: string;
  category: number;
  limit: number;
}

const endpoints = {
  places: "https://api.foursquare.com/v3/places/search",
};

const queryOptions = {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: process.env.NEXT_PUBLIC_FSQAPIKEY,
  },
};

export async function getData({
  query,
  latLong,
  category,
  limit,
}: QueryParameters) {
  const queryString =
    endpoints.places +
    `?ll=${latLong}` +
    (query ? `&query=${query}` : ``) +
    `&categories=${category}` +
    `&limit=${limit}`;

  console.log("queryString", queryString);
  const response = await fetch(queryString, queryOptions);

  const json = await response.json();
  const coffeeStores: CoffeeStore[] = json.results.map(
    (res: {
      fsq_id: string;
      name: string;
      location: { address: string; neighborhood: string[] };
    }) => {
      return {
        id: res.fsq_id,
        name: res.name,
        imgUrl: null,
        websiteUrl: null,
        address: res.location.address || null,
        neighbourhood: res.location.neighborhood
          ? res.location.neighborhood[0]
          : null,
      };
    }
  );

  return coffeeStores;
}

export async function getCoffeeStoreData(latLong?: string, limit?: number) {
  const coffeeStoreData = await getData({
    query: "cafe",
    latLong: latLong || "19.3854034,-99.1680344",
    category: 13065,
    limit: limit || 6,
  });
  console.log("getCoffeeStoreData() result", coffeeStoreData);
  return coffeeStoreData;
}
