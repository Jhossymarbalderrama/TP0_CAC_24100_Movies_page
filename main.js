var nroPage = 1;

function nextPage(value) {

  if (nroPage >= 1 && nroPage <= 3) {
    if (value == 1) {
      nroPage++;
    } else if (value == 0) {
      nroPage--;
    }
    elementView(nroPage);
  }
}

function elementView(page) {
  resetPage();

  switch (page) {
    case 1:
      pageView("page-1");
      break;
    case 2:
      pageView("page-2");
      break;
    case 3:
      pageView("page-3");
      break;

    default:
        nroPage = 1;
        pageView("page-1");
        break;
  }
}

function resetPage() {
  document.getElementById("page-1").classList.add("visually-hidden");
  document.getElementById("page-2").classList.add("visually-hidden");
  document.getElementById("page-3").classList.add("visually-hidden");
}

function pageView(page) {
  document.getElementById(page).classList.remove("visually-hidden");
}
