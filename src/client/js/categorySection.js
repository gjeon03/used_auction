const searchBtn = document.getElementById("search_btn");
const productSortType = document.getElementById("products_sortType");

let searchClickCheck = true;

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

searchBtn.addEventListener("click", handleSearchClick);

if (productSortType) {
  const sortForm = productSortType.querySelector("form");
  const sortFormInputs = sortForm.querySelectorAll("input");
  const sortBtnClickCheck = productSortType.dataset.id;

  for (let sortInput of sortFormInputs) {
    sortInput.addEventListener("click", () => sortForm.submit());
  }
  if (sortBtnClickCheck) {
    const ckeckedInput = sortForm.querySelector(`.${sortBtnClickCheck}`);
    const ckecked = ckeckedInput.querySelector("label");
    ckecked.className = "checked";
  } else {
    const ckeckedInput = sortForm.querySelector(".produce");
    const ckecked = ckeckedInput.querySelector("label");
    ckecked.className = "checked";
  }
}
