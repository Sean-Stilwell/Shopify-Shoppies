# Shopify Shoppies Nomination Page

This is my submission for Shopify's Frontend Intern Challenge for the Fall 2021 work term.

[Visit the application here!](https://seanstilwell.ca/shopify_challenge/index.html)

## The Challenge

We need a webpage that can search OMDB for movies, and allow the user to save their favourite films they feel should be up for nomination. When they've selected 5 nominees they should be notified they're finished.

We'd like a simple to use interface that makes it easy to:
* Search OMDB and display the results (movies only)
* Add a movie from the search results to our nomination list
* View the list of films already nominated
* Remove a nominee from the nomination list

### Technical requirements
1. Search results should come from OMDB's API (free API key: http://www.omdbapi.com/apikey.aspx).
2. Each search result should list at least its title, year of release and a button to nominate that film.
3. Updates to the search terms should update the result list
4. Movies in search results can be added and removed from the nomination list.
5. If a search result has already been nominated, disable its nominate button.
6. Display a banner when the user has 5 nominations.

## My Solution

![View of the application with sample results](/app.PNG)

I created a solution that stays true to the reference image while adding some simple cosmetic changes. The app uses Bootstrap to facilitate a responsive design, but is otherwise coded myself.

### How it meets the requirements
1. The searchMovies() function in [script.js](https://github.com/Sean-Stilwell/Shopify-Shoppies/blob/master/script.js) calls the API by searching for the movie title & searching only for movies.
2. Upon searching, a simple unordered list appears with the title, year of release, and a nominate button.
3. Searching again will modify the result list accordingly.
4. These criteria are met by clicking the "Nominate" button in the search results or "Remove" in the nomination list.
5. The nominate button gets disabled when it's clicked.
6. A warning appears at the bottom of the page when a user has nominated 5 movies.