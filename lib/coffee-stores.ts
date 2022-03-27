import { CoffeeStore } from "../types";

export const decodeCoffeeStoreURIs = (coffeeStores: CoffeeStore[]) => {
  const decodedCoffeeStores = coffeeStores.map((coffeeStore) => {
    const keys = Object.keys(coffeeStore);
    let decoded = coffeeStore;
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
  } catch (error) {
    console.error("Error creating coffeestore", {
      newCoffeeStore,
      error: error.message,
    });
  }
};