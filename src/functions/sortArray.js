import { Timestamp } from "firebase/firestore";
//will sort your array based on one of the objects's properties

//TODO: sort by date
//Sort by ascending alphabetical order
export const ascendingAlphabeticalSort = (inputArray, objProp) => {
  const sortedArray = inputArray.sort((a, b) => {
    const propA = a[objProp];
    const propB = b[objProp];

    // Check if both properties are integers
    if (Number.isInteger(propA) && Number.isInteger(propB)) {
      return propA - propB;
    }

    // Check if both properties are strings
    if (typeof propA === "string" && typeof propB === "string") {
      return propA.localeCompare(propB);
    }

    // If one or both properties are not integers or strings, convert to strings and compare
    return String(propA).localeCompare(String(propB));
  });

  return sortedArray;
};

//Sort by descending alphabetical order
export const descendingAlphabeticalSort = (inputArray, objProp) => {
  const sortedArray = ascendingAlphabeticalSort(inputArray, objProp);
  return sortedArray.reverse();
};

//sort array items based on timestamp

export const sortByFirebaseTimestamp = (arrayOfObjects, key) => {
  return arrayOfObjects
    .slice()
    .sort((a, b) => {
      const timestampA = a[key] instanceof Timestamp ? a[key].toMillis() : 0;
      const timestampB = b[key] instanceof Timestamp ? b[key].toMillis() : 0;

      return timestampB - timestampA;
    })
    .reverse();
};
