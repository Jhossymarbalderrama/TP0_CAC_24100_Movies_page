const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMDJkNzk5ZmRhZmVjMzc5NTkzMDU4M2I5ZWYzOTNjNCIsInN1YiI6IjY2NGI1ODc4NmFjZWFjZWNiNTJmZjFmYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9ghZ3qCP8ssfei7PxNR1bF7KwrHi2q6Mw8iCeXA4Xhg",
  },
};

const API_TMDB_KEY = "d02d799fdafec3795930583b9ef393c4";
const API_YOUTUBE_KEY = "AIzaSyB003EssS4qAd9ci0FK7lkmYWrxpdrPzZ4";

var movies = []; // ? Array de Movies
var page = 1;
var movieDetail; // ? Detalle de Movie
var urlImgAPI = "https://image.tmdb.org/t/p/w500/";

const userLogin = {
  email: 'user@gmail.com',
  password: 'userPassword'
}



/**
 * Funcion para obtener movies de Api
 *
 * @returns [Movies]
 */
async function getMoviesAPI() {
  let resMoviesApi;

  await fetch(
    `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc`,
    options
  )
    .then((res) => res.json())
    .then((res) => {
      resMoviesApi = res.results;
    })
    .catch((err) => console.error(err));

  return resMoviesApi;
}





/**
 * Funcion para obtener los detalles de una movie por ID
 * @param {*} movieID
 * @returns Detalle de movie
 */
async function getDetailMovieAPI(movieID) {
  let resMoviesApi;

  await fetch(
    `https://api.themoviedb.org/3/movie/${movieID}?api_key=${API_TMDB_KEY}`,
    options
  )
    .then((res) => res.json())
    .then((res) => {
      // console.log(res);
      resMoviesApi = res;
    })
    .catch((err) => console.error(err));

  return resMoviesApi;
}




/**
 * Get trailer movie x nameMovie YOUTUBE-API V3
 * @param {*} movieName 
 * @returns 
 */
