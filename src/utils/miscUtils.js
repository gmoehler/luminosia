// filter out 'allowedKeys' and keys of 'keysToArray'
// convert key-value pairs in keysToArray to array
export const filterObjectByKeys = (obj, allowedKeys, keysToArray = []) => {
  return Object.keys(obj).filter(key => 
    allowedKeys.includes(key) || Object.keys(keysToArray).includes(key))
    .reduce((o, key) => {
      if (allowedKeys.includes(key)) {
        return {
          ...o,
          [key]: obj[key]
        };
      } else {
        // new key is value of key in keysToArray
        const newKey = keysToArray[key];
        return {
          ...o,
          [newKey]: Object.values(obj[key])
        };
      }
    }, {});
};
