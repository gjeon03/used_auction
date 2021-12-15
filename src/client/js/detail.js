const productContainer = document.getElementById("detatilContainer");
const productData = document.querySelector(".product__data");
const imgContainer = document.getElementById("img_container");
const mainImg = imgContainer.querySelector(".product_main_img");
const thumbnails = imgContainer.querySelectorAll(".thumbnail");

const handleScrollResize = () => {
  const windowHeight = document.documentElement.scrollTop;
  const clientWidth = window.innerWidth;
  if (windowHeight > 300 && clientWidth > 834) {
    productData.style.position = "fixed";
    productData.style.top = "0";
  } else {
    productData.style.position = "static";
  }
};

const unitOfMoney = (productPriceBox) => {
  const money = productPriceBox.dataset.id;
  const moneyBox = productPriceBox.querySelector("div");
  moneyBox.innerText = money.replace(/\B(?<!\.\d|$)(?=(\d{3})+(?!\d))/g, ",");
};

const borderCheck = () => {
  const productCategory = productData.querySelector(".product_category");
  const productPriceBox = productData.querySelector("#product_price");
  unitOfMoney(productPriceBox);
  const categoryData = productCategory.dataset.id;
  switch (categoryData) {
    case "패션":
      productPriceBox.style.backgroundColor = "#e2d3b7";
      break;
    case "뷰티":
      productPriceBox.style.backgroundColor = "#ba7957";
      break;
    case "스포츠":
      productPriceBox.style.backgroundColor = "#aac6b9";
      break;
    case "가구/인테리어":
      productPriceBox.style.backgroundColor = "#70989d";
      break;
    case "생활":
      productPriceBox.style.backgroundColor = "#d3a745";
      break;
    case "디지털":
      productPriceBox.style.backgroundColor = "#ffce81";
      break;
    case "도서/취미":
      productPriceBox.style.backgroundColor = "#f9b3ca";
      break;
    case "기타":
      productPriceBox.style.backgroundColor = "#bbe1f2";
      break;
  }
};

const handleThumbnailChange = (event) => {
  const { src } = event.target;
  if (mainImg.src !== src) {
    mainImg.src = src;
  }
};

window.addEventListener("scroll", handleScrollResize);
window.addEventListener("resize", handleScrollResize);
borderCheck();
for (let thumbnail of thumbnails) {
  thumbnail.addEventListener("click", handleThumbnailChange);
}
