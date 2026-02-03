const userInput = document.getElementById("userInput");
const EnterBtn = document.getElementById("EnterBtn");
const FavoriteBtn = document.getElementById("favoriteBtn");
const ShinyBtn = document.getElementById("shinyBtn");
const MainImg = document.getElementById("mainImg");
const Type = document.getElementById("type");
const Form = document.getElementById("form");
const Abilities = document.getElementById("abilities");
const Locations = document.getElementById("locations");
const Moves = document.getElementById("moves");
const EvolutionBox = document.getElementById("evolutionBox");
const PokemonName = document.getElementById("pokemonName");
const PokedexNumber = document.getElementById("pokedexNumber");
const FavoritesBox = document.getElementById("favoritesBox");


let pokeSpan;
let favoritePokemon = "Pikachu";
let data;
let locations;
let currentPokemon = "Pikachu";
let isShiny = false;
let startShiny = false;
let isFavorited = false;
favoritePokemonList = [];
async function GetAPI() {
    response = await fetch(`https://pokeapi.co/api/v2/pokemon/${userInput.value}`)
    data = await response.json();
    console.log(data);
}






function capitalize(pokemon) {
    return String(pokemon).charAt(0).toUpperCase() + String(pokemon).slice(1);
}




async function updatePokemon() {
    await GetAPI();

    currentPokemon = capitalize(userInput.value);
    if (favoritePokemonList.includes(favoritePokemon)) {
        FavoriteBtn.src = "/assets/star filled.png";
        isFavorited = true;
    }
    else {
        FavoriteBtn.src = "/assets/star.png";
        isFavorited = false;
    }
    startShiny = null;
    //abilities update
    Abilities.textContent = "";
    let abilitiesList = [];
    for (let i = 0; i < data.abilities.length; i++) {
        abilitiesList.push(data.abilities[i].ability.name);
    }
    abilitiesList = abilitiesList.join(", ");
    Abilities.textContent = abilitiesList;


    //name update
    PokemonName.textContent = capitalize(data.name);


    // image update
    MainImg.src = data.sprites.other["official-artwork"].front_default;
    MainImg.alt = `${capitalize(userInput.value)}`


    // pokedex number update
    PokedexNumber.textContent = `#${data.id}`;


    // type update
    let typesList = [];
    for (let i = 0; i < data.types.length; i++) {
        typesList.push(data.types[i].type.name);
    }
    typesList = typesList.join(" + ");
    Type.textContent = capitalize(typesList);




    //moves update
    let movesList = [];
    for (let i = 0; i < data.moves.length; i++) {
        movesList.push(data.moves[i].move.name);
    }
    movesList = movesList.join(", ");
    Moves.textContent = movesList;


    //fetch and update locations
    GetLocations();


    //get evolution line
    userInput.value = "";
}


//get locations function
async function GetLocations() {
    response = await fetch(`${data.location_area_encounters}`)
    locations = await response.json();
    console.log(locations);
    let locationsList = [];
    if (locations.length === 0) {
        Locations.textContent = "N/A";
    }
    else {
        for (let i = 0; i < locations.length; i++) { locationsList.push(locations[i].location_area.name); }
        locationsList = locationsList.join(", ");
        Locations.textContent = locationsList;
    }
}


//---------------favorites setup start --------------------//
function getLocalStorage() {
    favoritePokemon = localStorage.getItem("Favorite Pokemon");

    if (favoritePokemon === null) { return [] };
    return JSON.parse(favoritePokemon);
}

function saveToStorage(favoritePokemon) {
    let favoritePokemonList = getLocalStorage();
    if (!favoritePokemonList.includes(favoritePokemon)) {
        favoritePokemonList.push(favoritePokemon);
    }
    localStorage.setItem("Favorite Pokemon", JSON.stringify(favoritePokemonList))
}

const removeFromStorage = (favoritePokemon) => {
    let favoritePokemonList = getLocalStorage();
    let groceryIndex = favoritePokemonList.indexOf(favoritePokemon);
    favoritePokemonList.splice(groceryIndex, 1);

    localStorage.setItem("Favorite Pokemon", JSON.stringify(favoritePokemonList));
}

function DisplayList() {

    favoritePokemonList = getLocalStorage();
    FavoritesBox.innerHTML = "";
    console.log(favoritePokemonList);
    favoritePokemonList.forEach(favoritePokemon => {
        console.log(favoritePokemon);
        let favSpan = document.createElement("span");
        favSpan.className = "px-5";

        favSpan.textContent = favoritePokemon;

        const deleteBtn = document.createElement("span");
        deleteBtn.innerHTML = `<img src="/assets/star filled.png" width="20px" alt="${favoritePokemon}">`;
        deleteBtn.classList = "px-2";
        deleteBtn.addEventListener("click", () => {
            removeFromStorage(favoritePokemon);
            FavoriteBtn.src = "/assets/star.png";
            isFavorited = !isFavorited;
            favSpan.remove();
        })
        favSpan.appendChild(deleteBtn);
        FavoritesBox.appendChild(favSpan);

    });
}

FavoriteBtn.addEventListener("click", () => {
    let favoritePokemon = currentPokemon;
    getLocalStorage();
    saveToStorage(favoritePokemon);
    DisplayList();
    userInput.value = "";

})
//---------------favorites setup end --------------------//




userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        updatePokemon();
    }
})
EnterBtn.addEventListener("click", () => {
    updatePokemon();


})


ShinyBtn.addEventListener("click", () => {
    if (!(startShiny == null)) {
        if (!startShiny) { MainImg.src = "/assets/pikachushiny.png"; }
        else if (startShiny) { MainImg.src = "/assets/pikachu.png"; }
        startShiny = !startShiny;
    }
    else {
        if (isShiny) { MainImg.src = data.sprites.other["official-artwork"].front_default; }
        else { MainImg.src = data.sprites.other["official-artwork"].front_shiny; }
        isShiny = !isShiny;
    }
})