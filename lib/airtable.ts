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

  const coffeeStoreRecords = findRecords.map(parseImgUrl);

  return findRecords.length > 0 ? coffeeStoreRecords : undefined;
};
const parseImgUrl = (record) => {
  const parsedRecord = record;
  const coffeeStoreFields = record?.fields as any;
  if (coffeeStoreFields?.imgUrl) {
    const { imgUrl } = coffeeStoreFields;
    coffeeStoreFields.imgUrl = JSON.parse(imgUrl);
  }
  parsedRecord.fields = coffeeStoreFields;
  return parsedRecord;
};

export const upvoteCoffeeStore = async (id: string, votes: number) => {
  const updateArray = [
    {
      id,
      fields: { votes: votes + 1 },
    },
  ];
  try {
    const update = await table.update(updateArray);
    const parsedUpdate = update.map(parseImgUrl);
    return parsedUpdate[0].fields;
  } catch (error) {
    console.error("ERROR: Something went wrong", error.message);
  }
};

export const findRecordById = async (id: string) => {
  const findRecords = await table
    .select({
      filterByFormula: `id="${id}"`,
    })
    .firstPage();

  const coffeeStoreRecords = findRecords.map(parseImgUrl);

  return findRecords.length > 0 ? coffeeStoreRecords[0] : undefined;
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
  const { imgUrl, ...coffeeStoreNoImgUrl } = coffeeStore;
  const stringCoffeeStore = {
    imgUrl: JSON.stringify(imgUrl),
    ...coffeeStoreNoImgUrl,
  };
  const savedRecord = await table.create([
    {
      fields: { ...stringCoffeeStore },
    },
  ]);
  return savedRecord[0];
};

export const createRecords = async (coffeeStores: CoffeeStore[]) => {
  const stringCoffeeStores = coffeeStores.map((coffeeStore) => {
    const { imgUrl, ...coffeeStoreNoImgUrl } = coffeeStore;
    const stringCoffeeStore = {
      imgUrl: JSON.stringify(imgUrl),
      ...coffeeStoreNoImgUrl,
    };
    return stringCoffeeStore;
  });
  const fieldsToCreate = stringCoffeeStores.map((coffeeStore) => {
    return {
      fields: { ...coffeeStore },
    };
  });
  const savedRecords = await table.create(fieldsToCreate as any);

  return savedRecords;
};

export default table;