async function getMovieTrailerUrl(movieName) {
  const query = `${movieName} trailer`;
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
    query
  )}&key=${API_YOUTUBE_KEY}&maxResults=1`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      const videoId = data.items[0].id.videoId;
      return videoId;
    } else {
      console.log("No trailers found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching the trailer:", error);
    return null;
  }
}




/**
 * Dibujo las movies
 */
async function drawMovies() {
  const movieContainter = document.getElementById("container-movies");
  const sliderMovies = document.getElementById('slider');

  moviesHTML = [];
  moviesHTMLSlider = [];
  movieContainter.innerHTML = ``;

  movies = await getMoviesAPI(); // ? GET movies

  // ? Constructor de Movie
  // ? Tambien agrego las URLBanner a la seccion de slider tendencias
  movies.forEach((movie) => {
    moviesHTML.push(constructorMovie(movie));    
    moviesHTMLSlider.push(constructorMovieSlide(urlImgAPI+movie.poster_path));
  });

  //  ? Agrego las peliculas al contenedor de movies a #container-movies
  moviesHTML.forEach((movie) => {
    movieContainter.innerHTML += movie;
  });
   
  // ? Agrego los banner de las peliculas a #slider
  moviesHTMLSlider.forEach((banner) => {
    sliderMovies.innerHTML += banner;
  });
}




/**
 * Constructor de Movie, armo la estructura html de cada movie
 * @param {*} movie
 * @returns html movie
 */
function constructorMovie(movie) {
  return `
          <div class="p-5 p-sm-2 p-xl-3 col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
            <a href='./pages/detalle.html' onclick="saveMovie(${movie.id})">
              <div class="movies">
                <div class="movie">
                  <img src="${urlImgAPI + movie.poster_path}" alt="">

                  <div class="movie-titulo">
                    <a href='./pages/detalle.html' onclick="saveMovie(${
                      movie.id
                    })">${movie.title}</a>
                  </div>
                </div>
              </div>
            </a>
          </div>`;
}

function constructorMovieSlide(urlBanner){
  return `
    <div class="slide">
      <img class="rounded" src="${urlBanner}" alt="">
    </div>   
  `;
}



/**
 * Slider Movies, volver pagina
 */
function beforePage() {
  if (page > 1) {
    page--;
    drawMovies();
  }
}




/**
 * Slider Movies, ir a la otra pagina
 */
function afterPage() {
  page++;
  drawMovies();
}




/**
 * Guardo ID Movie en localstorage
 * @param {*} movie
 */
async function saveMovie(movie) {
  localStorage.setItem("movieID", movie);
}




/**
 * Veo los detalles de una Movie segun una ID
 */
async function viewDetailMovie() {
  movieDetail = await getDetailMovieAPI(localStorage.getItem("movieID"));

  constructorDetailMovie(movieDetail);
}




/**
 * Obtengo los generos de la movie ya para insertar a html
 * @param {*} genres 
 * @returns 
 */
function getGenres(genres) {
  let res = "";

  genres.forEach((text) => {
    res += text.name + " - ";
  });

  return res.slice(0, res.length - 2);
}




/**
 * Obtengo la informacion de la production y compania de la movie
 * @param {*} production_companies 
 * @returns 
 */
function getProduction_companies(production_companies) {
  let res = "";

  production_companies.forEach((data) => {
    res += `
      <div class="col-sm-12 col-md elenc">
        <h5 class="fw-bold">${data.name}</h5>
      </div>
    `;
  });

  return res;
}




/**
 * Constructor de view detalle de movie
 * @param {*} movie 
 */
function constructorDetailMovie(movie) {
  const containerDetailMovie = document.getElementById("container-detail-movie");
  const containerTrailer = document.getElementById("container-trailer");
  const constinaerInformation = document.getElementById("container-information");
  const bannerDetalle = document.getElementById("banner-detalle");

  // ? add banner movie
  bannerDetalle.style.backgroundImage = `linear-gradient(to top, #030303, #03030331), url('${urlImgAPI+movie.backdrop_path}')`;

  // ? information movie
  let detail = `
              <div class="col-12 col-lg-5">
                <div class="portada d-flex flex-column align-items-center align-items-lg-end py-4 py-md-0">
                  <img src="${urlImgAPI + movie.poster_path}" alt="">
                </div>
              </div>

              <div class="col-12 col-lg-6">
                <div class="d-flex flex-column p-3">
                  <div class="portada-text text-start text-shadow">
                    <h1 class="fw-bold">${movie.title}</h1>
                    <p>${movie.release_date} • ${getGenres(movie.genres)} • ${movie.runtime}m</p>

                    <h3 class="fw-bold">Overview</h3>
                    <p>
                     ${movie.overview}
                    </p>

                    <div class="row m-0 text-start">
                     ${getProduction_companies(movie.production_companies)}
                    </div>
                  </div>
                </div>
              </div>
  `;

  containerDetailMovie.innerHTML += detail;

  // ? trailer movie
  getMovieTrailerUrl(movie.title).then((res) => {
    containerTrailer.innerHTML += `
        <iframe src="https://www.youtube.com/embed/${res}"
        title="YouTube video player" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen="">
        </iframe>
        `;
  });

  // ? information movie
  constinaerInformation.innerHTML += `
      <p class="d-flex justify-content-between"><a>Status</a>${movie.status}</p>
      <p class="d-flex justify-content-between"><a>Original Language</a>${movie.spoken_languages[0].name}</p>
      <p class="d-flex justify-content-between"><a>Budget</a>$ ${movie.budget}</p>
      <p class="d-flex justify-content-between"><a>Revenue</a>$ ${movie.revenue}</p>
  `;
}

// ! Code Form Login
function validation(){
  
  const inputEmail = document.getElementById('email').value;
  const inputPassword = document.getElementById('password').value;

  const elementEmailValue =  document.getElementById('validation-email');
  const elementPasswordValue =  document.getElementById('validation-password');

  if(!inputEmail){
    elementEmailValue.classList.remove('visually-hidden');
  }else{
    elementEmailValue.classList.add('visually-hidden');
  }
  
  if(!inputPassword){
    elementPasswordValue.classList.remove('visually-hidden');
  }else{    
    elementPasswordValue.classList.add('visually-hidden');
  }

  
 if(inputEmail && inputPassword){
  inputEmail == userLogin.email && inputPassword == userLogin.password ? alert(`¡Bienvenido ${inputEmail} 😀!`) : alert(`Usuario no encontrado. 😢`);
 }
}