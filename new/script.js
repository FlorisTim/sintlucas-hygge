const api = "http://127.0.0.1:3000"
let allProducts;
const productTemplate = `<button class="center_btn" onclick="window.location.href='../order?product=$ID'">$ITEM</button>;`

function getProd(id){
    for (const p of allProducts){
        if (p.name === id){return p}
    }
    return null;
}

function getNet(id, all){
    for (const p of all){
        if (p.product === id){return p}
    }
    return null;
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
    const net = await fetchProductNet();

    const orderList = document.getElementById("order_list");
    orderList.innerHTML = "";
    for (let p of net){
        p = getProd(p.product);
        orderList.innerHTML += product(p.name,p.display)
    }

}

function clicked(elid, id){
    const full = document.getElementById(id);

    const a = document.getElementById(elid);

    for (let el of full.children){
        const button = el.children[0];

        if (button.id === elid){
            continue;
        }

        if (button.type === "radio" || a.type === "radio"){
            button.checked = false;
        }
    }
}

function multiSelectElement(options, id){
    let output = `<div class="select" id="${id}">`

    let first = true;

    let index = 0;
    for (let item of options) {
        index++;
        const ident = `${id}_${index}`;
        if (first) {
            output += `<label><input type="radio" id="${ident}" onclick="clicked('${ident}', '${id}');"><p>${getProd(item).display}</p></label>`;
            first = false;
        } else {
            output += `<label><input type="checkbox" id="${ident}" onclick="clicked('${ident}', '${id}');"><p>${getProd(item).display}</p></label>`;
        }
    }

    output += `</div>`
    return output;
}

function radialOptionsElement(options, id){
    let output = `<div class="select" id="${id}">`

    let index = 0;
    for (let item of options) {
        index++;
        const ident = `${id}_${index}`;
        output += `<label><input type="radio" id="${ident}" onclick="clicked('${ident}', '${id}');"><p>${getProd(item).display}</p></label>`;
    }

    output += `</div>`
    return output;
}

async function renderSelectedProduct(){
    allProducts = await fetch(ur("/products.json")).then((a) => {return a.json()});

    const phone = document.getElementById("phone");

    const product = new URLSearchParams(document.location.search).get("product");
    const net = getNet(product, await fetchProductNet());
    console.log(net);
    if (net == null){
        window.location.href = "../start";
    }

    phone.innerHTML += `<h1>${getProd(product).display}</h1>`
    const additions = net.additions;
    for (let option of additions){
        phone.innerHTML += `<h2>${option.name}</h2>`
        switch (option.type) {
            case "radial_first":
                phone.innerHTML += multiSelectElement(option.items,option.id);
                break;
            case "single_select":
                phone.innerHTML += radialOptionsElement(option.items,option.id);
                break;
        }
    }
    console.log(net.additions);


}