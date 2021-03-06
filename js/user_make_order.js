// async function logged_or_not(){
//     let user = 0;
//     if(await(await fetch('../php/controllers/logged_in.php')).text()){
//         user = JSON.parse(await(await fetch('../php/controllers/logged_in.php')).text());
//     }
//     return user;
// }
//
logged_or_not().then((result)=>{
    if(!result){
            location.assign("../html/sign_in.html")
    }
    else if(result.role=="admin"){
        location.assign("../html/admin_make_order.html")
    }
})




let cards = document.getElementById("cards");
let cart = document.getElementById("cart");
let completeOrder = document.getElementById("complete_order");
completeOrder.addEventListener("click", function(){
    if(cart.children.length > 4){

        let Some = {};
        let allDivs = cart.children;
        for (const div of allDivs) {
            if(div.dataset.value){
                Some[div.children[0].innerHTML.split(":")[0]] = div.children[2].value;
                // Some.push(div.children[0].innerHTML.split(":")[0]);
                // Some.push(div.children[2].value);
            }
        }
        Some["notes"] = document.getElementById("note").value;
        Some["room"] = document.getElementsByTagName("select")[0].value;
        console.log(Some);
        Some = JSON.stringify(Some);
        console.log(Some);
        // Some.push(document.getElementById("note").value)
        // Some.push(document.getElementsByTagName("select")[0].value);
        location.assign(`../php/user_make_order.php?order=${Some}`);
    }
})

async function get_products(){
    let products = await (await fetch("../php/controllers/getavailproducts.php")).json();
    renderProducts(products);
    let search = document.getElementById('search');
    search.addEventListener("keyup", function(){
        let numberOfChildren = cards.children.length
        for (let i = 0; i < numberOfChildren; i++) {
            cards.removeChild(cards.children[0]);
        }
        console.log(search.value)
        renderProductsWithCondition(products,search.value);
    })

}

function renderProductsWithCondition(products, value){
    // console.log(value);
    // let reg = /^[A-Z]+$/;
    // console.log(reg.constructor.name);
    let reg = new RegExp(value, "i","g","d");
    for (const product of products) {
        if(product.name.match(reg)){
            console.log("passed");
            cards.innerHTML += `
            <div class="col-3 my_card text-center p-4 m-2">
                <img class="my_card_image align-self-center" src="../assets/images/products/${product.image_url}" alt="${product.name}" />
                <h3 class="my-2">${product.name}</h3>
                <div class="price fs-4 fs-1 my-1">${product.Price} EGP</div>
                <button class="p-3 button_of_adding">add to cart</button>
            </div>`;
        }
    }
    registerButtons();
}

function renderProducts(_products) {
    for (const product of _products) {
        cards.innerHTML += `
        <div class="col-3 my_card text-center p-4 m-2">
            <img class="my_card_image align-self-center" src="../assets/images/products/${product.image_url}" alt="${product.name}" />
            <h3 class="my-2">${product.name}</h3>
            <div class="price fs-4 fs-1 my-1">${product.Price} EGP</div>
            <button class="p-3 button_of_adding">add to cart</button>
        </div>`;
    }
    registerButtons();
}

function registerButtons(){
    let buttons = document.getElementsByClassName("button_of_adding");
    for (let button of buttons) {
        button.addEventListener("click", addToCart);
        button.addEventListener("click", getTotal);
    }
}

