import Airtable from "airtable";
import { CoffeeStore } from "../types";

const base = new Airtable({ apiKey: process.env.AIRTABLEAPIKEY }).base(
  process.env.AIRTABLEBASEID
);
const table = base("coffee-stores");

export const findRecordsById = async (records) => {
  const ids = records.map((record) => record.id);
  const formula = "OR(" + ids.map((id) => `{id} = "${id}"`).join(",") + ")";
  const findRecords = await table
    .select({
      filterByFormula: formula,
    })
    .firstPage();

  return findRecords.length > 0 ? findRecords : undefined;
};

export const findRecordById = async (id: string) => {
  const findRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  return findRecords.length > 0 ? findRecords[0] : undefined;
};

export const findStaticPageRecords = async () => {
  const findRecords = await table
    .select({
      filterByFormula: `static`,
    })
    .firstPage();

  return findRecords;
};

export const getCoffeeStoreFromRecord = (record) => {
  return record.fields as CoffeeStore;
};

export const createRecord = async (coffeeStore: CoffeeStore) => {
  const savedRecord = await table.create([
    {
      fields: { ...coffeeStore },
    },
  ]);
  return savedRecord[0];
};

export const createRecords = async (coffeeStores: CoffeeStore[]) => {
  const fieldsToCreate = coffeeStores.map((coffeeStore) => {
    return {
      fields: { ...coffeeStore },
    };
  });
  const savedRecords = await table.create(fieldsToCreate);
  return savedRecords;
};

export default table;
