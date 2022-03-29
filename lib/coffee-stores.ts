import { CoffeeStore, ImgUrl } from "../types";

export const decodeCoffeeStoreURIs = (coffeeStores: CoffeeStore[]) => {
  const decodedCoffeeStores = coffeeStores.map((coffeeStore) => {
    const keys = Object.keys(coffeeStore);
    const decoded = coffeeStore;
    for (let i = 0; i < keys.length; i++) {
      if (typeof coffeeStore[keys[i]] === "string") {
        decoded[keys[i]] = decodeURIComponent(
          JSON.parse(`"${coffeeStore[keys[i]]}"`)
        );
      }
    }
    return decoded;
  });
  return decodedCoffeeStores;
};

export const handleSaveCoffeeStore = async (newCoffeeStore: CoffeeStore) => {
  try {
    const response = await fetch("/api/saveCoffeeStore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCoffeeStore),
    });
    return response;
  } catch (error) {
    console.error("Error creating coffeestore", {
      newCoffeeStore,
      error: error.message,
    });
  }
};

export const getImgUrl = (imgUrl: ImgUrl, w?: number, h?: number): string => {
  const { prefix, suffix, width, height } = imgUrl;
  const size =
    !w || !h
      ? "original"
      : `${w < width ? w : width}x${h < height ? h : height}`;

  return prefix + size + suffix;
};

export const emptyCoffeeStore = {
  id: null,
  address: null,
  name: null,
  neighbourhood: null,
  imgUrl: null,
  websiteUrl: null,
};
