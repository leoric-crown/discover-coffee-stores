import table, {
  findRecordById,
  getCoffeeStoreFromRecord,
} from "../../lib/airtable";
import { upvoteCoffeeStore } from "../../lib/airtable";

export default async (req, res) => {
  try {
    if (req.method === "GET") {
      const { id } = req.query;
      const findCoffeeStoreRecord = await findRecordById(id);
      if (findCoffeeStoreRecord) {
        const dbId = findCoffeeStoreRecord.id;
        const updatedCoffeeStore = await upvoteCoffeeStore(
          dbId,
          findCoffeeStoreRecord.fields.votes
        );
        return res.status(200).json({
          message: "Record has been upvoted!",
          newNumVotes: updatedCoffeeStore.votes,
          coffeeStore: updatedCoffeeStore,
        });
      } else {
        return res.status(404).json({
          message: `Error upvoting, record with id ${id} not found`,
        });
      }
    } else {
      return res.status(501).json({
        message: "Please send a GET request to use this endpoint",
      });
    }
  } catch (error) {
    res.status(500).json({
      message:
        "There was an unexpected error in upvoteCoffeeStore.ts: " +
        error.message,
    });
  }
};
