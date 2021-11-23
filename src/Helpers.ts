function flatten_(
  obj: Record<PropertyKey, unknown>,
  parentKey?: string
): Record<PropertyKey, string | number | boolean> {
  let res = {};

  for (const [key, value] of Object.entries(obj)) {
    const propName = parentKey ? parentKey + "." + key : key;

    if (typeof value === "object" && value !== null) {
      res = {
        ...res,
        ...flatten_(value as Record<PropertyKey, unknown>, propName),
      };
    } else {
      res[propName] = value;
    }
  }

  return res;
}

function nodesToRows(nodes: Record<PropertyKey, unknown>[]) {
  let header = [];
  const rows = [];
  for (const obj of nodes) {
    const row = [];
    const data = flatten_(obj);

    // prepare header
    const keys = Object.keys(data);
    if (header.length < keys.length) {
      header = keys;
    }

    // add data rows following the header
    for (const key of header) {
      row.push(data[key]);
    }
    rows.push(row);
  }

  return [header, ...rows];
}
