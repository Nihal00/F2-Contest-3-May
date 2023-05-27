const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency
=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false`;

const input =  document.getElementById('input');
const btn1 = document.getElementById('btn-1');
const btn2 = document.getElementById('btn-2'); 

//fetching data using .then
function fetchDataWithThen(){
    fetch(url)
    .then(response => response.json())
    .then(data => renderData(data))
    .catch(error => {
        console.log(error);
        alert("HTTP 429 Too Many Requests error, Kindly Try after Few Minutes")
    });
}

//fetching data using Async Await
async function fetchDataWithAsyncAwait(){
    try{
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
        alert("HTTP 429 Too Many Requests error, Kindly Try after Few Minutes");
    }
}

//Render Data to the UI recieved from API
function renderData(data){

    const table = document.getElementById('table-data');
    table.innerHTML = '';

    data.forEach(data => {
        const row = document.createElement('tr');
        row.id = `${data.id}`;
        row.innerHTML = `
        <td class="td-img"><img src="${data.image}" alt="coin-logo"></td>
        <td class="td-name">${data.name}</td>
        <td class="td-shortName">${data.symbol.toUpperCase()}</td>
        <td class="td-price">$${data.current_price}</td>
        <td class="td-price1">$${data.total_volume}</td>
        <td class="td-per">${checkPer(data.price_change_percentage_24h)}<td>
        <td class="td-mktCap">Mkt Cap: $${data.market_cap}</td>
        `;
        table.appendChild(row);
    });
}

//Percentage Indicator (color changer)
function checkPer(data){

    if(data > 0){
        return `<span class="green">${data}%</span>`;
    }else{
        return `<span class="red">${data}%</span>`;
    }
}


//Call of EventListener when input is given by the user => Name or Symbol
input.addEventListener("input", (event) => {
    const value = event.target.value.toLowerCase();

    const rows = document.querySelectorAll('tr');

    if(!value){
        // location.reload();
        rows.forEach(row => row.className = "tr-show");
    }

    rows.forEach(row => {
        const name = row.children[1].textContent.toLowerCase();
        const shortName = row.children[2].textContent.toLowerCase();
        
        if(name.includes(value) || shortName.includes(value)){
            console.log(value);
            row.style.display = name.includes(value);
            row.style.display = shortName.includes(value);
        }else {
            row.className = "tr-show-none";
        }
    });
});

//Call of EventListener on click of the Button => Sorting Data based on Market Cap
btn1.addEventListener('click', async () => {
    const data = await fetchDataWithAsyncAwait();
    const sortedDataOfMkt_Cap = data.sort((a,b) => a.market_cap - b.market_cap);

    renderData(sortedDataOfMkt_Cap);
});

//Call of EventListener on click of the Button => Sorting Data based on Percentage change.
btn2.addEventListener('click', async () => {
    const data = await fetchDataWithAsyncAwait();
    const sortedDataOfPercentage = data.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);

    renderData(sortedDataOfPercentage);
});

//On Every Reload A Live Data will be fetched from the API and displayed in the UI
window.onload = fetchDataWithThen();


