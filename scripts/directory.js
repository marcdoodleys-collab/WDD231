// directory.js — logique de la page annuaire (Chamber of Commerce)

const directoryContainer = document.querySelector("#directory");
const gridViewBtn = document.querySelector("#gridViewBtn");
const listViewBtn = document.querySelector("#listViewBtn");
const hamburgerBtn = document.querySelector("#hamburger");
const primaryNav = document.querySelector("#primaryNav");

// Correspondance entre le niveau numérique et son libellé affiché
const levelLabels = {
  1: "Membre",
  2: "Argent",
  3: "Or",
};

// ---------- Récupération des données (fetch + async/await) ----------

async function getMembers() {
  try {
    const response = await fetch("data/members.json");

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();
    displayMembers(data.members);
  } catch (error) {
    directoryContainer.innerHTML = `<p class="loading-message">Impossible de charger les membres pour le moment.</p>`;
    console.error("Erreur lors du chargement de members.json :", error);
  }
}

// ---------- Construction d'une carte membre ----------

function createMemberCard(member) {
  const card = document.createElement("section");
  card.classList.add("member-card", `level-${member.membershipLevel}`);

  card.innerHTML = `
    <div class="member-card-header">
      <img src="images/${member.image}" alt="Logo de ${member.name}" class="member-logo" loading="lazy" />
      <div>
        <h2>${member.name}</h2>
        <p class="member-sector">${member.sector}</p>
      </div>
    </div>
    <div class="member-card-body">
      <span class="member-badge level-${member.membershipLevel}">${levelLabels[member.membershipLevel]}</span>
      <p>${member.description}</p>
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <a class="member-website" href="${member.website}" target="_blank" rel="noopener">${member.website}</a>
    </div>
  `;

  return card;
}

// ---------- Affichage de la liste complète des membres ----------

function displayMembers(members) {
  directoryContainer.innerHTML = "";

  members.forEach((member) => {
    const card = createMemberCard(member);
    directoryContainer.appendChild(card);
  });
}

// ---------- Toggle vue grille / vue liste ----------

function setGridView() {
  directoryContainer.classList.remove("list-view");
  gridViewBtn.classList.add("active");
  gridViewBtn.setAttribute("aria-pressed", "true");
  listViewBtn.classList.remove("active");
  listViewBtn.setAttribute("aria-pressed", "false");
}

function setListView() {
  directoryContainer.classList.add("list-view");
  listViewBtn.classList.add("active");
  listViewBtn.setAttribute("aria-pressed", "true");
  gridViewBtn.classList.remove("active");
  gridViewBtn.setAttribute("aria-pressed", "false");
}

gridViewBtn.addEventListener("click", setGridView);
listViewBtn.addEventListener("click", setListView);

// ---------- Menu hamburger (petits écrans) ----------

hamburgerBtn.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  hamburgerBtn.classList.toggle("open", isOpen);
  hamburgerBtn.setAttribute("aria-expanded", isOpen);
});

// ---------- Footer : date de dernière modification + année ----------

document.querySelector("#copyrightYear").textContent = new Date().getFullYear();

document.querySelector("#lastModified").textContent =
  `Dernière modification : ${document.lastModified}`;

// ---------- Lancement ----------

getMembers();