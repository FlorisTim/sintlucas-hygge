const api = "http://127.0.0.1:3000"
let allProducts;
const productTemplate = `<button class="center_btn" onclick="window.location.href='../order?prod=$ID'">$ITEM</button>';`

function getProd(id){
    for (const p of allProducts){
        if (p.name === id){return p}
    }
}

function product(id, text){
    return productTemplate
        .replace("$ID", id)
        .replace("$ITEM", text);
}

function ur(path){
    return api + path;
}

async function fetchProductNet(){
    return await fetch(ur("/productnet.json")).then((a) => {return a.json()});
}

async function renderProducts(){
    allProducts = await fetch(ur("/products.json")).then((a) => {return a.json()});

    const products = await fetchProductNet();
    const orderList = document.getElementById("order_list");
    orderList.innerHTML = "";
    for (let p of products){
        p = getProd(p.product);
        orderList.innerHTML += product(p.name,p.display)
    }

}