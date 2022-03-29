import { QueryParameters, fetchCoffeeStoreData } from "../../lib/foursquare";

const getCoffeeStores = async (req: { query: QueryParameters }, res) => {
  try {
    const queryParameters = req.query;
    const coffeeStoreData = await fetchCoffeeStoreData(queryParameters)
    res.status(200).json(coffeeStoreData);
  } catch (error) {
      res.status(500).json({ message:'There was an unexpected error: ' + error.message})
  }
};


export default getCoffeeStores