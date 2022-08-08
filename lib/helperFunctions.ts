export const getUrlImageOfSize = (images, imageSize: number) => {
  let url;

  for (let i = 0; i < images?.length; i++) {
    if (imageSize === images[i].height) {
      url = images[i].url;
    }
  }
  return url;
};
