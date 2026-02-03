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
    favoritePokemon = capitalize(userInput.value);
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
    favoritePokemon = localStorage.getItem("Favorite Pokemon")
    if (favoritePokemon === null) { return []; }
    return JSON.parse(favoritePokemon);
}


function saveToStorage() {
    favoritePokemonList = getLocalStorage();
    if (!favoritePokemonList.includes(favoritePokemon)) {
        favoritePokemonList.push(favoritePokemon);
    }
    localStorage.setItem("Favorite Pokemon", JSON.stringify(favoritePokemonList));
}


function removeFromStorage(favoritePokemon) {
    favoritePokemonList = getLocalStorage();
    let pokemonIndex = favoritePokemonList.indexOf(favoritePokemon);
    favoritePokemonList.splice(pokemonIndex, 1);
    localStorage.setItem("Favorite Pokemon", JSON.stringify(favoritePokemonList));
}


function DisplayFavorites() {
    favoritePokemonList = getLocalStorage();
    FavoritesBox.innerHTML = "";
    favoritePokemonList.forEach(favoritePokemon => {
        pokeSpan = document.createElement("span");
        pokeSpan.className = `px-2`;
        pokeSpan.textContent = favoritePokemon;


        const deleteBtn = document.createElement("span");
        deleteBtn.innerHTML = `<img src="/assets/star filled.png" width="20px" alt="${favoritePokemon}">`;
        deleteBtn.addEventListener("click", () => {
            removeFromStorage(favoritePokemon);
            FavoriteBtn.src = "/assets/star.png";
            isFavorited = !isFavorited;
            pokeSpan.remove();
        })
        pokeSpan.appendChild(deleteBtn);
        FavoritesBox.appendChild(pokeSpan);
    });
}


FavoriteBtn.addEventListener("click", () => {
    if (!isFavorited) {
        FavoriteBtn.src = "/assets/star filled.png";
        console.log("this works")
        if (favoritePokemon != null) { favoritePokemon = favoritePokemon; }
        else { favoritePokemon = "Pikachu" }
        getLocalStorage();
        saveToStorage(favoritePokemon);
        DisplayFavorites();
    }
    else {
        FavoriteBtn.src = "/assets/star.png";
        removeFromStorage(favoritePokemon);
        pokeSpan.remove(favoritePokemon);
    }
    isFavorited = !isFavorited;
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