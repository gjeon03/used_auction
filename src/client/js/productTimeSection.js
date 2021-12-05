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
    timeSection.innerText = "SOLD OUT";
    timeSection.style.color = "#c20200";
  }
};

const productTimeSet = () => {
  for (let productDataForm of productDataForms) {
    const productA = productDataForm.querySelector(".product-mixin");
    if (productA) {
      borderCheck(productDataForm, productA);
    }
    productTime(productDataForm);
    //arrayResult[i].style.order = i;
    setInterval(() => {
      productTime(productDataForm);
      //arrayResult[i].style.order = i;
    }, 1000);
  }
};

const borderColorSet = (productDataForm, color) => {
  //const img = productDataForm.querySelector(".product-mixin__thumb img");
  productDataForm.style.borderTop = `10px solid ${color}`;
  //img.style.borderBottom = `3px solid ${color}`;
};

const borderCheck = (productDataForm, productA) => {
  const productCategory = productA.dataset.id;
  switch (productCategory) {
    case "패션":
      borderColorSet(productDataForm, "#e2d3b7");
      break;
    case "뷰티":
      borderColorSet(productDataForm, "#ba7957");
      break;
    case "스포츠":
      borderColorSet(productDataForm, "#aac6b9");
      break;
    case "가구/인테리어":
      borderColorSet(productDataForm, "#70989d");
      break;
    case "생활":
      borderColorSet(productDataForm, "#d3a745");
      break;
    case "디지털":
      borderColorSet(productDataForm, "#ffce81");
      break;
    case "도서/취미":
      borderColorSet(productDataForm, "#f9b3ca");
      break;
    case "기타":
      borderColorSet(productDataForm, "#bbe1f2");
      break;
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
