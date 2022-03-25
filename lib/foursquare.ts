import { CoffeeStore } from "../types";
import { decodeCoffeeStoreURIs } from "./coffee-stores";

export interface QueryParameters {
  query?: string;
  latLong?: string;
  category?: number;
  limit?: number;
}

const endpoints = {
  fsqPlaces: "https://api.foursquare.com/v3/places/search",
};

const queryOptions = {
  method: "GET",
  headers: {
    Accept: "application/json",
    Authorization: process.env.NEXT_PUBLIC_FSQAPIKEY,
  },
};

const sanitizeQueryParameters = (queryParameters: QueryParameters) => {
  const { latLong, ...rest } = queryParameters;
  return {
    ll: latLong,
    ...rest,
  };
};

const generateQueryString = (queryParameters: QueryParameters) => {
  const sanitized = sanitizeQueryParameters(queryParameters);
  const keys = Object.keys(sanitized);
  let queryString = endpoints.fsqPlaces;
  let firstParamAdded = false;
  for (let i = 0; i < keys.length; i++) {
    if (sanitized[keys[i]]) {
      if (!firstParamAdded) {
        queryString += `?${keys[i]}=${sanitized[keys[i]]}`;
        firstParamAdded = true;
      } else {
        queryString += `&${keys[i]}=${sanitized[keys[i]]}`;
      }
    }
  }
  return queryString;
};

const transformCoffeeStoreRes = (results) => {
  if (results) {
    const mappedCoffeeStores: CoffeeStore[] = results.map(
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
          votes: 0,
        };
      }
    );

    return mappedCoffeeStores;
  } else {
    return [];
  }
};
const fsqPlacesReq = async (queryParameters: QueryParameters) => {
  try {
    const queryString = generateQueryString(queryParameters);
    const response = await fetch(queryString, queryOptions);
    const json = await response.json();
    const coffeeStores: CoffeeStore[] = transformCoffeeStoreRes(json.results);
    const decodedCoffeeStores: CoffeeStore[] =
      decodeCoffeeStoreURIs(coffeeStores);

    return decodedCoffeeStores;
  } catch (error) {
    console.error("There was an error in fsqPlacesReq: ", error.message);
    throw error;
  }
};

export async function fetchCoffeeStoreData(queryParameters: QueryParameters) {
  try {
    const { query, latLong, category, limit } = queryParameters;
    const coffeeStoreData = await fsqPlacesReq({
      query: query || null,
      latLong: latLong || null, //"19.3854034,-99.1680344",
      category: category || null,
      limit: limit || 6,
    });

    return coffeeStoreData;
  } catch (error) {
    console.error(
      "There was an error in fetchCoffeeStoreData: ",
      error.message
    );
    throw error;
  }
}
