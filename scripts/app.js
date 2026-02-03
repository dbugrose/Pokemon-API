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
let searchingFromFavorites = false;
let favoritePokemon = "pikachu";
let data;
let locations;
let pokemon = "pikachu";
let isShiny = false;
let startShiny = false;
let isFavorited = false;
favoritePokemonList = [];
let favSpan;

async function GetAPI(pokemon) {
    if (!searchingFromFavorites)
         { pokemon = userInput.value; 
        currentpokemon = userInput.value}
    response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
    data = await response.json();
    console.log(data);
}

function capitalize(pokemon) {
    return String(pokemon).charAt(0).toUpperCase() + String(pokemon).slice(1);
}




async function updatePokemon(pokemon) {

    if (!searchingFromFavorites) { pokemon = userInput.value; }
    await GetAPI(pokemon);
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
    console.log(data.abilities);
    for (let i = 0; i < data.abilities.length; i++) {
        abilitiesList.push(data.abilities[i].ability.name);
    }
    abilitiesList = abilitiesList.join(", ");
    Abilities.textContent = abilitiesList;

    //favorites update
    if (favoritePokemonList.includes(userInput.value))
    {isFavorited = true;
    FavoriteBtn.src = "/assets/star filled.png";
    }
    else
    {isFavorited = false;
    FavoriteBtn.src = "/assets/star.png";
    }

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
    let pokemonIndex = favoritePokemonList.indexOf(favoritePokemon);
    favoritePokemonList.splice(pokemonIndex, 1);

    localStorage.setItem("Favorite Pokemon", JSON.stringify(favoritePokemonList));
}

function DisplayList() {

    favoritePokemonList = getLocalStorage();
    FavoritesBox.innerHTML = "";
    console.log(`favoritePokemonList: ${favoritePokemonList}`);
    favoritePokemonList.forEach((pokemon) => {
        favSpan = document.createElement("span");
        favSpan.className = "px-1";
        favSpan.textContent = pokemon;
        favSpan.addEventListener("click", () => {
            searchingFromFavorites = true;
            console.log(pokemon);
            GetAPI(favSpan.textContent);
            updatePokemon(pokemon);})
        const deleteBtn = document.createElement("span");
        deleteBtn.innerHTML = `<img src="/assets/star filled.png" width="20px" alt="${favoritePokemon}">`;
        deleteBtn.classList = "px-1";
        deleteBtn.addEventListener("click", () => {
            removeFromStorage(favoritePokemon);
            FavoriteBtn.src = "/assets/star.png";
            isFavorited = !isFavorited;
            favSpan.remove();
        })
        favSpan.appendChild(deleteBtn);
        FavoritesBox.appendChild(favSpan);
    })
}


FavoriteBtn.addEventListener("click", () => {
    if (!isFavorited)
    {
    let favoritePokemon = pokemon;
    getLocalStorage();
    saveToStorage(favoritePokemon);
    DisplayList();
    FavoriteBtn.src = "/assets/star filled.png";
    }
    else 
    {
        FavoriteBtn.src = "/assets/star.png";
        removeFromStorage(pokemon);
        DisplayList();
    }
    isFavorited = !isFavorited;
})
//---------------favorites setup end --------------------//

userInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        searchingFromFavorites = false;
        pokemon = userInput.value;
        updatePokemon(pokemon);
        DisplayList();
    }
})
EnterBtn.addEventListener("click", () => {
    searchingFromFavorites = false;
    pokemon = userInput.value;
    updatePokemon(pokemon);
    favoritesCheck();
    DisplayList();

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
