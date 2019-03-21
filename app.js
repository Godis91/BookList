//Book class 
class Book {
  constructor(title, author, isbn){
    this.title = title;
    this.author = author;
    this.isbn = isbn
  }
}

class UI {
  static displayBooks(){
    const books = Store.getBooks();

  //  for(let i = 0; i < books.length; i++){
  //     UI.addBookToList(books[i]);
  //  }

  // Array.from(books).map(book => {
  //   UI.addBookToList(book);
  // })

  books.forEach(book => {
    UI.addBookToList(book);
  })

  }

  static addBookToList(book){
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>
          <a href="#" class="btn btn-danger btn-sm delete">X</a>
        </td>
    `;
    list.appendChild(row);
  }

  static deleteBook(el) {
    if(el.classList.contains('delete')){
      if(confirm('Are you sure about this?')){
        el.parentElement.parentElement.remove();
      }
    }

  }


  static showAlert(message, className){
    const div = document.createElement('div');
    div.className = `alert alert-${className} text-center`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    container.insertBefore(div, form);

    setTimeout(() => {
      document.querySelector('.alert').remove();
    }, 3000);
  }

  static clearFields(){
    document.getElementById("title").value = '';
    document.getElementById("author").value = ''
    document.getElementById("isbn").value = '';
  }
}


//Handle storage of data in local storage
class Store{
  static getBooks(){
    let books;
    if(localStorage.getItem('books') === null){
      books = [];
    }else{
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;

  }

  static addBook(book){
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }
}


//Display Books on document load
document.addEventListener('DOMContentLoaded', UI.displayBooks);


//Add a book
document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;


  //Validate 
  if(!title || !author || !isbn){
    UI.showAlert('please fill all fields', 'danger');
  }else{
    //create a book instance
    const book = new Book(title, author, isbn);
  
    //Add Book to UI
    UI.addBookToList(book);

    //Add book to store
    Store.addBook(book)

    UI.showAlert('Added a book', 'success')
  
    UI.clearFields();
  }

});

//Delete Book from list
document.querySelector('#book-list').addEventListener('click', (e) => {
  UI.deleteBook(e.target);

  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

  UI.showAlert('You just deleted a book', 'success')

})