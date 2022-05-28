"use strict";
const MISSING_IMAGE_URL = "http://tinyurl.com/missing-tv";
const TVMAZE_API_URL = "http://api.tvmaze.com/";

const $showsList = $("#shows-list");
const $episodesList = $("#episodesList");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(q) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let res = await axios.get (`http://api.tvmaze.com/search/shows?q=${q}`);

  let shows = res.data.map(function(result) {
    let show = result.show
  return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : MISSING_IMAGE_URL,
    };
  });
  return shows;
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img src="${show.image}" alt="${show.name}" class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  let term = $("#search-query").val();
  let shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

async function showID(id) {
  let res = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  
  let episodes = res.data.map(function(result) {
  let ep = result.episode
  return {
    id: ep.id, 
    name: ep.name,
    season: ep.season,
    number: ep.number

  };
});
  return episodes;
}

function populateEpisodes(eps) {
  const $episodeList = $("episodes-list");
  $episodeList.empty();

  for (let ep of eps) {
    let $item = $(
      `<li>
        ${ep.name}
        (season ${ep.season}, episode ${ep.number})
      </li>`
    );
    $episodeList.append($item);
  }
  $episodesArea.show();
}

$("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(evt) {
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});
/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function populateEpisodes(episodes) { }
