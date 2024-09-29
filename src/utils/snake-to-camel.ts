const snakeToCamelKey = (string: string) => {
  let splitStringArr = string.split("_");
  let builtStr = splitStringArr.reduce((acc, curr, i) => {
    curr = i !== 0 ? curr[0].toUpperCase() + curr.slice(1) : curr;
    return acc + curr;
  }, "");
  return builtStr;
};

export const snakeToCamel = (response: Record<string, unknown>) => {
  let parentKeys = Object.keys(response);

  parentKeys.forEach((key) => {
    let currentObj = response[key];
    delete response[key];

    let newKey = snakeToCamelKey(key);
    response[newKey] = currentObj;

    if (response[newKey] !== null && typeof response[newKey] === "object") {
      snakeToCamel(response[newKey] as Record<string, unknown>);
    }
  });

  return response;
};
