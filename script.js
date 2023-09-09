let matchedCards = 0;
let firstCard, secondCard;
let turn = 1; // 1 for Player 1, 2 for Player 2
let player1Score = 0;

$(document).ready(function() {
    fetchPokemons(); // inicia com o Modo Iniciais

    $('#switch-mode').on('click', function() {
        $('.game-board').empty(); // limpa o tabuleiro anterior

        if (isRandomMode) {
            isRandomMode = false;
            $(this).text('Trocar para Modo Aleatório');
            fetchPokemons(); // carrega os Pokémon iniciais
        } else {
            isRandomMode = true;
            $(this).text('Trocar para Modo Iniciais');
            fetchRandomPokemons(); // carrega Pokémon aleatórios
        }
    });
});



function fetchPokemons() {
    const promises = [];
    for (let i = 1; i <= 24; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then(response => response.json()));
    }

    Promise.all(promises).then(pokemons => {
        const cardArray = [...pokemons, ...pokemons];
        shuffleArray(cardArray);

        cardArray.forEach(pokemon => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-card-type', pokemon.types[0].type.name);
            card.innerHTML = `
                <div class="card-back"></div>
                <div class="card-content">
                    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                    <p>${pokemon.name}</p>
                </div>`;
            card.addEventListener('click', flipCard);
            $('.game-board').append(card);
        });
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function flipCard() {
    if (this === firstCard) return; // Impede que o mesmo cartão seja selecionado duas vezes

    if (firstCard && secondCard) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        checkMatch();
    }


}

function checkMatch() {
    if (firstCard.querySelector('img').src === secondCard.querySelector('img').src) {
        matchedCards += 2;
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);

        if (turn === 1) {
            player1Score++;
            $('#player1 span').text(player1Score);
        } else {
            player2Score++;
            $('#player2 span').text(player2Score);
        }

        resetCards();

        if (matchedCards === 48) {
            const winner = player1Score > player2Score ? "player1" : "player2";
            const message = player1Score === player2Score ? "It's a tie!" : `${winner} wins!`;
            if (winner !== "player1" && winner !== "player2") {
                $('#player1, #player2').addClass('celebrate');
            } else {
                $(`#${winner}`).addClass('celebrate');
            }
            alert(`Game Over! ${message}`);
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            switchTurns();
            resetCards();
        }, 1000);
    }
}

function switchTurns() {
    turn = turn === 1 ? 2 : 1;
    alert(`Player ${turn}'s turn!`);
}

function resetCards() {
    firstCard = null;
    secondCard = null;
}
let isRandomMode = false;
let isStarterMode = false;
// ... (restante do código inicial)

$(document).ready(function() {
    fetchPokemons(); // inicia com o Modo Padrão

    $('#starter-mode').on('click', function() {
        $('.game-board').empty(); 
        isStarterMode = true;
        isRandomMode = false;
        fetchStarterPokemons(); 
    });

    $('#random-mode').on('click', function() {
        $('.game-board').empty();
        isStarterMode = false;
        isRandomMode = true;
        fetchRandomPokemons(); 
    });

    $('#default-mode').on('click', function() {
        $('.game-board').empty();
        isStarterMode = false;
        isRandomMode = false;
        fetchPokemons(); 
    });
});

function fetchStarterPokemons() {
    const starters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 152, 153, 154, 155, 156, 157, 158, 159, 160];
    const promises = starters.map(id => fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(response => response.json()));

    Promise.all(promises).then(pokemons => {
        const cardArray = [...pokemons, ...pokemons];
        shuffleArray(cardArray);
        cardArray.forEach(addCardToBoard);
    });
}

function fetchRandomPokemons() {
    const totalPokemonsInApi = 807;
    const numberOfUniquePokemonsRequired = 10;
    const promises = [];
    const randomPokemonIds = new Set();

    while(randomPokemonIds.size < numberOfUniquePokemonsRequired) {
        let randomId = Math.floor(Math.random() * totalPokemonsInApi) + 1;
        randomPokemonIds.add(randomId);
    }

    Array.from(randomPokemonIds).forEach(id => {
        promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(response => response.json()));
    });

    Promise.all(promises).then(pokemons => {
        const cardArray = [...pokemons, ...pokemons];
        shuffleArray(cardArray);
        cardArray.forEach(addCardToBoard);
    });
}

// ... (restante das funções)
