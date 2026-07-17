// 画面制御 ------------------------------------------------------------
// state: { screen: 'entrance' | 'genre' | 'recipe', genreId, recipeId }

const app = document.getElementById("app");

function parseHash() {
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  if (parts.length === 0) return { screen: "entrance" };
  if (parts.length === 1) return { screen: "genre", genreId: parts[0] };
  return { screen: "recipe", genreId: parts[0], recipeId: parts[1] };
}

function navigate(hash) {
  location.hash = hash;
}

function findGenre(id) {
  return GENRES.find((g) => g.id === id);
}
function findRecipe(genre, id) {
  return genre.recipes.find((r) => r.id === id);
}

function render() {
  const state = parseHash();
  if (state.screen === "entrance") return renderEntrance();
  const genre = findGenre(state.genreId);
  if (!genre) return renderEntrance();
  if (state.screen === "genre") return renderGenre(genre);
  const recipe = findRecipe(genre, state.recipeId);
  if (!recipe) return renderGenre(genre);
  return renderRecipe(genre, recipe);
}

function renderEntrance() {
  app.innerHTML = `
    <div class="entrance">
      <div class="entrance-header">
        <div class="entrance-eyebrow">TSUYU-DOKORO</div>
        <h1 class="entrance-title">つゆ処<span>。</span><br>うどん・そうめん だしノート</h1>
        <p class="entrance-tagline">のれんをくぐって、今日の一杯を選んでください</p>
      </div>
      <div class="noren-wrap" role="list">
        ${GENRES.map((g) => `
          <button class="noren" role="listitem" data-genre="${g.id}" style="background:${g.color}">
            <span class="noren-kanji">${g.vertical}</span>
            <span class="noren-count">${g.recipes.length}品</span>
          </button>
        `).join("")}
      </div>
      <div class="noren-rail"></div>
    </div>
    <footer class="app-footer">Recipes crafted by Claude · つゆ処</footer>
  `;
  app.querySelectorAll(".noren").forEach((btn) => {
    btn.addEventListener("click", () => navigate(`#/${btn.dataset.genre}`));
  });
}

function renderGenre(genre) {
  app.innerHTML = `
    <div class="top-bar">
      <button class="back-btn" aria-label="入り口に戻る">←</button>
      <div>
        <h1>${genre.name}</h1>
        <div class="sub">つゆ処</div>
      </div>
    </div>
    <div class="genre-screen">
      <div class="genre-hero" style="background-image: linear-gradient(160deg, rgba(20,10,5,0.25), rgba(20,10,5,0.62)), url('${genre.image}')">
        <div class="kicker">GENRE</div>
        <h2>${genre.name}</h2>
        <p>${genre.lead}</p>
      </div>
      <div class="recipe-list">
        ${genre.recipes.map((r) => `
          <button class="recipe-card" data-recipe="${r.id}">
            <img class="rc-thumb" src="${r.image || genre.image}" alt="${r.title}" loading="lazy">
            <div class="rc-body">
              <div class="rc-title">${r.title}</div>
              <div class="rc-sub">${r.subtitle}</div>
              <div class="rc-meta">
                <span>👥 ${r.servings}</span>
                <span>⏱ ${r.time}</span>
              </div>
            </div>
          </button>
        `).join("")}
      </div>
    </div>
  `;
  app.querySelector(".back-btn").addEventListener("click", () => navigate("#/"));
  app.querySelectorAll(".recipe-card").forEach((btn) => {
    btn.addEventListener("click", () => navigate(`#/${genre.id}/${btn.dataset.recipe}`));
  });
}

function renderRecipe(genre, recipe) {
  app.innerHTML = `
    <div class="top-bar">
      <button class="back-btn" aria-label="一覧に戻る">←</button>
      <div>
        <h1>${recipe.title}</h1>
        <div class="sub">${genre.name}</div>
      </div>
    </div>
    <div class="recipe-screen">
      <div class="recipe-hero" style="background-image: linear-gradient(135deg, rgba(20,10,5,0.25), rgba(20,10,5,0.62)), url('${recipe.image || genre.image}')">
        <div class="kicker">${genre.name.toUpperCase()}</div>
        <h2>${recipe.title}</h2>
        <div class="rh-sub">${recipe.subtitle}</div>
        <div class="rh-meta">
          <span>👥 ${recipe.servings}</span>
          <span>⏱ ${recipe.time}</span>
        </div>
      </div>
      <div class="recipe-body">
        <h3 class="section-title">材料</h3>
        <ul class="ingredient-list">
          ${recipe.ingredients.map((i) => `
            <li><span>${i.name}</span><span class="ing-amount">${i.amount}</span></li>
          `).join("")}
        </ul>
        <h3 class="section-title">作り方</h3>
        <ol class="step-list">
          ${recipe.steps.map((s) => `<li>${s}</li>`).join("")}
        </ol>
        <div class="point-box">
          <span class="point-label">コツ</span>
          <span>${recipe.point}</span>
        </div>
      </div>
    </div>
  `;
  app.querySelector(".back-btn").addEventListener("click", () => navigate(`#/${genre.id}`));
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", render);
render();
