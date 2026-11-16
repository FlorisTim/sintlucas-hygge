const api = "https://127.0.0.1:3000"

function url(path){
    return api + path;
}

async function fetchOrders(){
    return await fetch(url("/constant/products.json"), {
        method: 'GET'
    }).then((response) => {return response.json()})
}