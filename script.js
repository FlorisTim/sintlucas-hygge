function goTo(id){
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

function goToToppings(){
    // kijk welk drankje is aangevinkt (het "value" van de gekozen radio)
    const gekozenInput = document.querySelector('input[name="product"]:checked');
    const gekozenProduct = gekozenInput.value;
    const productNaam = gekozenInput.parentElement.querySelector('.option-text').textContent;

    // verstop alle topping-lijstjes
    document.querySelectorAll('.topping-group').forEach(g => g.classList.remove('active'));

    // toon alleen het lijstje dat bij dit product hoort
    document.getElementById('toppings-' + gekozenProduct).classList.add('active');

    // titel boven het lijstje bijwerken, bijv. "Toppings voor Coffee"
    document.getElementById('toppings-title').textContent = 'Toppings voor ' + productNaam;

    goTo('screen-toppings');
}

function goToOverview(){
    // haal naam + prijs van het gekozen drankje op
    const gekozenInput = document.querySelector('input[name="product"]:checked');
    const productNaam = gekozenInput.parentElement.querySelector('.option-text').textContent;
    const productPrijs = gekozenInput.parentElement.querySelector('.price').textContent;

    // haal alle aangevinkte toppings op uit het zichtbare lijstje
    const zichtbaarLijstje = document.querySelector('.topping-group.active');
    const gekozenToppings = Array.from(zichtbaarLijstje.querySelectorAll('input:checked'))
        .map(input => input.parentElement.querySelector('.option-text').textContent);

    // zet de tekst klaar in het overzichtsscherm
    document.getElementById('overview-product').textContent = productNaam + ' (' + productPrijs + ')';
    document.getElementById('overview-toppings').textContent =
        gekozenToppings.length > 0 ? gekozenToppings.join(', ') : 'Geen';

    goTo('screen-overview');
}

function finishOrder(){
    // genereert een willekeurig bestelnummer tussen 100 en 999
    const nummer = Math.floor(Math.random() * 900) + 100;
    document.getElementById('order-number').textContent = nummer;
    goTo('screen-thanks');
}