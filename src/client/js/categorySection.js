const searchBtn = document.getElementById("search_btn");

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
