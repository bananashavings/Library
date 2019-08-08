"use strict";
const newBookForm = document.getElementById("form-container");
const newBookButton = document.getElementById("new-book-button");
const deleteBookButton = document.getElementById("delete");
const tableBody = document.getElementById("table-body");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");
const searchBar = document.getElementById("search");
const masterCheckbox = document.getElementById("header-checkbox");
const bookTemplate = document.getElementById("book-template");
const headerButtons = document.getElementsByClassName("header-button");
masterCheckbox.addEventListener("click", () => { selectAllButtons(masterCheckbox.checked); });
deleteBookButton.addEventListener("click", () => { removeSelectedBooks(); });
leftArrow.addEventListener("click", () => { changePage(false); });
rightArrow.addEventListener("click", () => { changePage(true); });
searchBar.addEventListener("keyup", (event) => { search(event, searchBar.value); });
document.addEventListener("keypress", (event) => { focusSearchBar(event); });
newBookButton.addEventListener("click", () => {
    if (newBookForm.style.display == "none") {
        newBookForm.style.display = "inline-flex";
    }
    else {
        newBookForm.style.display = "none";
    }
});
Array.from(headerButtons).forEach(headerButton => {
    headerButton.addEventListener("click", () => {
        const sortingFunctionName = headerButton.dataset.sort;
        const sortingReverse = headerButton.dataset.reverse == "true" ? true : false;
        sortBooks(window[sortingFunctionName], sortingReverse);
        render();
        headerButton.dataset.reverse = (!sortingReverse).toString();
    });
});
let pageIndex = 0;
let entriesPerPage = 5;
let library = loadLibrary();
let libraryView = library;
libraryView = sortBooks();
let bookIndex = +localStorage.getItem("bookIndex");
if (!bookIndex) {
    bookIndex = 0;
}
render();
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
function sortBooks(sortFunction = compareBookTitle, reverse = false) {
    const bookList = libraryView.sort(sortFunction);
    if (reverse) {
        bookList.reverse();
    }
    return bookList;
}
function render() {
    while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
    }
    libraryView.slice(pageIndex * entriesPerPage, pageIndex * entriesPerPage + entriesPerPage).forEach(book => {
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
    if (libraryView.length > (pageIndex + 1) * entriesPerPage) {
        rightArrow.classList.add("arrows");
        rightArrow.classList.remove("arrows-disabled");
    }
    else {
        rightArrow.classList.add("arrows-disabled");
        rightArrow.classList.remove("arrows");
    }
    if (pageIndex > 0) {
        leftArrow.classList.add("arrows");
        leftArrow.classList.remove("arrows-disabled");
    }
    else {
        leftArrow.classList.add("arrows-disabled");
        leftArrow.classList.remove("arrows");
    }
}
function changePage(next = true) {
    if (next) {
        if (libraryView.length > (pageIndex + 1) * entriesPerPage) {
            pageIndex++;
            render();
        }
    }
    else {
        if (pageIndex > 0) {
            pageIndex--;
            render();
        }
    }
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
    libraryView = bookList;
    render();
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
