const productDataForms = document.querySelectorAll(".product_data");

const productTime = (productDataForm) => {
  const productsData = productDataForm.dataset.id;
  const endAt = new Date(productsData).getTime();
  const timeSection = productDataForm.querySelector(".product__period");
  const nowAt = new Date().getTime();
  const result = endAt - nowAt;
  if (result > 0) {
    let days = Math.floor(result / (1000 * 60 * 60 * 24));
    let hours = Math.floor((result % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((result % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((result % (1000 * 60)) / 1000);
    const resultTime =
      days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
    timeSection.innerText = resultTime;
  } else {
    timeSection.innerText = "end";
  }
};

const productTimeSet = () => {
  for (let i = 0; i < productDataForms.length; i++) {
    productTime(productDataForms[i]);
    //arrayResult[i].style.order = i;
    setInterval(() => {
      productTime(productDataForms[i]);
      //arrayResult[i].style.order = i;
    }, 1000);
  }
};

//Product Sort
// const quickSort = (arr) => {
//   if (arr.length <= 1) return arr;

//   const pivot = arr[0];
//   const left = [];
//   const right = [];

//   for (let i = 1; i < arr.length; i++) {
//     if (
//       new Date(arr[i].dataset.id).getTime() <=
//       new Date(pivot.dataset.id).getTime()
//     ) {
//       left.push(arr[i]);
//     } else {
//       right.push(arr[i]);
//     }
//   }

//   const lSorted = quickSort(left);
//   const rSorted = quickSort(right);
//   return [...lSorted, pivot, ...rSorted];
// };

// let productArray = productDataForms;

// const arrayResult = quickSort(productArray);

productTimeSet();
