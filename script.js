// My key for the API used to find movies.
const apiKey = "dc396aaa";

// List of the user's nominees
const nominees = [];

// On load, checks if the user has nominees from a previous visit
onload = function() {
    if (localStorage.getItem("stored_nominees")) {
        let storage = JSON.parse(localStorage.getItem("stored_nominees"));

        // If nominees are found in storage, those are loaded into the current page
        if (storage !== null) {
            for (let i = 0; i < storage.length; i++) {
                const nomineeList = document.getElementById("nomineeList");
                nomineeList.classList.remove("hidden");
                nominees.push(storage[i]);
                addNominee(storage[i]);
            }
        }
    }
};

// Displays the warning when the user has 5 movies.
function maxMovieWarning() {
    let snackBar = document.getElementById("snackbar");
    snackBar.className = "show"; // Shows the warning
    setTimeout(function() { snackBar.className = snackBar.className.replace("show", ""); }, 3000); // Hides the warning after 3 seconds
}

document.addEventListener("click", event => {
    // Listener for the results list.
    if (event.target.matches(".searchLI")) {
        const movie = event.target.value;

        // If the user hasn't nominated a movie AND fewer than 5 movies have been nominated, adds a movie to their nominations list.
        if (!nominees.includes(movie) && nominees.length < 5) {
            const nomineeList = document.getElementById("nomineeList");
            nomineeList.classList.remove("hidden");

            // Removes the user's nominee list from local storage to be replaced.
            if (localStorage.getItem("stored_nominees")) {
                localStorage.removeItem("stored_nominees");
            }

            // Show the movie
            nominees.push(movie);
            localStorage.setItem("stored_nominees", JSON.stringify(nominees));
            addNominee(movie);

            /// Disable search result button for that movie.
            event.target.disabled = true;
        }

        // Calls the function to display a notice if the user has nominated the max number of movies.
        if (nominees.length === 5) {
            maxMovieWarning();
        }
    }


    /// Listener for the nominees list
    if (event.target.matches(".nomineeLI")) {
        const movie = event.target.value;

        // Gets the index of the movie info from the nominees
        const index = nominees.indexOf(movie);

        if (index > -1) {
            // Removes the nomination list from local storage temporarily
            if (localStorage.getItem("stored_nominees")) {
                localStorage.removeItem("stored_nominees");
            }

            // Removing the user nominated movie from the list
            nominees.splice(index, 1);

            // Re-adds the nomination list to local storage
            localStorage.setItem("stored_nominees", JSON.stringify(nominees));
        }

        // If there are no more nominations, re-hides the nominations card
        if (nominees.length === 0) {
            const nomineeList = document.getElementById("nomineeList");
            nomineeList.classList.add("hidden");
        }

        // Removes the "li" element from the search
        event.target.parentNode.remove();

        // Iterates through the movie list and reenables the button, if found.
        const oldSearchResult = document.querySelectorAll(".searchResult button");
        if (oldSearchResult.length >= 1) {
            for (let i = 0; i < oldSearchResult.length; i++) {
                if (oldSearchResult[i].value === movie) {
                    oldSearchResult[i].disabled = false;
                    break;
                }
            }
        }
    }
});


// Submit's the search query when the user clicks "Enter"
document.addEventListener("keypress", (event) => {
    if (event.keyCode === 13) {
        let searchQuery = document.getElementById("searchQuery").value;
        searchQuery = searchQuery.trim().toLowerCase();
        if (searchQuery.length !== 0 || searchQuery !== "") {
            searchMovies(searchQuery);
        }
    }
});


// Function that adds to the list when user adds a nomination
const addNominee = (nominee) => {
    const ul = document.querySelector(".nominees"); // Retrieves the list in HTML

    // Creates the bullet point for the nominee
    const li = document.createElement("li");
    li.textContent = nominee;

    // Adds & configures a bootstrap button to remove a nominee beside the nominee.
    const button = document.createElement("button");
    button.innerHTML = "Remove";
    button.setAttribute("class", "btn btn-outline-secondary btn-sm nomineeLI");
    button.setAttribute("value", nominee);

    // Appends the button to the point
    li.append(button);

    // Appends the point to the list
    ul.appendChild(li);
};


// Function for creating a bullet & button for the results column
const createList = (movie) => {
    const li = document.createElement('li');

    // Information we display for the movie (Title & Year)
    const movieInfo = `${movie["Title"]} (${movie["Year"]})`;
    li.textContent = movieInfo;

    // Creates the nominate button for the movie.
    const button = document.createElement("button");
    // If the nominees list already includes the movie, the nominate button is disabled.
    if (nominees.includes(movieInfo)) {
        button.disabled = true;
    }
    button.innerHTML = "Nominate";
    button.setAttribute("class", "btn btn-outline-secondary btn-sm searchLI");
    button.setAttribute("value", movieInfo);

    // Adds the button to the list.
    li.append(button);
    return li;
};

// Function that appends list elements to the page from search results
const listResults = (movies) => {
    // Makes the search results card visible
    const searchResults = document.getElementById("searchResults");
    searchResults.classList.remove("hidden");

    let searchQuery = document.getElementById("searchQuery").value; // Query searched by the user
    const ul = document.querySelector('.searchResult'); // List of results from HTML
    const resultFor = document.querySelector(".resultFor"); // Title above results from HTML
    resultFor.append(`Results for "${searchQuery}"`);

    // Maps the movies found to the result list
    movies.map(movie => {
        ul.appendChild(createList(movie));
    });
};


//  If a previous search occurred, resets & hides it.
const resetSearchResults = () => {
    const prevUL = document.querySelector(".searchResult");
    const prevLi = document.querySelectorAll(".searchResult li");
    const resultFor = document.querySelector(".resultFor");
    resultFor.innerText = "";

    // Clearing previous movie search results if any
    if (prevLi.length > 0) {
        for (let i = 0; i < prevLi.length; i++) {
            prevUL.removeChild(prevLi[i]);
        }
    }
};

// Function for searching for movies using the API
const searchMovies = (movieTitle) => {
    axios.get(`https://www.omdbapi.com/?s=${movieTitle}&type=movie&apikey=${apiKey}`) // Searches movies only.
        .then(response => {

            if (response.status === 200) {
                // Previous results are removed
                resetSearchResults();

                // If movies are found, then we list them using the above functions.
                if (response.data["Response"] === "True") {
                    const searchResult = response.data.Search;
                    listResults(searchResult);
                } 

                // If no movies are found, then we append an error message.
                else {
                    // Output the error message to the console
                    const errorMessage = response.data["Error"];
                    console.log(errorMessage);

                    // Display the search results (which are reset before)
                    const searchResults = document.getElementById("searchResults");
                    searchResults.classList.remove("hidden");

                    // Append a message to the user saying that no result was found
                    let searchQuery = document.getElementById("searchQuery").value; // Query searched by the user
                    const resultFor = document.querySelector(".resultFor");
                    resultFor.append(`No results found for "${searchQuery}"`);
                }
            }
        })
        .catch(error => console.error(error));
};