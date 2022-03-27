
export const parseRecords = (records) => {
  return records.map((record) => {
    const { imgUrl, ...fields } = record.fields;
    const parsedImgUrl = JSON.parse(record.fields.imgUrl as string);
    return { imgUrl: parsedImgUrl, ...fields };
  });
};
