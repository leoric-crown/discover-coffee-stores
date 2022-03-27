import table, { findRecordsById } from "../../lib/airtable";
import { CoffeeStore } from "../../types";
import { createRecords } from "../../lib/airtable";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(501).json({
      message: "Please send a POST request to use this endpoint",
    });
  }

  try {
    const coffeeStores: CoffeeStore[] = req.body;
    const findCoffeeStores = await findRecordsById(req.body);
    if (findCoffeeStores && findCoffeeStores.length > 0) {
      const existingRecords = findCoffeeStores.map((result) => result.fields);
      const existingIds = existingRecords.map((r) => r.id);
      return res.status(200).json({
        message:
          "Some (or all) records already existed " +
          "(see existingRecords and nonExistingRecords), " +
          "please re-form your request",
        existingRecords,
        nonExistingRecords: coffeeStores.filter(
          (coffeeStore) => !existingIds.includes(coffeeStore.id)
        ),
      });
    } else {
      const haveMinData = coffeeStores.reduce((prevCheck, coffeeStore) => {
        return !!(prevCheck && coffeeStore.name && coffeeStore.id);
      }, true);
      if (haveMinData) {
        const newRecords = await createRecords(coffeeStores);
        return res.status(201).json({
          message: "Saved new records successfully!",
          records: newRecords.map((record) => record.fields),
        });
      } else {
        return res.status(422).json({
          message: "Error: id or name fields are missing.",
          providedFields: coffeeStores.map((coffeeStore) =>
            Object.keys(coffeeStore)
          ),
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message:
        "There was an unexpected error in saveCoffeeStores.ts: " +
        error.message,
    });
  }
};
