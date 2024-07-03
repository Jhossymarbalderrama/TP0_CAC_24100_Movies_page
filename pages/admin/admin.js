let listMovies;

document.getElementById("exampleModalCenterTitle").textContent =
  "Alta de Movie";

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

  document.getElementById("tableMovies").innerHTML = "";

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
  docTable.innerHTML = "";
  docTable.innerHTML +=
    `
     <table class="table table-auto">
        <thead class="table-dark">
            <tr>
                <th scope="col">#</th>
                <th scope="col">poster</th>
                <th scope="col">title</th>
                <th scope="col">release</th>
                <th scope="col">runtime</th>
                <th scope="col">overview</th>
                <th scope="col">status</th>
                <th scope="col">budget</th>
                <th scope="col">revenue</th>
                <th scope="col">language</th>
                <th scope="col" class='d-flex align-items-center justify-content-center' style='height: 6vh;'>
                    <div onclick="drawTableMovies()">
                    <i class="fa-solid fa-rotate-right text-info"></i>
                    </div>
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
  let resMovies = "";

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
  listMovies = await getMovieApiBackend();
  let res = "";
  let bgRow = false;

  listMovies.forEach((movie) => {
    let bgColor = bgRow ? "table-light" : "table-secundary";

    res += `
              <tr class="${bgColor}">
                  <td scope="row">${movie.id}</td>
                  <td align='center'>
                      <img src='${movie.poster}' height='40%' width='30%'>
                  </td>                        
                  <td>${movie.title}</td>
                  <td>${transformDate(movie.release_date)}</td>
                  <td>${movie.runtime}min</td>
                  <td>${movie.overview.slice(0, 70)} . . .</td>
                  <td>${movie.status}</td>
                  <td>${movie.budget}</td>
                  <td>${movie.revenue}</td>
                  <td>${movie.language}</td>
                  <td>
                      <div class="d-flex justify-content-center">
                          <i class="fa-solid fa-pen text-warning px-1" onclick="selectMovieUpdate(${
                            movie.id
                          })"></i>
                          <i class="fa-solid fa-trash text-danger px-1" onclick="selectMovieDelete(${
                            movie.id
                          })"></i>
                      </div>
                  </td>
              </tr>
          `;
    bgRow = !bgRow;
  });

  return res;
}

function addMovie() {
  crudMovie("create");
}

function validarFormData(formMovie) {
  let vTitle =
    (vPoster =
    vBackdrop =
    vRelease =
    vRuntime =
    vOverview =
    vStatus =
    vBudget =
    vLanguage =
    vRevenue =
      true);

  let releaseDateValue = document.getElementById("release_date").value;
  let runtimeDateValue = document.getElementById("runtime").value;
  let budgetDateValue = document.getElementById("budget").value;
  let revenueDateValue = document.getElementById("revenue").value;

  if (formMovie.title == null || formMovie.title == "") {
    document.getElementById("spanTitle").classList.remove("d-none");
    vTitle = false;
  } else {
    document.getElementById("spanTitle").classList.add("d-none");
  }
  if (formMovie.poster == null || formMovie.poster == "") {
    document.getElementById("spanPoste").classList.remove("d-none");
    vPoster = false;
  } else {
    document.getElementById("spanPoste").classList.add("d-none");
  }

  if (formMovie.backdrop == null || formMovie.backdrop == "") {
    document.getElementById("spanBackd").classList.remove("d-none");
    vBackdrop = false;
  } else {
    document.getElementById("spanBackd").classList.add("d-none");
  }
  if (!isNaN(releaseDateValue)) {
    document.getElementById("spanRelea").classList.remove("d-none");
    vRelease = false;
  } else {
    document.getElementById("spanRelea").classList.add("d-none");
  }
  if (!isNaN(runtimeDateValue)) {
    document.getElementById("spanRunti").classList.remove("d-none");
    vRuntime = false;
  }
  if (runtimeDateValue > 0) {
    document.getElementById("spanRunti").classList.add("d-none");
    vRuntime = true;
  }

  if (formMovie.overview == null || formMovie.overview == "") {
    document.getElementById("spanOverv").classList.remove("d-none");
    vOverview = false;
  } else {
    document.getElementById("spanOverv").classList.add("d-none");
  }

  if (formMovie.status == null || formMovie.status == "") {
    document.getElementById("spanStatu").classList.remove("d-none");
    vStatus = false;
  } else {
    document.getElementById("spanStatu").classList.add("d-none");
  }

  if (!isNaN(budgetDateValue)) {
    document.getElementById("spanBudge").classList.remove("d-none");
    vBudget = false;
  }
  if (budgetDateValue > 0) {
    document.getElementById("spanBudge").classList.add("d-none");
    vBudget = true;
  }

  if (formMovie.language == null || formMovie.language == "") {
    document.getElementById("spanLangu").classList.remove("d-none");
    vLanguage = false;
  } else {
    document.getElementById("spanLangu").classList.add("d-none");
  }

  if (!isNaN(revenueDateValue)) {
    document.getElementById("spanReven").classList.remove("d-none");
    vRevenue = false;
  }
  if (revenueDateValue > 0) {
    document.getElementById("spanReven").classList.add("d-none");
    vRevenue = true;
  }

  return (
    vTitle &&
    vPoster &&
    vBackdrop &&
    vRelease &&
    vRuntime &&
    vOverview &&
    vStatus &&
    vBudget &&
    vLanguage &&
    vRevenue
  );
}

function altaMovieAPI(movie) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movie),
  };

  fetch("http://localhost:8080/webapp/createMovie", requestOptions).catch(
    (err) => console.error("Error en la solicitud:", err)
  );
}


function updateMovieAPI(movie){  
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movie),
  };

  fetch("http://localhost:8080/webapp/updateMovie", requestOptions).catch(
    (err) => console.error("Error en la solicitud:", err)
  );
}

function deleteMovieAPI(idMovie){
  const requestOptions = {
    method: "DELETE",
  };

  fetch("http://localhost:8080/webapp/deleteMovie?id="+idMovie, requestOptions).catch(
    (err) => console.error("Error en la solicitud:", err)
  );
}


function selectMovieUpdate(idMovie) {
  localStorage.setItem("idMovieUpdate", idMovie);
  setFormValuesByID(idMovie);  
  abrirModal(2);
}

function selectMovieDelete(idMovie) {
  abrirModal(3);
  localStorage.setItem("idMovieDelete", idMovie);
  setFormValuesByID(idMovie);
}

function readOnlyForm(value) {
  document.getElementById("title").readOnly = value;
  document.getElementById("poster").readOnly = value;
  document.getElementById("backdrop").readOnly = value;
  document.getElementById("release_date").readOnly = value;
  document.getElementById("runtime").readOnly = value;
  document.getElementById("overview").readOnly = value;
  document.getElementById("status").readOnly = value;
  document.getElementById("budget").readOnly = value;
  document.getElementById("revenue").readOnly = value;
  document.getElementById("language").readOnly = value;
}

function setFormValuesByID(idMovie) {
  let movie = getMovieByID(idMovie);
  let formGroup = {
    title: movie.title,
    poster: movie.poster,
    backdrop: movie.backdrop,
    release_date: movie.release_date,
    runtime: movie.runtime,
    overview: movie.overview,
    status: movie.status,
    budget: movie.budget,
    revenue: movie.revenue,
    language: movie.language,
  };

  document.getElementById("title").value = formGroup.title;
  document.getElementById("poster").value = formGroup.poster;
  document.getElementById("backdrop").value = formGroup.backdrop;
  document.getElementById("release_date").value = transformDate(
    formGroup.release_date
  );
  document.getElementById("runtime").value = formGroup.runtime;
  document.getElementById("overview").value = formGroup.overview;
  document.getElementById("status").value = formGroup.status;
  document.getElementById("budget").value = formGroup.budget;
  document.getElementById("revenue").value = formGroup.revenue;
  document.getElementById("language").value = formGroup.language;
  // SIGO POR ACÁ update
}

function getMovieByID(idMovie) {
  let movie;

  listMovies.forEach((m) => {
    if (m.id == idMovie) {
      movie = m;
    }
  });

  return movie;
}

function transformDate(date) {
  let releaseDate = new Date(date);
  let year = releaseDate.getFullYear();
  let month = ("0" + (releaseDate.getMonth() + 1)).slice(-2);
  let day = ("0" + releaseDate.getDate()).slice(-2);

  return `${year}-${month}-${day}`;
}

function abrirModal(idTitle) {
  sacarBgHeaderModal();
  readOnlyForm(false);
  let formMovie = document.getElementById("formMovie");
  let formTitle = document.getElementById("exampleModalCenterTitle");
  let btnAdd = document.getElementById("btnAdd");
  let btnUpdate = document.getElementById("btnUpdate");
  let btnDelete = document.getElementById("btnDelete");
  let headerModal = document.getElementById("headerModal");
  switch (idTitle) {
    case 1:
      formTitle.textContent = "Alta de Movie";
      btnAdd.classList.remove("d-none");
      btnUpdate.classList.add("d-none");
      btnDelete.classList.add("d-none");
      headerModal.classList.add("bg-success");
      formMovie.reset();
      break;
    case 2:
      formTitle.textContent = "Modificacion de Movie";
      btnAdd.classList.add("d-none");
      btnUpdate.classList.remove("d-none");
      btnDelete.classList.add("d-none");
      headerModal.classList.add("bg-warning");
      break;
    case 3:
      formTitle.textContent = "Eliminacion de Movie";
      btnAdd.classList.add("d-none");
      btnUpdate.classList.add("d-none");
      btnDelete.classList.remove("d-none");
      headerModal.classList.add("bg-danger");
      readOnlyForm(true);
      break;
  }

  var myModal = new bootstrap.Modal(
    document.getElementById("exampleModalCenter")
  );

  myModal.show();
}

function cerrarModal() {
  var myModalEl = document.getElementById("exampleModalCenter");
  var modal = bootstrap.Modal.getInstance(myModalEl);

  modal.hide();
}

function sacarBgHeaderModal() {
  let headerModal = document.getElementById("headerModal");

  if (headerModal.classList.contains("bg-warning")) {
    headerModal.classList.remove("bg-warning");
  }

  if (headerModal.classList.contains("bg-danger")) {
    headerModal.classList.remove("bg-danger");
  }

  if (headerModal.classList.contains("bg-success")) {
    headerModal.classList.remove("bg-success");
  }
}

function updateMovie() {
  console.log("Modifico Movie");
  crudMovie("update");
}

function deleteMovie() {
  console.log("Elimino Movie");
  crudMovie("delete");
}

function crudMovie(action) {
  if (action == "create" || action == "update") {
    let formGroup = {
      title: document.getElementById("title").value,
      poster: document.getElementById("poster").value,
      backdrop: document.getElementById("backdrop").value,
      release_date: new Date(
        document.getElementById("release_date").value
      ).getTime(),
      runtime: parseInt(document.getElementById("runtime").value),
      overview: document.getElementById("overview").value,
      status: document.getElementById("status").value,
      budget: parseInt(document.getElementById("budget").value),
      revenue: parseInt(document.getElementById("revenue").value),
      language: document.getElementById("language").value,
    };

    if (validarFormData(formGroup)) {
      switch (action) {
        case "create":
          altaMovieAPI(formGroup);
          break;
        case "update":
          formGroup.id = localStorage.getItem("idMovieUpdate");
          updateMovieAPI(formGroup);
          break;
      }
    }
  } else {
    if (action == "delete") {
      deleteMovieAPI(localStorage.getItem("idMovieDelete"));
    }
  }

  setTimeout(() => {
    drawTableMovies();
    cerrarModal();
  }, 1000);
}


navbar();
