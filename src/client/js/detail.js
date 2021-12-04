const productContainer = document.getElementById("detatilContainer");
// const productBidForm = productContainer.querySelector(".product_toBid");

// console.log(productBidForm.)

const handleScrollResize = () => {
  const windowHeight = document.documentElement.scrollTop;
  const clientWidth = window.innerWidth;
  const test = document.querySelector(".product__data");
  if (windowHeight > 300 && clientWidth > 834) {
    test.style.position = "fixed";
    test.style.top = "0";
  } else {
    test.style.position = "static";
  }
};

window.addEventListener("scroll", handleScrollResize);
window.addEventListener("resize", handleScrollResize);
