import { CoffeeStore, ImgUrl } from "../types";
import { decodeCoffeeStoreURIs } from "./coffee-stores";

export interface QueryParameters {
  query?: string;
  latLong?: string;
  categories?: string;
  limit?: number;
}

const endpoints = {
  fsqPlaces: "https://api.foursquare.com/v3/places/search",
  fsqPhotos: (fsq_id) =>
    `https://api.foursquare.com/v3/places/${fsq_id}/photos`,
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
const fsqPlacesRequest = async (queryParameters: QueryParameters) => {
  try {
    const queryString = generateQueryString(queryParameters);
    const response = await fetch(queryString, queryOptions);
    const json = await response.json();
    const coffeeStores: CoffeeStore[] = transformCoffeeStoreRes(json.results);
    const decodedCoffeeStores: CoffeeStore[] =
      decodeCoffeeStoreURIs(coffeeStores);

    return decodedCoffeeStores;
  } catch (error) {
    console.error("There was an error in fsqPlacesRequest: ", error.message);
    throw error;
  }
};

export async function fetchCoffeeStoreData(queryParameters: QueryParameters) {
  try {
    const { query, latLong, categories, limit } = queryParameters;
    const coffeeStoreData = await fsqPlacesRequest({
      query: query || null,
      latLong: latLong || null,
      categories: categories || "13032",
      limit: limit || 6,
    });

    const coffeeStoreDataWithImages: CoffeeStore[] = await Promise.all(
      coffeeStoreData.map(async (coffeeStore) => {
        const fsq_id = coffeeStore.id;
        const response = await fetch(endpoints.fsqPhotos(fsq_id), queryOptions);
        return new Promise((resolve) => {
          response.json().then((json) => {
            const topPhoto = json[0];
            const { prefix, suffix, width, height } = topPhoto;
            const imgUrl: ImgUrl = {
              prefix,
              suffix,
              width,
              height,
            };
            resolve({ ...coffeeStore, imgUrl } as CoffeeStore);
          });
        });
      })
    );

    return coffeeStoreDataWithImages;
  } catch (error) {
    console.error(
      "There was an error in fetchCoffeeStoreData: ",
      error.message
    );
    throw error;
  }
}

export const fetchNewStaticCoffeeStores = async (
  latLong: string,
  limit: number
) => {
  const newStaticCoffeeStores: CoffeeStore[] = await fetchCoffeeStoreData({
    latLong,
    limit,
  });

  return newStaticCoffeeStores;
};

export const defaultLatLong = "19.3854034,-99.1680344";
