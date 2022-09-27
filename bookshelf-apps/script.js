const books = [];
const RENDER_EVENT = 'render-book';


document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
   if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const textbook = document.getElementById('inputBookTitle').value;
  const penulisbook = document.getElementById('inputBookAuthor').value;
  const timestamp = document.getElementById('inputBookYear').value;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, textbook, penulisbook, timestamp, false);
  books.push(bookObject);
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateId() {
  return +new Date();
}
 
function generateBookObject(id, task, penulis, timestamp, isCompleted) {
  return {
    id,
    task,
    penulis,
    timestamp,
    isCompleted
  }
}

document.addEventListener(RENDER_EVENT, function () {
  console.log(books);
});

function makeBook(bookObject) {
  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.task;
  
  const textpenulis = document.createElement('p');
  textpenulis.innerText = bookObject.penulis;

  const textTimestamp = document.createElement('p');
  textTimestamp.innerText = bookObject.timestamp;
 
  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(textTitle, textpenulis, textTimestamp);
 
  const container = document.createElement('article');
  container.classList.add('book_item');
  container.append(textContainer);
  container.setAttribute('id', 'book-${bookObject.id}');
 
  if (bookObject.isCompleted) {
    const Buttonundone = document.createElement('button');
    Buttonundone.classList.add('green');
    Buttonundone.innerText = "Belum selesai di Baca";

    const undoButton = document.createElement('div');
    undoButton.classList.add('action');
    undoButton.append(Buttonundone);

    undoButton.addEventListener('click', function() {
      undoTaskFromCompleted(bookObject.id);
    });

    const Buttonhapus = document.createElement('button');
    Buttonhapus.classList.add('red');
    Buttonhapus.innerText = "Hapus buku";

    const trashButton = document.createElement('div');
    trashButton.classList.add('action');
    trashButton.append(Buttonhapus);
 
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
    });
 
    container.append(undoButton, trashButton);
  } else {
    const Buttondone = document.createElement('button');
    Buttondone.classList.add('green');
    Buttondone.innerText = "Selesai dibaca";


    const checkButton = document.createElement('div');
    checkButton.classList.add('action');
    checkButton.append(Buttondone);

    checkButton.addEventListener('click', function(){
      addTaskToCompleted(bookObject.id);
    });

    const Buttonhapus = document.createElement('button');
    Buttonhapus.classList.add('red');
    Buttonhapus.innerText = "Hapus buku";

    const trashButton = document.createElement('div');
    trashButton.classList.add('action');
    trashButton.append(Buttonhapus);

    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
    });
    
    container.append(checkButton, trashButton);
  }

  return container;
}

document.addEventListener(RENDER_EVENT, function() {
  const uncompletedBookList = document.getElementById('incompleteBookshelfList');
  uncompletedBookList.innerHTML= '';

  const completedBookList = document.getElementById('completeBookshelfList');
  completedBookList.innerHTML = '';

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isCompleted) 
    uncompletedBookList.append(bookElement);
    else 
    completedBookList.append(bookElement);
  }
});

function addTaskToCompleted (bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
 
  if (bookTarget === -1) return;
 
  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
 
 
function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
 
  if (bookTarget == null) return;
 
  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
 
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
 
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}
