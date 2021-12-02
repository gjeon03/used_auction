const productContainer = document.getElementById("detailContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll(".comment__delete");

const addComment = (text, id) => {
  const productComments = document.querySelector(".product__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "product__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.className = "comment__text";
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";
  span2.className = "comment__delete";
  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  productComments.prepend(newComment);
  span2.addEventListener("click", handleDelete);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const productId = productContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/products/${productId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

const deleteComment = (event) => {
  const {
    target: { parentNode },
  } = event;
  const commentContainer = document.querySelector(".product__comments ul");
  commentContainer.removeChild(parentNode);
};

const handleDelete = async (event) => {
  const {
    target: {
      parentNode: {
        dataset: { id },
      },
    },
  } = event;
  const productId = productContainer.dataset.id;
  const response = await fetch(`/api/comments/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId }),
  });
  if (response.status === 200) {
    deleteComment(event);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

if (deleteBtn) {
  for (let i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener("click", handleDelete);
  }
}
