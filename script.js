const addBtn = document.querySelector(".search");
const searchIcon = document.querySelector(".i");
const add = document.querySelector(".name");
const formBtn = document.querySelector(".add");
const deleteBtn = document.querySelector(".delete");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const titleInput = document.querySelector(".title");
const authorInput = document.querySelector(".author");
const numberInput = document.querySelector(".number");
const genreInput = document.querySelector(".genre");
const readInput = document.querySelector(".checkbox");
const cardContainer = document.querySelector(".grid");
const totalBooksNum = document.querySelector(".B-num");
const BooksRead = document.querySelector(".B-read");
const BooksNotRead = document.querySelector(".B-nread");
const BooksFav = document.querySelector(".favo");
const BooksNotFav = document.querySelector(".unfavolog");
let favclicked = true;
let unFavclicked = true;
let completed = true;

//UI manipulation
const scaleEffect = function (element) {
  element.addEventListener("click", () => {
    element.style.scale = "1.1";
    setTimeout(() => {
      element.style.scale = "1";
    }, 200);
  });
};
scaleEffect(add);
scaleEffect(formBtn);

addBtn.addEventListener("click", () => {
  const currentRotation = parseInt(
    searchIcon.style.transform.replace("rotate(", "").replace("deg)", "")
  );

  const newRotation = currentRotation === 0 ? 360 : 0;
  searchIcon.style.transform = `rotate(${newRotation}deg)`;
  scaleEffect(addBtn);

  const currentLeft = parseInt(add.style.left.replace("px", ""));
  const currnetV = add.style.visibility;
  const newLeft = currentLeft === 30 ? 60 : 30;
  add.style.left = `${newLeft}px`;
  add.style.visibility = currnetV === "hidden" ? "visible" : "hidden";

  const currentOp = parseFloat(add.style.opacity);
  const newOp = currentOp === 0 ? 1 : 0;
  add.style.opacity = newOp;
});

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");

  add.style.opacity = "0";
  add.style.left = "30px";
  add.style.visibility = "hidden";

  titleInput.value = "";
  authorInput.value = "";
  numberInput.value = "";
  genreInput.value = "";
  readInput.checked = false;
};

add.addEventListener("click", openModal);
overlay.addEventListener("click", closeModal);
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

//library logic
const library = [];

const Book = function (title, author, pages, genre, read) {
  this.title = title,
  this.author = author,
  this.pages = pages,
  this.genre = genre,
  this.read = read,
    (this.info = function () {
      return `${this.title} by ${this.author}, ${this.pages} pages,${this.genre} and ${this.read}`;
    });
};

const addBook = function () {
  const title = titleInput.value;
  const author = authorInput.value.split(" ").join("");
  const pages = numberInput.value;
  const genre = genreInput.value;
  const read = readInput.checked ? "read" : "not read";
  const book = new Book(title, author, pages, genre, read);
  library.push(book);

  const markup = `<div class="card" data-index="${library.indexOf(book)}">
  <button class="delete material-symbols-outlined">delete</button>
  <div class="text-container">
    <div class="wrap">
      <p class="titleText">${book.title}</p>
      <p class="authorText">${book.author}</p>
      <p class="numberText">${book.pages}</p>
      <p class="genreText">${book.genre}</p>
      <p class="readText">${book.read}</p>
    </div>
    <div class="btn-wrap">
      <button class="like material-symbols-outlined">favorite</button>
      <button class="unfavo material-symbols-outlined">sentiment_dissatisfied
      </button>
    </div>
    <button class="complete">completed</button>
  </div>
</div>`;

  cardContainer.insertAdjacentHTML("beforeend", markup);
  totalBooksNum.textContent = library.length;
  updateLogState();
};

formBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (titleInput.value === "") return;
  addBook();
  closeModal();
});

cardContainer.addEventListener("click", (e) => {
  const target = e.target.closest(".card");

  if (!target) return;

  const favBtn = target.querySelector(".like");
  const removeBtn = target.querySelector(".unfavo");
  const completeBtn = target.querySelector(".complete");
  scaleEffect(favBtn);
  scaleEffect(removeBtn);
  scaleEffect(completeBtn);

  if (e.target.classList.contains("like")) {
    toggleButtonState(target, favBtn, "fav");
  }
  if (e.target.classList.contains("unfavo")) {
    toggleButtonState(target, removeBtn, "unfav");
  }
  if (e.target.classList.contains("complete")) {
    toggleButtonState(target, completeBtn, "completed");
    if (
      target.closest(".card").querySelector(".readText").textContent ===
      "not read"
    ) {
      target.closest(".card").querySelector(".readText").textContent = "read";
      completed = !completed;
    } else if (
      target.closest(".card").querySelector(".readText").textContent === "read"
    ) {
      target.closest(".card").querySelector(".readText").textContent =
        "not read";
      completed = !completed;
    }
  }
  if (e.target.classList.contains("delete")) {
    const index = target.closest(".card").dataset.index;

    target.closest(".card").remove();

    target.closest(".card").querySelector(".readText").textContent === "read"
      ? BooksRead.textContent--
      : BooksNotRead.textContent--;

    totalBooksNum.textContent--;

    if (
      target.closest(".card").querySelector(".like").style.backgroundColor ===
      "rgb(81, 216, 68)"
    )
      BooksFav.textContent--;

    if (
      target.closest(".card").querySelector(".unfavo").style.backgroundColor ===
      "rgb(226, 71, 71)"
    )
      BooksNotFav.textContent--;

    library.splice(index, 1);
  }
});

function toggleButtonState(card, button, state) {
  const currentValue = card.dataset[state] === "true";
  card.dataset[state] = !currentValue;
  updateLogState();
  updateButtonAppearance(button, state);
}

function updateLogState() {
  const favBooks = cardContainer.querySelectorAll(
    '.card[data-fav="true"]'
  ).length;
  const unfavBooks = cardContainer.querySelectorAll(
    '.card[data-unfav="true"]'
  ).length;
  const completedBooks = cardContainer.querySelectorAll(
    '.card[data-completed="true"]'
  ).length;

  BooksFav.textContent = favBooks;
  BooksNotFav.textContent = unfavBooks;
  BooksRead.textContent = completedBooks;
  BooksNotRead.textContent = totalBooksNum.textContent - completedBooks;
}

function updateButtonAppearance(button, state) {
  if (button && button.style) {
    const isActive = button.closest(".card").dataset[state] === "true";
    button.style.backgroundColor = isActive
      ? button.classList.contains("unfavo")
        ? "rgb(226, 71, 71)"
        : "rgb(81, 216, 68)"
      : "grey";
  }
}