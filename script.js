let bestelling=[]

function goTo(id){
    document.querySelectorAll('.screen')
        .forEach(s => s.classList.remove('active'));
    // document.querySelectorAll('.screen')
    //     .forEach(
    //         function(s) {
    //             s.classList.remove('active')
    //         }
    //     );
    document.getElementById(id).classList.add('active');
}

function goToToppings(){
    // kijk welk drankje is aangevinkt (het "value" van de gekozen radio)
    const gekozenInput = document.querySelector('input[name="product"]:checked');
    const gekozenProduct = gekozenInput.value;
    const productNaam = gekozenInput.parentElement.querySelector('.option-text').textContent;

    // verstop alle topping-lijstjes
    document.querySelectorAll('.topping-group').forEach
    (g => g.classList.remove('active'));

    // toon alleen het lijstje dat bij dit product hoort
    document.getElementById('toppings-' + gekozenProduct).classList.add('active');

    // titel boven het lijstje bijwerken, bijv. "Toppings voor Coffee"
    document.getElementById('toppings-title').textContent = 'Toppings voor ' + productNaam;

    goTo('screen-toppings');
}

function goToOverview(){
    // haalt het gekozen drankje op
    const gekozenInput = document.querySelector('input[name="product"]:checked');
    const productNaam = gekozenInput.parentElement.querySelector('.option-text').textContent;
    const productPrijs = gekozenInput.parentElement.querySelector('.price').textContent;

    // Zet de prijs om naar een getal
    const productprijs = Number(
        productPrijsTekst.replace('€','').replace(',','')
    );

    // Haal de gekozen toppings op
    const zichtbaarLijstje=document.querySelector('topping-group.active');
    const gekozenToppings = Array.from(zichtbaarLijstje.querySelectorAll
    ('input:checked'))
        .map(input => input.parentElement.querySelector('option-text').textContent.trim()
        );

    // Voeg het drankje toe aan de winkelmandje
    bestelling.push({
        product: productNaam,
        toppings: gekozenToppings,
        prijs: productPrijs,
    });



}

function finishOrder(){
    // genereert een willekeurig bestelnummer tussen 100 en 999
    const nummer = Math.floor(Math.random() * 900) + 100;
    document.getElementById('order-number').textContent = nummer;
    goTo('screen-thanks');
}
document.querySelectorAll('.topping-group').forEach(group => {
    const checkboxes = group.querySelectorAll(
        'input[type="checkbox"]'
    );

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            const label = this.parentElement;
            const tekst = label.querySelector('.option-text').textContent;

            const geenCheckbox = Array.from(checkboxes).find(input =>
                input.parentElement.querySelector('.option-text')
                    .textContent.trim() === 'Geen'
            );

            if (tekst === 'Geen' && this.checked) {
                checkboxes.forEach(other => {
                    if (other !== this) {
                        other.checked = false;
                    }
                });
            } else if (this.checked && geenCheckbox) {
                geenCheckbox.checked = false;
            }
        });
    });
});