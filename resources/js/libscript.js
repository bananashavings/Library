"use strict";
//TODO:
//Pages
const deleteButton = document.getElementById("delete");
const tableBody = document.getElementById("table-body");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");
const searchBar = document.getElementById("search");
const masterCheckbox = document.getElementById("header-checkbox");
const bookTemplate = document.getElementById("book-template");
masterCheckbox.addEventListener("click", () => { selectAllButtons(masterCheckbox.checked); });
deleteButton.addEventListener("click", () => { removeSelectedBooks(); });
searchBar.addEventListener("keyup", (event) => { search(event, searchBar.value); });
document.addEventListener("keypress", (event) => { focusSearchBar(event); });
let library = loadLibrary();
let bookIndex = +localStorage.getItem("bookIndex");
if (!bookIndex) {
    bookIndex = 0;
}
render(getBooks());
class Book {
    constructor(title, author, pages, status = false) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.status = status;
        this.id = bookIndex++;
        localStorage.setItem("bookIndex", bookIndex.toString());
        console.log(bookIndex);
    }
}
function addToLibrary(title, author, pages, status = false) {
    library.push(new Book(title, author, pages, status));
    saveLibrary();
}
function removeFromLibrary(id) {
    let index = library.map(book => {
        return book.id;
    }).indexOf(id);
    library.splice(index, 1);
}
function removeSelectedBooks() {
    Array.from(tableBody.getElementsByTagName("input")).forEach(checkbox => {
        if (checkbox.checked) {
            let book = checkbox.parentElement.parentElement;
            removeFromLibrary(+book.dataset.id);
            book.remove();
        }
    });
    saveLibrary();
}
function getBooks(sortFunction = compareBookTitle, reverse = false, entries = 5) {
    const bookList = library.sort(sortFunction);
    if (reverse) {
        bookList.reverse();
    }
    return bookList.slice(0, entries);
}
function render(books) {
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    books.forEach(book => {
        const template = bookTemplate.content.cloneNode(true);
        template.querySelector("tr").dataset.id = book.id.toString();
        template.querySelector("#book-title").innerHTML = book.title;
        template.querySelector("#book-author").innerHTML = book.author;
        template.querySelector("#book-pages").innerHTML = book.pages.toString();
        template.querySelector("#book-status").innerHTML = book.status.toString();
        const checkBox = template.querySelector("#book-checkbox");
        template.querySelector("input").addEventListener("click", function (event) { checkBox.checked = !checkBox.checked; });
        template.querySelector("tr").addEventListener("click", function () { checkBox.checked = !checkBox.checked; });
        tableBody.appendChild(template);
    });
}
function saveLibrary() {
    localStorage.setItem("library", JSON.stringify(library));
}
function loadLibrary() {
    const savedLibrary = JSON.parse(localStorage.getItem("library"));
    if (savedLibrary != null) {
        return savedLibrary;
    }
    else {
        return [];
    }
}
function selectAllButtons(checked) {
    Array.from(tableBody.getElementsByTagName("input")).forEach(input => {
        input.checked = checked;
    });
}
function search(event, query) {
    let bookList = [];
    query = query.toLowerCase();
    console.log(query);
    library.forEach(book => {
        if (book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)) {
            bookList.push(book);
        }
    });
    render(bookList);
}
function focusSearchBar(event) {
    if (event.keyCode == 13) {
        if (searchBar == document.activeElement) {
            searchBar.blur();
        }
        else {
            searchBar.focus();
        }
    }
}
function compareBookTitle(a, b) {
    if (a.title < b.title) {
        return -1;
    }
    if (a.title > b.title) {
        return 1;
    }
    return 0;
}
function compareBookAuthor(a, b) {
    if (a.author < b.author) {
        return -1;
    }
    if (a.author > b.author) {
        return 1;
    }
    return 0;
}
function compareBookPages(a, b) {
    if (a.pages < b.pages) {
        return -1;
    }
    if (a.pages > b.pages) {
        return 1;
    }
    return 0;
}
function compareBookStatus(a, b) {
    if (a.status == true && b.status == false) {
        return -1;
    }
    if (a.status == false && b.status == true) {
        return 1;
    }
    return 0;
}
