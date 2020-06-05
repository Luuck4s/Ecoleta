interface Item {
  image: string;
}

export const serializedArray = (items: Item[] = []) => {
  return items.map((item: Item) => {
    return {
      ...item,
      image_url: `http://192.168.0.103:3333/uploads/${item.image}`,
    };
  });
};

export const serializedObject = (item: Item) => {
  return {
    ...item,
    image_url: `http://192.168.0.103:3333/uploads/${item.image}`,
  };
};

