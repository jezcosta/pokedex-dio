const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const pokemonDetail = document.getElementById("pokemonDetail");
const closeButton = document.getElementById("buttonClose");

const maxRecords = 151;
const limit = 20;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}"">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>
                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function getDetailModal(pokemon) {
  return ` 
    <div class="pokemon ${pokemon.type}">
        <span class="number">${pokemon.number}</span>
        <span class="name">${pokemon.name}</span>            
        <div class="detail">
            <ol class="types">
                ${pokemon.types
                  .map((type) => `<li class="type ${type}">${type}</li>`)
                  .join("")}
            </ol>
            <img src="${pokemon.photo}"
                 alt="${pokemon.name}">
        </div>
        <div id="info" class="pokemon-info">
            <div class="info-section">
                <h4>
                    Status
                </h4>    
                <div class="info-row">
                    <label>Hp</label>
                    <label>${pokemon.stats[0]}</label>
                </div>
                <div class="info-row">
                    <label>Attack</label>
                    <label>${pokemon.stats[1]}</label>
                </div>
                <div class="info-row">
                    <label>Defense</label>
                    <label>${pokemon.stats[2]}</label>
                </div>
                <div class="info-row">
                    <label>Special Atack</label>
                    <label>${pokemon.stats[3]}</label>
                </div>   
                <div class="info-row">
                    <label>Special Defense</label>
                    <label>${pokemon.stats[4]}</label>
                </div>   
                <div class="info-row">
                    <label>Speed</label>
                    <label>${pokemon.stats[5]}</label>
                </div>                        
            </div>
            <div class="info-section">
                <h4>
                    Info
                </h4>    
                <div class="info-row">
                    <label>Height</label>
                    <label>${pokemon.height}</label>
                </div>
                <div class="info-row">
                    <label>Weight</label>
                    <label>${pokemon.weight}</label>
                </div>
            </div>
        </div>                            
    </div>  
    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

function loadPokemonDetail(id) {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
  return fetch(url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon);
}

pokemonList.addEventListener("click", (event) => {
  const clickedPokemon = event.target.closest(".pokemon");
  if (clickedPokemon) {
    const pokemonId = clickedPokemon.getAttribute("data-id");
    loadPokemonDetail(pokemonId).then((pokemon) => {
      const details = getDetailModal(pokemon);
      pokemonDetail.innerHTML = details;
    });
  }
  openModal();
});

closeButton.addEventListener("click", () => {
  closeModal();
});
