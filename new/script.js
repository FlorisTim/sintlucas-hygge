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
    let full = document.getElementById(id);

    const a = document.getElementById(elid);

    for (let el of full.children){
        if (el.classList.contains("row")){
            clicked(elid, el.id);
            continue;
        }

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
        const fullop = `id="${ident}" onclick="clicked('${ident}', '${id}');"`
        if (first) {
            output += `<label><input type="radio" ${fullop}>${elementOf(item)}</label>`;
            first = false;
            output += `<div class="row" id="row_${id}">`;
        } else {
            output += `<label><input type="checkbox" ${fullop}>${elementOf(item)}</label>`;
        }
    }

    output += `</div></div>`
    return output;
}

function radialOptionsElement(options, id){
    let output = `<div class="select" id="${id}">`

    let index = 0;
    for (let item of options) {
        index++;
        const ident = `${id}_${index}`;
        const fullop = `id="${ident}" onclick="clicked('${ident}', '${id}');"`
        output += `<label><input type="radio" ${fullop}${elementOf(item)}</label>`;
    }

    output += `</div>`
    return output;
}

function elementOf(item){
    const prod = getProd(item);
    if (prod.cost > 0){
        return `<p>${prod.display}</p><span class="cost">+ €${prod.cost}</span>`

    }
    return `<p>${prod.display}</p>`

}

async function renderSelectedProduct(){
    allProducts = await fetch(ur("/products.json")).then((a) => {return a.json()});

    const phone = document.getElementById("phone");

    const product = new URLSearchParams(document.location.search).get("product");
    const net = getNet(product, await fetchProductNet());
    if (net == null){
        window.location.href = "../start";
    }

    phone.innerHTML += `<h1>${getProd(product).display} <span class="cost big">€${getProd(product).cost}</span></h1>`
    const additions = net.additions;
    for (let option of additions){
        phone.innerHTML += `<h2>${option.name}</h2>`
        console.log(option.id);
        switch (option.type) {
            case "radial_first":
                phone.innerHTML += multiSelectElement(option.items,option.id);
                break;
            case "radial":
                phone.innerHTML += radialOptionsElement(option.items,option.id);
                break;
        }
    }


}