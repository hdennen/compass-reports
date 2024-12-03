import { dataEntry } from '../types';

export function transformToQuestionId(data: dataEntry<dataEntry>[]) {
  return data.map(item => {
    const newItem: { [key: string]: any } = {};
    for (const key in item) {
      if (typeof key === 'string') {
        const match = key.match(/\*(.*?)\*/);
        if (match) {
          newItem[match[1]] = { ...item[key], questionText: key };
        }
      }
    }
    return newItem;
  });
}
