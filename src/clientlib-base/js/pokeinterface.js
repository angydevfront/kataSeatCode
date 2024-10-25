
var pokeInterface = {
    listContainer: document.querySelector(".list__container"),
    listColor: document.querySelector(".filters__color"),
    listType: document.querySelector(".filters__type"),
    listGender: document.querySelector(".filters__gener"),
    searchBar: document.querySelector(".header__search-input"),
    showButton: document.querySelector(".show"),
    foundDiv: document.querySelector(".found"),
    clearFilters: document.querySelector(".filters__remove"),
    init: function () {
        this.events();
    },
    events: function () {

        this.clearFilters.addEventListener("click", (e) => {
            e.preventDefault();
            this.searchBar.value = "";
            this.listColor.querySelectorAll('input').forEach(color => {
                color.checked = false;
            });
            this.listType.querySelectorAll('input').forEach(type => {
                type.checked = false;
            });
            this.listGender.querySelectorAll('input').forEach(gender => {
                gender.checked = false;
            });
            this.clearContainerList();
            pokemon.clearFilters();
        })
        this.showButton.addEventListener("click", (e) => {
            e.preventDefault();
            pokemon.nextPage();
        })
        this.searchBar.addEventListener("input", (e) => {
            e.preventDefault();
            this.clearContainerList();
            pokemon.keyword = e.target.value;
            pokemon.applyFilter(null, null);
        })
    },
    printPokemon: function (rangeList, showMore) {
        rangeList.forEach(pokemonItem => {
            const listItem = document.createElement('div');
            listItem.classList.add('list__item', 'border');

            const img = pokemon.loadImage(pokemonItem.image);
            img.alt = pokemonItem.name;
            img.classList.add('list__item-img');
            img.width = 150;
            img.height = 150;

            const infoDiv = document.createElement('div');
            infoDiv.classList.add('list__item-info');

            const itemIdP = document.createElement('p');
            itemIdP.classList.add('list__item-id');

            const itemNumberSpan = document.createElement('span');
            itemNumberSpan.classList.add('list__item-number');
            itemNumberSpan.textContent = 'N.º ';

            itemIdP.appendChild(itemNumberSpan);
            itemIdP.append(pokemonItem.id);

            const itemTitleP = document.createElement('p');
            itemTitleP.classList.add('list__item-title');
            itemTitleP.textContent = pokemonItem.name;

            const buttonDiv = document.createElement('div');
            buttonDiv.classList.add('list__item-button', 'border');

            // Crear el enlace "Más información"
            const moreInfoLink = document.createElement('a');
            moreInfoLink.href = '#';
            moreInfoLink.textContent = 'More Info!';
            moreInfoLink.classList.add('silkscreen-bold');

            buttonDiv.appendChild(moreInfoLink);

            infoDiv.appendChild(itemIdP);
            infoDiv.appendChild(itemTitleP);
            infoDiv.appendChild(buttonDiv);

            listItem.appendChild(img);
            listItem.appendChild(infoDiv);

            this.listContainer.appendChild(listItem);
        });
        showMore ? this.showButton.style.display = 'block': this.showButton.style.display = 'none';
        rangeList == undefined || rangeList.length == 0 ? this.foundDiv.style.display='block':this.foundDiv.style.display='none';

    },
    printColorFilter: function (colorFilter) {
        colorFilter.forEach(color => {
            const label = document.createElement('label');
            label.for = color.id;
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.name = "color";
            checkbox.value = color.id;
            checkbox.className = "filters__color-input";
            const div = document.createElement('div');
            div.classList.add('filters__color-box', 'border');
            if(color.name == 'black') div.classList.add('filters__color-box--white');
            div.style.backgroundColor = color.name;
            label.appendChild(checkbox);
            label.appendChild(div);
            this.listColor.appendChild(label);


            checkbox.addEventListener("click", (e) => {
                let allInputs = this.listColor.querySelectorAll('input');
                let ids = [];
                allInputs.forEach(node => {
                    if (node.checked && node.value != '') {
                        ids.push(node.value);
                    }
                });
                this.clearContainerList();
                pokemon.applyFilter('color',ids, null);
            });
        });
    },
    printTypeFilter: function (typeFilter) {
        typeFilter.forEach(type => {
            const divElement = document.createElement("div");
            divElement.classList.add("display-flex");
            const inputElement = document.createElement("input");
            inputElement.classList.add("filters__input");
            inputElement.type = "checkbox";
            inputElement.id = type.id;
            inputElement.name = type.name;
            inputElement.value = type.id;
            const labelElement = document.createElement("label");
            labelElement.setAttribute("for", type.id);
            labelElement.textContent = type.name;
            divElement.appendChild(inputElement);
            divElement.appendChild(labelElement);

            inputElement.addEventListener("click", (e) => {
                let allInputs = this.listType.querySelectorAll('input');
                let ids = [];
                allInputs.forEach(node => {
                    if (node.checked) {
                        ids.push(node.id);
                    }
                });
                this.clearContainerList();
                pokemon.applyFilter('type',ids, null);
            });
            this.listType.appendChild(divElement);
        });
    },
    printGenderFilter: function (genderFilter) {
        genderFilter.forEach(gender => {
            const divElement = document.createElement("div");
            divElement.classList.add("display-flex");
            const inputElement = document.createElement("input");
            inputElement.classList.add("filters__input");
            inputElement.type = "radio";
            inputElement.id = gender.id;
            inputElement.name = "tipo";
            inputElement.value = gender.id;
            const labelElement = document.createElement("label");
            labelElement.setAttribute("for", gender.id);
            labelElement.textContent = gender.name;
            divElement.appendChild(inputElement);
            divElement.appendChild(labelElement);

            inputElement.addEventListener("click", (e) => {
                this.clearContainerList();
                pokemon.applyFilter('gender',e.target.id);
            });
            this.listGender.appendChild(divElement);
        });
    },
    clearContainerList: function () { this.listContainer.innerHTML = ''; },
    clearAllFilter: function () {

    }
}



// Función para ocultar todo el contenido de .filters__select
const hiddenContent = document.querySelectorAll('.filters__select');
const hideAllContent = () => {
    hiddenContent.forEach(content => content.classList.add('hidden'));
};
const showAllContent = () => {
    hiddenContent.forEach(content => content.classList.remove('hidden'));
}

// Función para configurar los eventos de toggle
const setupToggleButtons = () => {
    const toggleButtons = document.querySelectorAll('.filters__name');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function () {
            if (window.matchMedia("(max-width: 720px)").matches) {
                let toggleContent = this.nextElementSibling;
                let arrow = this.querySelector('.filters__arrow');

                if (!toggleContent.classList.contains('hidden')) {
                    toggleContent.classList.add('hidden');
                    arrow.classList.remove('arrow-down');
                    arrow.classList.add('arrow-up');
                } else {
                    hideAllContent();
                    toggleContent.classList.remove('hidden');
                    arrow.classList.remove('arrow-up');
                    arrow.classList.add('arrow-down');
                }
            }
        });

    });
};


const initializeForSmallScreens = () => {
    if (window.matchMedia("(max-width: 720px)").matches) {
        hideAllContent();
        setupToggleButtons();
    } else {
        showAllContent();
    }
};





window.addEventListener('DOMContentLoaded', function () {
    pokeInterface.init();
    initializeForSmallScreens();
});
window.addEventListener('resize', initializeForSmallScreens);