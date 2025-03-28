let users = JSON.parse(localStorage.getItem('users')) || [];
let dataPro = JSON.parse(localStorage.getItem('products')) || [];
let currentUser = localStorage.getItem('currentUser');






// Elements
let loginForm = document.getElementById('loginForm');
let signupForm = document.getElementById('signup-form');
let logoutBtn = document.getElementById('logout-btn');
let submitButton = document.getElementById('submit');
let title = document.getElementById('title');
let price = document.getElementById('price');
let Taxes = document.getElementById('Taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let category = document.getElementById('category');
let count = document.getElementById('count');
let stock = document.getElementById('stock');
let tbody = document.getElementById('tbody');



// Function to check login status
function checkLoginStatus() {
    if (currentUser) {
        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        logoutBtn.style.display = 'block';
        showData();
    } else {
        loginForm.style.display = 'block';
        signupForm.style.display = 'block';
        logoutBtn.style.display = 'none';
        showData();
    }
}


// Call checkLoginStatus when page loads
window.onload = checkLoginStatus;

// Sign up function
function signup() {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const signupError = document.getElementById('signup-error');

    const usernameExists = users.some(user => user.username === username);
    const emailExists = users.some(user => user.email === email);

    if (usernameExists) {
        signupError.textContent = 'Username is already taken!';
        return;
    }
    if (emailExists) {
        signupError.textContent = 'Email is already registered!';
        return;
    }

    if (password.length < 6) {
        signupError.textContent = 'Password must be at least 6 characters long!';
        return;
    }

    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Automatically log the user in after successful registration
    localStorage.setItem('currentUser', username);
    currentUser = username;

    signupForm.style.display = 'none';
    loginForm.style.display = 'none';
    logoutBtn.style.display = 'block';

    showData();
}

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginError = document.getElementById('login-error');

    const user = users.find(user => user.username === username);
    if (user && user.password === password) {
        localStorage.setItem('currentUser', username);
        currentUser = username;

        loginForm.style.display = 'none';
        signupForm.style.display = 'none';
        logoutBtn.style.display = 'block';

        showData();
    } else {
        loginError.textContent = 'Invalid username or password.';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;

    showData();
    loginForm.style.display = 'block';
    signupForm.style.display = 'block';
    logoutBtn.style.display = 'none';

    showData();
}




let mood = 'create';
let temp;

// get total

function getTotal() {
    if (price.value != '') {
        let result = (+price.value + +Taxes.value + +ads.value) 
        - +discount.value;
        total.innerHTML = result; 
        total.style.color = '#000'
        total.style.fontWeight = '600'
        if (total.value > 0) {
            total.style.background = '#00c54c'
        } 
        else {
            total.style.background = '#3ee662'
        }
    } 
    else{
        total.innerHTML = ''; 
        total.style.background = '#470053'
    }
}


// create product

if (localStorage.product != null) {
    dataPro = JSON.parse(localStorage.product)
} 
else{
    dataPro = [];
}

submit.onclick = function () {
    if (!currentUser) {
        alert('Please register first to add products!');
        return;  // Stop the submission if the user is not logged in
    }
    let newPro = {
        title:title.value.toLowerCase(),
        price:price.value,
        Taxes:Taxes.value,
        ads:ads.value,
        discount:discount.value,
        total:total.innerHTML,
        count:count.value,
        category:category.value.toLowerCase(),
        stock:stock.value,
    }
    if (title.value != ''&& price.value != ''&& category.value != '') {
        if (newPro.count < 100) {

            if(mood === 'create'){
                if (newPro.count > 1) {
                    if (newPro.price <= 0) {
                        
                        window.alert("Price must be a valid positive number");
                        this.scroll({
                            top:0,
                        })
                    } else{
                        for (let i = 0; i < newPro.count; i++) {  // Use newPro.count, not newPro.length
                            dataPro.push(newPro);
                        }clearData()
                    }
                } else {
                    dataPro.push(newPro);
                } 
            } else{
                dataPro[ temp ] =  newPro;
                mood = 'create';
                submit.innerHTML = 'Create';
                count.style.display = 'block';
            }      
        }
        else{
            window.alert("Make count UNDER '100'")
        }
    } else{
        window.alert("Fill in all items !!!");
    }
    localStorage.setItem('product', JSON.stringify(dataPro))


    showData()

    let tableSection = document.getElementById('tbody'); // or any target element you want to scroll to
    tableSection.scrollIntoView({
        behavior: 'smooth',  // Smooth scrolling
        block: 'start'       // Scroll to the top of the element
    });
}



// clear inputs

function clearData(){
    title.value = '';
    price.value = '';
    Taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    category.value = '';
    count.value = '';
    stock.value = '';
}

// read
function showData() {
    if (!currentUser) {
        // Optionally show a message like "Please log in to see products"
        tbody.innerHTML = '<tr><td colspan="11">Please log in to see the product data.</td></tr>';
        return; // Stop here if no user is logged in
    }
    getTotal();
    let table = '';
    console.log(dataPro);
    let btnDelete = document.getElementById('deleteAll');
    if (dataPro.length > 0) {
        for (let i = 0; i < dataPro.length; i++) {
            let stockStatus = '';
            if (dataPro[i].stock <= 0) {
                stockStatus = 'out-of-stock'; // Highlight out of stock
            } else if (dataPro[i].stock <= 5) {
                stockStatus = 'low-stock'; // Highlight low stock
            }
            table += `
                <tr class="${stockStatus}">
                    <td>${i + 1}</td>
                    <td>${dataPro[i].title}</td>
                    <td>${dataPro[i].price}</td>
                    <td>${dataPro[i].Taxes}</td>
                    <td>${dataPro[i].ads}</td>
                    <td>${dataPro[i].discount}</td>
                    <td>${dataPro[i].total}</td>
                    <td>${dataPro[i].category}</td>
                    <td>${dataPro[i].stock}</td> <!-- Display stock -->
                    <td><button onclick="updateData(${i})" id="update">update</button></td>
                    <td><button onclick="deleteData(${i})" id="delete">delete</button></td>
                </tr>
            `;
        }
        btnDelete.innerHTML = `<button onclick="deleteAll()">Delete All</button>`;
    } else {
        btnDelete.innerHTML = '';
    }
    document.getElementById('tbody').innerHTML = table;
}

showData();


// delete product

function deleteData(i){
    dataPro.splice(i,1);
    localStorage.product = JSON.stringify(dataPro);
    showData()
}



// Delete All

function deleteAll(){
    localStorage.clear();
    dataPro.splice(0);
    showData();
}


// Update Product

function updateData(i) {
    // Set the mode to "update"
    mood = 'update';
    temp = i; // Store the index of the product to be updated
    
    // Pre-fill the form with the product data at index 'i'
    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    Taxes.value = dataPro[i].Taxes;
    ads.value = dataPro[i].ads;
    discount.value = dataPro[i].discount;
    stock.value = dataPro[i].stock;
    getTotal();
    count.style.display = 'none';
    category.value = dataPro[i].category;
    
    // Change the submit button to "Update"
    submit.innerHTML = 'Update Product';
    scroll({
        top:0,
        behavior:'smooth'
    })
}


// Search

let searchMood = 'Title';   

let search = document.getElementById('search');

function getSearchMood(id){
    if (id == 'searchTitle') {
        searchMood = 'Title';
    } else{
        searchMood = 'Category';
    }
    search.placeholder = 'Search By '+ searchMood;
    search.focus()
    search.value = '';
    showData();
}


function searchData(value){

    let table = '';
    for (let i = 0; i < dataPro.length; i++) {

    if (searchMood == 'Title') {
            if (dataPro[i].title.includes(value.toLowerCase())) {
                table +=`
                <tr>
                    <td>${i + 1}</td>
                    <td>${dataPro[i].title}</td>
                    <td>${dataPro[i].price}</td>
                    <td>${dataPro[i].Taxes}</td>
                    <td>${dataPro[i].ads}</td>
                    <td>${dataPro[i].discount}</td>
                    <td>${dataPro[i].total}</td>
                    <td>${dataPro[i].category}</td>
                    <td>${dataPro[i].stock}</td>
                    <td><button onclick="updateData(${i})" id="update">update</button></td>
                    <td><button onclick="deleteData(${i})" id="delete">delete</button></td>
                </tr>
            `
        }
    }
    else{
            if (dataPro[i].category.includes(value.toLowerCase())) {
                table +=`
                <tr>
                    <td>${i + 1}</td>
                    <td>${dataPro[i].title}</td>
                    <td>${dataPro[i].price}</td>
                    <td>${dataPro[i].Taxes}</td>
                    <td>${dataPro[i].ads}</td>
                    <td>${dataPro[i].discount}</td>
                    <td>${dataPro[i].total}</td>
                    <td>${dataPro[i].category}</td>
                    <td>${dataPro[i].stock}</td>
                    <td><button onclick="updateData(${i})" id="update">update</button></td>
                    <td><button onclick="deleteData(${i})" id="delete">delete</button></td>
                </tr>
            `
        }
    }
    document.getElementById('tbody').innerHTML = table;
    }
}