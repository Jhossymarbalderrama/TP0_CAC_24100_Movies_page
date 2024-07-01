/**
 * Funcion con Switch para menu Navegacion
 * @param {*} option
 */
function navbar(option) {
  switch (option) {
    case "adminMovie":
      switchContentBody("adminMovie");
      switchNavSelect("navMovie");
      drawTableMovies();
      break;
    case "adminUser":
      switchContentBody("adminUser");
      switchNavSelect("navUser");
      break;
    case "adminLanguage":
      switchContentBody("adminLanguage");
      switchNavSelect("navLanguage");
      break;
    case "adminCountry":
      switchContentBody("adminCountry");
      switchNavSelect("navCountry");
      break;

    default:
      switchContentBody("adminMovie");
      switchNavSelect("navMovie");
      drawTableMovies();
      break;
  }
}

/**
 *  Funcion de cambio de Contenido Admin View
 */
function switchContentBody(view) {
  resetContentBody();
  let admin = document.getElementById(view);
  admin.classList.remove("hidden");
}

/**
 * Funcion de cambio de Menu Select
 */
function switchNavSelect(select) {
  resetSelectMenuItem();
  let navItem = document.getElementById(select);
  navItem.classList.add("select-nav");
}

/**
 * Reset Display block | none dependiendo que esta seleccionado en el Menu
 * Contenido de Pagina Admin de : Movie | User | Language | Country
 */
function resetContentBody() {
  let a = document.getElementById("adminMovie");
  let b = document.getElementById("adminUser");
  let c = document.getElementById("adminLanguage");
  let d = document.getElementById("adminCountry");

  document.getElementById("tableMovies").innerHTML = '';

  a.classList.add("hidden");
  b.classList.add("hidden");
  c.classList.add("hidden");
  d.classList.add("hidden");
}

/**
 * Reset de Class agregadas al navBar
 * Color de navegacion
 */
function resetSelectMenuItem() {
  console.log("Remove Nav Class");
  let a = document.getElementById("navMovie");
  let b = document.getElementById("navUser");
  let c = document.getElementById("navLanguage");
  let d = document.getElementById("navCountry");

  a.classList.remove("select-nav");
  b.classList.remove("select-nav");
  c.classList.remove("select-nav");
  d.classList.remove("select-nav");
}

/**
 * Funcion encargada de generar una Tabla con los datos de las Movies que
 * vienen del Backend
 */
async function drawTableMovies() {
  let docTable = document.getElementById("tableMovies");
  docTable.innerHTML +=
    `
     <table class="table">
        <thead class="table-dark">
            <tr>
                <th scope="col">#</th>
                <th scope="col">title</th>
                <th scope="col">poster</th>
                <th scope="col">backdrop</th>
                <th scope="col">release</th>
                <th scope="col">runtime</th>
                <th scope="col">overview</th>
                <th scope="col">status</th>
                <th scope="col">budget</th>
                <th scope="col">revenue</th>
                <th scope="col">language</th>
                <th scope="col">
                    <i class="fa-solid fa-rotate-right"></i>
                </th>
            </tr>
        </thead>
        <tbody>` +
    (await drawMovies()) +
    `          
        </tbody>
    </table>
    `;
}

async function getMovieApiBackend() {
  let resMovies = '';

  await fetch(`http://localhost:8080/webapp/findAllMovies`)
    .then((res) => res.json())
    .then((res) => {
      resMovies = res;
      console.log(res);
    })
    .catch((err) => console.error(err));

  return resMovies;
}

async function drawMovies() {
  let listMovies = await getMovieApiBackend();
  let res = '';

  listMovies.forEach((movie) => {
    res += `
                    <tr>
                        <th scope="row">${movie.id}</th>
                        <td>${movie.title}</td>
                        <td>
                            <img src='${movie.poster}'>
                        </td>
                        <td>
                            <img src='${movie.backdrop}'>
                        </td>
                        <td>${new Date(movie.release_date)}</td>
                        <td>${movie.runtime}</td>
                        <td>${movie.overview}</td>
                        <td>${movie.status}</td>
                        <td>${movie.budget}</td>
                        <td>${movie.revenue}</td>
                        <td>${movie.language}</td>
                        <td>
                            <i class="fa-solid fa-pen text-warning px-1"></i>
                            <i class="fa-solid fa-trash text-danger px-1"></i>
                        </td>
                    </tr>
                    `;
  });

  return res;
}

navbar();
