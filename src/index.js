let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  loadToys();
});

const clearToys = () => {
  const parentNode = document.querySelector("#toy-collection");
  while (parentNode.lastElementChild) {
    parentNode.removeChild(parentNode.lastElementChild);
  }
};

const renderToy = (toy) => {
  const parentNode = document.querySelector("#toy-collection");
  const cardDiv = document.createElement("div");
  cardDiv.className = "card";
  const h2Element = document.createElement("h2");
  h2Element.textContent = toy.name;
  cardDiv.append(h2Element);
  const img = document.createElement("img");
  img.src = toy.image;
  img.className = "toy-avatar";
  cardDiv.append(img);
  const pElement = document.createElement("p");
  pElement.textContent = `${toy.likes} likes`;
  cardDiv.append(pElement);
  const btn = document.createElement("button");
  btn.addEventListener("click", likeFunc);
  btn.className = "like-btn";
  btn.id = toy.id;
  btn.dataset.likes = toy.likes;
  btn.textContent = "Like ❤️";
  cardDiv.append(btn);
  parentNode.append(cardDiv);
};

const loadToys = () => {
  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((toys) => {
      toys.forEach(renderToy);
    });
};

document.querySelector("form.add-toy-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const newToy = {};
  newToy.name = e.target.name.value;
  newToy.image = e.target.image.value;
  newToy.likes = 0;
  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newToy),
  })
    .then((res) => res.json())
    .then((toy) => renderToy(toy));
});

const likeFunc = (event) => {
  const newNumberOfLikes = ++event.target.dataset.likes;
  fetch(`http://localhost:3000/toys/${event.target.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ likes: newNumberOfLikes }),
  }).then(() => {
    event.target.parentNode.querySelector(
      "p"
    ).textContent = `${newNumberOfLikes} likes`;
  });
};

const refreshToys = () => {
  clearToys();
  loadToys();
};
