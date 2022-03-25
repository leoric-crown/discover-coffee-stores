import Airtable from "airtable";
import { CoffeeStore } from "../types";

const base = new Airtable({ apiKey: process.env.AIRTABLEAPIKEY }).base(
  process.env.AIRTABLEBASEID
);
const table = base("coffee-stores");

export const findRecordById = async (id: string) => {
  const findRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return findRecords.length > 0 ? findRecords[0] : undefined;
};

export const getCoffeeStoreFromRecord = (record) => {
  return record.fields as CoffeeStore
}

export default table;
