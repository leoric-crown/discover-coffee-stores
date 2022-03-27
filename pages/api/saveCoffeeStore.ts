import table, { findRecordById } from "../../lib/airtable";
import { createRecord } from "../../lib/airtable";

export default async (req, res) => {
  try {
    const coffeeStore = req.body;
    if (req.method === "POST") {
      const findCoffeeStore = await findRecordById(coffeeStore.id);

      if (findCoffeeStore) {
        return res.status(200).json({
          message: "Record already existed, returning now",
          record: findCoffeeStore.fields,
        });
      } else {
        const { id, name } = coffeeStore;
        if (id && name) {
          const newRecord = await createRecord(coffeeStore);
          return res.status(201).json({
            message: "Saved new record successfully!",
            record: newRecord.fields,
          });
        } else {
          return res.status(422).json({
            message: "Error: id or name fields are missing.",
            providedFields: { ...coffeeStore },
          });
        }
      }
    } else {
      return res.status(501).json({
        message: "Please send a POST request to use this endpoint",
      });
    }
  } catch (error) {
    res.status(500).json({
      message:
        "There was an unexpected error in saveCoffeeStore.ts: " + error.message,
    });
  }
};
