import Airtable from "airtable";

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

export default table;
