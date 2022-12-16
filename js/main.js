const GET = async (BASE_URL) => {
  const res = await fetch(BASE_URL);
  return await res.json();
};

const c = (nome) => {
  return document.createElement(nome);
};

const $ = (nome) => {
  return document.getElementById(nome);
};

const cards_width_percentage = window.innerWidth <= 480 ? 60 : 17.9;

let cities = [];
let filter = "all";

const fr_destEl = $("fr_dest");
const it_destEl = $("it_dest");
const pt_destEl = $("pt_dest");
const es_destEl = $("es_dest");
const gr_destEl = $("gr_dest");
const de_destEl = $("de_dest");

const filterEl = $("filter");
const filterTextEl = $("filter_text");
const dropbarEl = $("dropdown");

const filter_cityEl = $("filter_city");
const filter_descriptionEl = $("filter_description");
const filter_allEl = $("filter_all");

const resultMain_container = $("result_main_container");
const result_container = $("result_container");
const res_title = $("res_title");

const search_barEl = $("searchbar");
const search_btnEl = $("search-btn");

const sign_btn = $("sign-btn");

const fwd_btns = document.getElementsByClassName("fwd-btn");
const bck_btns = document.getElementsByClassName("bck-btn");

/**
 * Al caricamento del DOM richiama la fetch
 */
window.onload = GET("https://api.musement.com/api/v3/cities.json").then(
  (res) => {
    cities = res.filter(
      (city) =>
        city.country.iso_code == "FR" ||
        city.country.iso_code == "IT" ||
        city.country.iso_code == "PT" ||
        city.country.iso_code == "ES" ||
        city.country.iso_code == "GR" ||
        city.country.iso_code == "DE"
    );
    onDataLoaded();
  }
);

/**
 * Viene richiamata quando tutti i dati dell'api vengono fetchati e caricato nell'array cities
 */
const onDataLoaded = () => {
  populateCards();
  renderForwardBackButtons();
  $("loader").classList = "inactive";
};

/**
 * Crea una card nel DOM contenente i dati dell'istanza city
 * @param {*} city Istanza di city
 * @param {*} container Elemento DOM in cui appendere la card
 */
const createCard = (city, container) => {
  const cardEl = c("div");
  const imgEl = c("img");
  const textEl = c("div");
  const cityNameEl = c("h3");
  const cityDesc = c("p");
  const topEl = c("img");

  cardEl.classList.add("card");
  imgEl.classList.add("city_bg");
  textEl.classList.add("card_text");
  cityNameEl.classList.add(city.country.iso_code + "_h3_color");
  topEl.classList.add("top");

  imgEl.setAttribute("src", city.cover_image_url);
  cityDesc.textContent = city.content.substr(0, 90) + "...";
  cityNameEl.textContent = city.name;
  topEl.setAttribute("src", "./img/top.png");

  textEl.append(cityNameEl, cityDesc);
  cardEl.append(imgEl, textEl);
  if (city.top) cardEl.append(topEl);
  container.append(cardEl);
};

/**
 * Esegue il toggle sulla classe inactive dell'elemento filter
 */
filterEl.addEventListener("click", (e) => {
  dropbarEl.classList.toggle("inactive");
});

/**
 * Nasconde la dropbar del filter quando si clicca su un qualunque elemento del DOM eccetto per il filter
 */
window.addEventListener("click", (e) => {
  if (
    e.target != filterEl &&
    e.target != filterTextEl &&
    !dropbarEl.classList.contains("inactive")
  ) {
    dropbarEl.classList.add("inactive");
  }
});

/**
 * Imposta il filtro su city
 */
filter_cityEl.addEventListener("click", (e) => {
  filterTextEl.textContent = filter_cityEl.textContent;
  filter = "city";
});

/**
 * Imposta il filtro su desc
 */
filter_descriptionEl.addEventListener("click", (e) => {
  filterTextEl.textContent = filter_descriptionEl.textContent;
  filter = "desc";
});

/**
 * Imposta il filtro su all
 */
filter_allEl.addEventListener("click", (e) => {
  filterTextEl.textContent = filter_allEl.textContent;
  filter = "all";
});

