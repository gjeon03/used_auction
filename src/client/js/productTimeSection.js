const productDataForms = document.querySelectorAll(".product_data");

const nowTime = new Date().getTime();

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

const productTimeSet = (arrayResult) => {
  for (let i = 0; i < arrayResult.length; i++) {
    productTime(arrayResult[i]);
    arrayResult[i].style.order = i;
    setInterval(() => {
      productTime(arrayResult[i]);
      arrayResult[i].style.order = i;
    }, 1000);
  }
};

//Product Sort
const productTimeArraySet = (productDataForms) => {
  let tmp = [];
  let tmpEnd = [];
  for (let productDataForm of productDataForms) {
    const dataTime = new Date(productDataForm.dataset.id).getTime();
    if (dataTime - nowTime > 0) {
      tmp.push(dataTime);
    } else {
      tmpEnd.push(dataTime);
    }
    tmp.concat(tmpEnd);
  }
  return tmp;
};

const quickSort = function (arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[0];
  const left = [];
  const right = [];

  for (let i = 1; i < arr.length; i++) {
    if (
      new Date(arr[i].dataset.id).getTime() <=
      new Date(pivot.dataset.id).getTime()
    ) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  const lSorted = quickSort(left);
  const rSorted = quickSort(right);
  return [...lSorted, pivot, ...rSorted];
};

let productArray = productDataForms;
let productTimeArray = productTimeArraySet(productArray);

const arrayResult = quickSort(productArray);

productTimeSet(arrayResult);
