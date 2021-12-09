const productContainer = document.getElementById("detailContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll(".comment__delete");

const addComment = (text, id, username) => {
  const productComments = document.querySelector(".product__comments ul");
  const newComment = document.createElement("li");
  newComment.dataset.id = id;
  newComment.className = "product__comment";
  //comment__data_user
  const userDiv = document.createElement("div");
  userDiv.className = "comment__data_user";
  const userSpan = document.createElement("span");
  userSpan.className = "comment__username";
  userSpan.innerText = username;
  const deleteSpan = document.createElement("span");
  deleteSpan.innerText = "❌";
  deleteSpan.className = "comment__delete";
  userDiv.appendChild(userSpan);
  userDiv.appendChild(deleteSpan);
  //comment__data_text
  const textDiv = document.createElement("div");
  textDiv.className = "comment__data_text";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.className = "comment__text";
  span.innerText = ` ${text}`;
  textDiv.appendChild(icon);
  textDiv.appendChild(span);
  //li
  newComment.appendChild(userDiv);
  newComment.appendChild(textDiv);
  productComments.prepend(newComment);
  deleteSpan.addEventListener("click", handleDelete);
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
    const { newCommentId, username } = await response.json();
    addComment(text, newCommentId, username);
  }
};

const deleteComment = (event) => {
  const {
    target: {
      parentNode: { parentNode },
    },
  } = event;
  const commentContainer = document.querySelector(".product__comments ul");
  commentContainer.removeChild(parentNode);
};

const handleDelete = async (event) => {
  const {
    target: {
      parentNode: {
        parentNode: {
          dataset: { id },
        },
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