function addToCart(e){
    let product_name= e.target.parentElement.children[1].innerHTML;
    for (const elementOrNullKey of cart.children) {
        if(elementOrNullKey.dataset.value == product_name){
            elementOrNullKey.children[2].value = 1 + parseInt(elementOrNullKey.children[2].value);
            elementOrNullKey.children[4].innerHTML = parseInt(elementOrNullKey.children[2].value) * parseInt(e.target.parentElement.children[2].innerHTML) + "  EGP";
            return;
        }
    }
    let theActualProduct = e.target;
    let theDiv = document.createElement("div");
    theDiv.classList.add("my-3");
    theDiv.classList.add("order");
    theDiv.classList.add("row");
    theDiv.dataset.value = product_name;
    let theLabel= document.createElement("label");
    theLabel.classList.add("col-3");
    theLabel.innerHTML = product_name+": ";
    theLabel.style.fontWeight = "Bold";
    let plus = document.createElement("button");
    plus.innerHTML = "+";
    plus.classList.add("btn");
    plus.classList.add("btn-success");
    plus.classList.add("plus_minus");
    plus.classList.add("col-1");
    plus.addEventListener("click", addOne)
    plus.addEventListener("click", function(e){
        e.target.parentElement.children[4].innerHTML = parseInt(e.target.nextSibling.value) *parseInt(theActualProduct.parentElement.children[2].innerHTML) + "  EGP";
    })
    plus.addEventListener("click", getTotal);
    let theInput = document.createElement("input");
    theInput.classList.add("text-center");
    theInput.value=1;
    theInput.disabled = true;
    theInput.type="number";
    let minus = document.createElement("button");
    minus.innerHTML = "-";
    minus.classList.add("plus_minus");
    minus.classList.add("btn");
    minus.classList.add("btn-warning");
    minus.addEventListener("click", takeOne);
    minus.addEventListener("click",function(e){
        e.target.parentElement.children[4].innerHTML = parseInt(e.target.previousSibling.value) *parseInt(theActualProduct.parentElement.children[2].innerHTML) + "  EGP";
    })
    minus.addEventListener("click", getTotal);
    minus.classList.add("col-1");
    let price=document.createElement("label");
    price.innerHTML = parseInt(e.target.parentElement.children[2].innerHTML) + "  EGP";
    price.classList.add("price")
    price.classList.add("col-3")
    let _delete = document.createElement("button");
    _delete.innerHTML = "X";
    _delete.classList.add("col-1");
    _delete.classList.add("btn");
    _delete.classList.add("btn-danger");
    _delete.addEventListener("click", function(e){
        cart.removeChild(e.target.parentElement);
    })
    _delete.addEventListener("click", getTotal);
    theDiv.append(theLabel, plus, theInput, minus, price, _delete);
    cart.append(theDiv);
}

function getTotal(){
    let sum = 0;
    let allDivs = cart.children;
    for (const div of allDivs) {
        if(div.dataset.value){
            sum += parseInt(div.children[4].innerHTML);
        }
    }
    document.getElementById("Total").innerHTML = "Total: "+ sum + "  EGP";
}

function addOne(e){
    e.target.nextSibling.value = 1 + parseInt(e.target.nextSibling.value);
}

function takeOne(e){
    if(e.target.previousSibling.value > 1)
        e.target.previousSibling.value = parseInt(e.target.previousSibling.value) - 1;
}

let lastOrder = document.getElementById('last_order');

async function getLastOrder(){
    let order = await (await fetch("../php/controllers/getUserOrdersAbdallah.php")).json();
    console.log(order);
    for (const orderElement of order) {
        lastOrder.innerHTML += `
            <div class="col-3 last_order_card text-center p-1 m-2">
                <!--<img class="last_order_card_image" src="../assets/images/products/${orderElement.image_url}" alt="${orderElement.name}" />
                <div class="price fs-4 fs-1 my-1">${orderElement.Price} EGP</div>-->
                <h3 class="my-2">${orderElement.name}</h3>
            </div>`;
    }
}

get_products();
getLastOrder();

async function signout(){
    await fetch('../php/controllers/logout.php');
    location.reload();
}

let user = {id:null, name:null, role:null};

async function fillUser(){
    try {
        user = await (await fetch('../php/controllers/logged_in.php')).json();
    }catch {
        user = {id:null, name:null, role:null};
    }
    return user;
}

fillUser().then((user)=>{
    let header = document.getElementById('header');

    header.innerHTML = `
    <a href="../" class="logo">
        <img src="../assets/images/landing-page/logo.png" alt="" />
    </a>

    <nav class="navbar" id="nav">
        <a href="../">Home</a>
        <a href="../#menu">Menu</a>
    </nav>
    <div class="icons d-flex align-items-baseline">
        <div class="fas fa-bars" id="menu-btn"></div>
        <button onclick="${user.id ? "signout()" : "location.assign('../html/sign_in.html')"}" class="buttonSignout btn btn-alert">${user.id ? "Sign out" : "Sign in"}</button>
    </div>
`;
    let nav = document.getElementById('nav');
    if(user.role=='admin'){
        nav.innerHTML+= `
            <a href="../HTML/fillUsersTable.html">Users</a>
            <a href="../HTML/product_table.html">Products</a>
            <a href="../checks.html">Checks</a>
            <a href="../php/admin-orders.php">All Orders</a> <!-- GAZAR Y3DLHA NOOOW -->
        `;
    }else if(user.role=='user'){
        nav.innerHTML += `
        <a href="../HTML/users-orders.html">My orders</a>
`
    }
});

