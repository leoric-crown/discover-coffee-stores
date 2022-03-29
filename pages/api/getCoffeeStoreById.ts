import { findRecordById } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        message: "Please add an id query parameter to the request",
      });
    }
    const findCoffeeStore = await findRecordById(id);

    if (findCoffeeStore) {
      return res.status(200).json({
        message: "Record found! Returning now",
        record: findCoffeeStore,
      });
    } else {
      return res.status(404).json({
        message: `Record with id ${id} not found!`,
        id,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message:
        "There was an unexpected error in getCoffeeStoreById.ts: " +
        error.message,
    });
  }
};


export default getCoffeeStoreById