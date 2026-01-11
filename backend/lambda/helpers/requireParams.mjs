export const requireParams = ({ obj, required }) => {
  for (const key of required) {
    if (obj[key] == null) {
      throw new Error(`Missing required parameter: ${key}`);
    }
  }
};
