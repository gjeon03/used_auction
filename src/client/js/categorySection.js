const searchBtn = document.getElementById("search_btn");
const productSortType = document.getElementById("products_sortType");
const sortForm = productSortType.querySelector("form");
const sortFormInputs = sortForm.querySelectorAll("input");

let searchClickCheck = true;
const sortBtnClickCheck = productSortType.dataset.id;

const handleSearchClick = (event) => {
  const searchBox = document.getElementById("search_box");
  if (searchClickCheck) {
    searchClickCheck = false;
    searchBox.style.display = "inline";
  } else {
    searchClickCheck = true;
    searchBox.style.display = "none";
  }
};

const handleSortClick = () => {
  sortForm.submit();
};

searchBtn.addEventListener("click", handleSearchClick);
for (let sortInput of sortFormInputs) {
  sortInput.addEventListener("click", handleSortClick);
}
if (sortBtnClickCheck) {
  const ckeckedInput = sortForm.querySelector(`.${sortBtnClickCheck}`);
  const ckecked = ckeckedInput.querySelector("label");
  ckecked.className = "checked";
}
