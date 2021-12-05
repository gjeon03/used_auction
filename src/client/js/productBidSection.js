const productContainer = document.getElementById("detailContainer");
const bidForm = productContainer.querySelector("#priceForm");

const fixCurrentPrice = (buyer, price) => {
  const buyerBox = productContainer.querySelector(".product_buyer div");
  const priceBox = productContainer.querySelector(".price_box");
  buyerBox.innerText = buyer;
  priceBox.innerText = price;
};

const handleBidSubmit = async (event) => {
  event.preventDefault();
  const priceInputBox = bidForm.querySelector(".price_number");
  const price = priceInputBox.value;
  const productId = productContainer.dataset.id;
  if (price === "") {
    return;
  }
  const response = await fetch(`/api/product/bid/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ price }),
  });
  if (response.status === 201) {
    const { buyer } = await response.json();
    fixCurrentPrice(buyer, price);
  } else {
    const { errorMessage } = await response.json();
    const errormessage = document.querySelector(".errorMessage");
    const createErrorMessage = document.createElement("span");
    createErrorMessage.className = "message";
    createErrorMessage.innerText = errorMessage;
    errormessage.appendChild(createErrorMessage);
    errormessage.style.display = "inline";
  }
  priceInputBox.value = "";
};

if (bidForm) {
  bidForm.addEventListener("submit", handleBidSubmit);
}
