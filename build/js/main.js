const regex = /\/(\d+)\/?$/;
const imageCache = {}; // Objeto para guardar las imágenes cargadas

var pokemon = {
    pokemonList: null,
    typeList: null,
    colorList: null,
    genderlist: null,
    keyword: '',
    filteredList: {},
    filteredByColor: [],
    filteredByType: [],
    filteredByGender: [],
    dataMapped: {
        firstLevel: '',
        secondLevel: ''
    },
    deleteData: false,
    page: 0,
    itemToLoad: 20,
    apiURLEndpoints: {
        'listItemsEndpoint': 'https://pokeapi.co/api/v2/pokedex/national',
        'listTypesEndpoint': 'https://pokeapi.co/api/v2/type',
        'listColorsEndpoint': 'https://pokeapi.co/api/v2/pokemon-color',
        'listGenderEndpoint': 'https://pokeapi.co/api/v2/gender'
    },
    assetURL: {
        'detailImageEndpoint': 'https://assets.pokemon.com/assets/cms2/img/pokedex/detail/{pokemon-id}.png',
        'fullImageEndpoint': 'https://assets.pokemon.com/assets/cms2/img/pokedex/full/{pokemon-id}.png'
    },
    colorFilter: {
        id: null,
        name: null
    },
    typeFilter: {
        id: null,
        name: null
    },
    genderFilter: {
        id: null,
        name: null
    },
    pokemonObject: {
        id: null,
        name: null,
        image: null,
        fullImage: null
    },
    init: function () {
        this.clearCache();
        this.start();
    },
    start: async function () {
        let apiData = await this.apiCall(this.apiURLEndpoints.listItemsEndpoint);
        const pokemonData = apiData?.pokemon_entries;
        this.pokemonList = this.populatePokemons(pokemonData);

        let propertiesToMap = { ...this.dataMapped };
        propertiesToMap.firstLevel = 'results';
        this.typeList = await this.handleCacheData(this.apiURLEndpoints.listTypesEndpoint, this.typeFilter, propertiesToMap);
        this.colorList = await this.handleCacheData(this.apiURLEndpoints.listColorsEndpoint, this.colorFilter, propertiesToMap);
        this.genderlist = await this.handleCacheData(this.apiURLEndpoints.listGenderEndpoint, this.genderFilter, propertiesToMap);

        const array = Array.from({ length: 20 }, (_, i) => i + 1);
        this.loadAsset(array, this.pokemonList);
        this.applyFilter(null, null);
        pokeInterface.printTypeFilter(this.typeList);
        pokeInterface.printColorFilter(this.colorList);
        pokeInterface.printGenderFilter(this.genderlist);
    },
    handleCacheData: async function (URL, pokemonDataType, propertiesToMap) {
        const cachedData = localStorage.getItem(URL);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
        let apiData = await this.apiCall(URL);
        const typeData = this.handleJSON(apiData, propertiesToMap);
        let typeList = this.populateFilter(typeData, pokemonDataType);
        localStorage.setItem(URL, JSON.stringify(typeList));
        return typeList;
    },
    handleJSON: function (dataJSON, propertiesToMap) {
        if (propertiesToMap.firstLevel) {
            let dataJSONFirstLevelMapped = dataJSON[propertiesToMap.firstLevel];
            if (propertiesToMap.secondLevel) {
                const dataJSONSecondLevelMapped = dataJSONFirstLevelMapped.map(entry => {
                    return {
                        name: entry[propertiesToMap.secondLevel].name,
                        url: entry[propertiesToMap.secondLevel].url
                    };
                });
                return dataJSONSecondLevelMapped;
            }
            return dataJSONFirstLevelMapped;
        }
        return undefined;
    },
    clearCache: function () {
        localStorage.clear();
    },
    apiCall: async function (URI) {
        try {
            const response = await fetch(URI);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            return data;
        }
        catch (error) {
            console.error('Error fetching data:', error);
            return undefined;
        }
    },
    populatePokemons: function (pokemonData) {
        let pokemonList = [];
        if (pokemonData) {
            pokemonData.forEach(item => {
                let newPokemon = { ...this.pokemonObject };
                newPokemon.id = item.entry_number;
                newPokemon.name = item.pokemon_species?.name;
                pokemonList.push(newPokemon);
            });
        }
        return pokemonList;
    },
    populateFilter: function (data, objectType) {
        let filterList = [];
        if (data) {
            data.forEach(item => {
                let filter = { ...objectType };
                filter.id = parseInt(this.extractId(item.url), 10);
                filter.name = item.name;
                filterList.push(filter);
            });
        }
        return filterList;
    },
    extractId: function (url) {
        let match = url.match(regex);
        return match ? match[1] : '';
    },
    loadAsset: function (idList, pokemonList) {
        idList.forEach(element => {
            let currentPokemon = pokemonList.find(pokemon => pokemon.id === element);
            if (!pokemon.image) {
                currentPokemon.image = this.assetURL.detailImageEndpoint.replace("{pokemon-id}", currentPokemon.id.toString().padStart(3, '0'));
            }
            if (!pokemon.fullImage) {
                currentPokemon.fullImage = this.assetURL.fullImageEndpoint.replace("{pokemon-id}", currentPokemon.id.toString().padStart(3, '0'));
            }
        });
    },
    applyFilter: async function (filterType, ids) {
        this.filteredList = pokemon.pokemonList;
        let URI = '';
        let propertiesToMap = { ...this.dataMapped };
        propertiesToMap.firstLevel = 'results';
        if (filterType) {
            this.deleteData = false;
            switch (filterType) {
                case "color":
                    this.filteredByColor = [];
                    for (const id of ids) {
                        URI = this.apiURLEndpoints.listColorsEndpoint.concat("/", id);
                        propertiesToMap.firstLevel = 'pokemon_species';
                        let currentColorFilter = await this.handleCacheData(URI, this.colorFilter, propertiesToMap);
                        this.filteredByColor = this.filteredByColor.concat(currentColorFilter);
                    }
                    if (this.filteredByColor.length == 0 && ids.length > 0) this.deleteData = true;
                    else if (ids.length == 0) this.deleteData = false;
                    break;
                case "type":
                    this.filteredByType = [];
                    for (const id of ids) {
                        URI = this.apiURLEndpoints.listTypesEndpoint.concat("/", id);
                        propertiesToMap.firstLevel = 'pokemon';
                        propertiesToMap.secondLevel = 'pokemon';
                        let currentTypeFilter = await this.handleCacheData(URI, this.typeFilter, propertiesToMap);
                        this.filteredByType = this.filteredByType.concat(currentTypeFilter);
                    }
                    if (this.filteredByType.length == 0 && ids.length > 0) this.deleteData = true;
                    else if (ids.length == 0) this.deleteData = false;
                    break;
                case "gender":
                    URI = this.apiURLEndpoints.listGenderEndpoint.concat("/", ids);
                    propertiesToMap.firstLevel = 'pokemon_species_details';
                    propertiesToMap.secondLevel = 'pokemon_species';
                    this.filteredByGender = await this.handleCacheData(URI, this.typeFilter, propertiesToMap);
                    if (this.filteredByGender.length == 0) this.deleteData = true;
                    break;
            }
        }
        //first do the intersection between all filters
        this.filteredList = this.intersection(this.filteredByColor, this.filteredByType, this.filteredByGender);
        //Apply the intersection between list filtered and all pokemon list with assets loaded
        if (!this.deleteData) this.filteredList = this.intersection(this.pokemonList, this.filteredList);
        if (this.deleteData) this.filteredList = [];
        if (this.keyword && this.keyword != '' && this.filteredList.length > 0) { 
            this.filteredList = this.searchWord(this.filteredList); 
            this.deleteData =  this.filteredList.length == 0?true:false;
        }
        this.filteredList = this.filteredList.sort((a, b) => a.id - b.id);
        this.page = 0;
        this.showPokemon(!this.deleteData);
    },
    searchWord: function (pokemonList) {
        return pokemonList.filter(pokemon =>
            pokemon.name.toLowerCase().includes(this.keyword.toLowerCase()) ||
            pokemon.id.toString().includes(this.keyword)
        );
    },
    showPokemon: async function (showAll) {
        let range = this.page * this.itemToLoad;
        let showMore = range + this.itemToLoad >= this.filteredList.length ? false : true;
        let rangeList = range + this.itemToLoad >= this.filteredList.length ? this.filteredList.slice(range, range + this.filteredList.length) : this.filteredList.slice(range, range + this.itemToLoad);
        this.loadAsset((rangeList).map(pokemon => pokemon.id), this.pokemonList);
        if (showAll) rangeList = this.intersection(rangeList, this.pokemonList);
        else {
            rangeList = [];
            showMore = false;
        }
        pokeInterface.printPokemon(rangeList, showMore);
    },
    nextPage: function (){
        this.page = this.page + 1;
        this.showPokemon(!this.deleteData);
    },
    clearFilters: function () {
        this.page = 0;
        this.keyword = '';
        this.filteredList = {},
            this.filteredByColor = {},
            this.filteredByType = {},
            this.filteredByGender = {},
            this.applyFilter(null, null);
    },
    intersection: function (...arrays) {
        // Filtrar arrays vacíos
        const nonEmptyArrays = arrays.filter(array => array.length > 0);
        if (nonEmptyArrays.length === 0) return [];
        return nonEmptyArrays.reduce((acc, currArray) => {
            return acc
                .filter(obj1 => currArray.some(obj2 => obj1.id === obj2.id))
                .map(obj1 => {
                    const match = currArray.find(obj2 => obj1.id === obj2.id);
                    return { ...obj1, ...match };
                });
        });
    },
    union: function (...arrays) {
        const nonEmptyArrays = arrays.filter(array => array.length > 0);
        if (nonEmptyArrays.length === 0) return [];
        const mergedObjects = {};
        nonEmptyArrays.forEach(array => {
            array.forEach(obj => {
                if (mergedObjects[obj.id]) {
                    mergedObjects[obj.id] = { ...mergedObjects[obj.id], ...obj };
                } else {
                    mergedObjects[obj.id] = { ...obj };
                }
            });
        });
        return Object.values(mergedObjects);
    },
    loadImage: function (url) {
        if (imageCache[url]) {
            console.log('Imagen obtenida de la caché');
            return imageCache[url];
        }
        const img = new Image();
        img.src = url;
        imageCache[url] = img;
        return img;
    }

}

document.addEventListener('DOMContentLoaded', function () {
    pokemon.init();
});
