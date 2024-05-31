export const deepClone = (obj) => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (obj instanceof Date) {
      return new Date(obj);
    }
    if (Array.isArray(obj)) {
      return obj.map(item => deepClone(item));
    }
    if (typeof obj === 'object') {
      let clonedObj = {};
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
    return obj;
}

export default deepClone;