/**
 * Esegue la ricerca degli elementi city in base al filtro selezionato e ne genera le card
 */
search_btnEl.addEventListener("click", (e) => {
  e.preventDefault();
  if (search_barEl.value == "") return;
  result_container.textContent = "";
  if (filter == "city") {
    let i = 0;
    resultMain_container.style.display = "block";
    cities.forEach((city) => {
      if (city.name.toLowerCase().includes(search_barEl.value.toLowerCase())) {
        createCard(city, result_container);
        i++;
      }
    });
    if (i == 0)
      res_title.textContent =
        "Spiacenti la tua ricerca non ha prodotto risultati :(";
    else res_title.textContent = "Risultati della tua ricerca";
  }
  if (filter == "desc") {
    let i = 0;
    resultMain_container.style.display = "block";
    cities.forEach((city) => {
      if (
        city.content.toLowerCase().includes(search_barEl.value.toLowerCase())
      ) {
        createCard(city, result_container);
        i++;
      }
    });
    if (i == 0)
      res_title.textContent =
        "Spiacenti la tua ricerca non ha prodotto risultati :(";
    else res_title.textContent = "Risultati della tua ricerca";
  }

  if (filter == "all") {
    let i = 0;
    resultMain_container.style.display = "block";
    cities.forEach((city) => {
      if (
        city.name.toLowerCase().includes(search_barEl.value.toLowerCase()) ||
        city.content.toLowerCase().includes(search_barEl.value.toLowerCase())
      ) {
        createCard(city, result_container);
        i++;
      }
    });
    if (i == 0)
      res_title.textContent =
        "Spiacenti la tua ricerca non ha prodotto risultati :(";
    else res_title.textContent = "Risultati della tua ricerca";
  }
  result_container.scrollIntoView({
    behavior: "smooth",
  });
});

/**
 * Al click dell'elemento Sign mostra l'elemento modal e nasconde l'overflow del body
 */
sign_btn.addEventListener("click", (e) => {
  $("modal").style.display = "flex";
  document.body.style.overflow = "hidden";
});

/**
 * Al click dell'elemento modal ne nasconde la visualizzazione e imposta l'overflow del body su scroll
 */
$("modal").addEventListener("click", (e) => {
  if (e.target == $("modal")) {
    $("modal").style.display = "none";
    document.body.style.overflow = "scroll";
  }
});

$("close_modal-btn").addEventListener("click", (e) => {
  $("modal").style.display = "none";
  document.body.style.overflow = "scroll";
});

/**
 * Popola ogni container delle nazioni con le proprie card
 */
const populateCards = () => {
  cities.forEach((city) => {
    if (city.country.iso_code == "FR") createCard(city, fr_destEl);
    if (city.country.iso_code == "IT") createCard(city, it_destEl);
    if (city.country.iso_code == "PT") createCard(city, pt_destEl);
    if (city.country.iso_code == "ES") createCard(city, es_destEl);
    if (city.country.iso_code == "GR") createCard(city, gr_destEl);
    if (city.country.iso_code == "DE") createCard(city, de_destEl);
  });
};

/**
 * Genera i bottoni forward e back per ciascuna sezione il cui overflow supera il client_width
 */
const renderForwardBackButtons = () => {
  for (let btn of fwd_btns) {
    if (
      $(btn.id.split("-")[0]).clientWidth >= $(btn.id.split("-")[0]).scrollWidth
    ) {
      console.log(
        $(btn.id.split("-")[0]).previousElementSibling.lastElementChild
      );
      $(
        btn.id.split("-")[0]
      ).previousElementSibling.lastElementChild.style.display = "none";
      continue;
    }
    btn.addEventListener("click", (e) => {
      $(btn.id.split("-")[0]).scrollBy({
        top: 0,
        left: (window.innerWidth * cards_width_percentage) / 100,
        behavior: "smooth",
      });
    });
  }
  for (let btn of bck_btns) {
    btn.addEventListener("click", (e) => {
      $(btn.id.split("-")[0]).scrollBy({
        top: 0,
        left: -(window.innerWidth * cards_width_percentage) / 100,
        behavior: "smooth",
      });
    });
  }
};
