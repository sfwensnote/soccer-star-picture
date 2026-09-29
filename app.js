(() => {
  const { axes, questions, players } = window.SOCCER_DATA;
  const screens = {
    home: document.getElementById("screen-home"),
    quiz: document.getElementById("screen-quiz"),
    result: document.getElementById("screen-result")
  };
  const $ = (id) => document.getElementById(id);
  const state = { screen: "home", current: 0, answers: Array(questions.length).fill(null), selected: null };
  const axisById = Object.fromEntries(axes.map((axis) => [axis.id, axis]));
  let toastTimeout;

  function showScreen(name) {
    Object.entries(screens).forEach(([key, element]) => { element.hidden = key !== name; });
    state.screen = name;
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    const heading = name === "home" ? $("home-title") : name === "quiz" ? $("question-title") : $("result-title");
    if (heading) heading.focus({ preventScroll: true });
  }

  function renderQuestion() {
    const question = questions[state.current];
    const axis = axisById[question.axis];
    const questionNumber = String(state.current + 1).padStart(2, "0");
    $("question-count").textContent = `${questionNumber} / ${String(questions.length).padStart(2, "0")}`;
    $("large-question-number").textContent = questionNumber;
    $("axis-label").textContent = `${axis.name} · ${axis.low} → ${axis.high}`;
    $("question-kicker").textContent = question.kicker;
    $("question-title").textContent = question.title;
    $("question-prompt").textContent = question.prompt;
    $("progress-fill").style.width = `${((state.current + 1) / questions.length) * 100}%`;
    document.querySelector(".progress-track").setAttribute("aria-valuenow", String(state.current + 1));
    const grid = $("answer-grid");
    grid.replaceChildren();
    question.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-card";
      button.setAttribute("aria-pressed", String(state.selected === index));
      button.innerHTML = `<span class="answer-index">${String.fromCharCode(65 + index)}</span><span class="answer-text"></span><span class="answer-check" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="m4 10 4 4 8-8"/></svg></span>`;
      button.querySelector(".answer-text").textContent = answer;
      button.addEventListener("click", () => {
        state.selected = index;
        [...grid.children].forEach((card, cardIndex) => card.setAttribute("aria-pressed", String(cardIndex === index)));
        const next = $("next-question");
        next.disabled = false;
        next.querySelector("span").textContent = state.current === questions.length - 1 ? "查看我的结果" : "下一题";
      });
      grid.append(button);
    });
    $("previous-question").disabled = state.current === 0;
    $("next-question").disabled = state.selected === null;
    $("next-question").querySelector("span").textContent = state.selected === null ? "选一个做法" : state.current === questions.length - 1 ? "查看我的结果" : "下一题";
  }

  function getUserProfile() {
    const sums = Object.fromEntries(axes.map((axis) => [axis.id, 0]));
    questions.forEach((question, index) => {
      const answerIndex = state.answers[index];
      if (answerIndex !== null) sums[question.axis] += question.values[answerIndex];
    });
    return axes.map((axis) => Math.round(((sums[axis.id] + 4) / 8) * 100));
  }

  function rankPlayers(profile) {
    return players.map((player) => {
      const distance = player.profile.reduce((sum, value, index) => sum + Math.abs(value - profile[index]), 0) / axes.length;
      return { player, match: Math.max(55, Math.min(98, Math.round(100 - distance * 0.58))) };
    }).sort((a, b) => b.match - a.match);
  }

  function commonsImageUrl(file) {
    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1000`;
  }

  function commonsPageUrl(file) {
    return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file).replaceAll("%20", "_")}`;
  }

  function setPlayerImage(player) {
    const image = $("player-image");
    const fallback = $("portrait-fallback");
    const credit = $("portrait-credit");
    const repoImage = `https://raw.githubusercontent.com/sfwensnote/soccer-star-picture/main/players/${player.id}.jpg`;
    image.hidden = true;
    image.alt = `${player.name} 的照片`;
    fallback.hidden = false;
    $("player-initial").textContent = player.name.slice(0, 1);
    image.onload = () => {
      image.hidden = false;
      fallback.hidden = true;
      credit.innerHTML = `<a href="https://github.com/sfwensnote/soccer-star-picture/tree/main/players" target="_blank" rel="noreferrer">照片库 · soccer-star-picture</a>`;
    };
    image.onerror = () => {
      if (image.dataset.commonsFallback !== "used") {
        image.dataset.commonsFallback = "used";
        image.src = commonsImageUrl(player.file);
        credit.innerHTML = `<a href="${commonsPageUrl(player.file)}" target="_blank" rel="noreferrer">${player.credit} · 查看图片来源</a>`;
      } else {
        image.hidden = true;
        fallback.hidden = false;
        credit.textContent = "图片载入失败 · 可在 soccer-star-picture 图片库中添加此球星照片";
      }
    };
    image.dataset.commonsFallback = "unused";
    image.src = repoImage;
  }

  function renderResult() {
    const profile = getUserProfile();
    const ranked = rankPlayers(profile);
    const winner = ranked[0];
    const player = winner.player;
    $("result-title").textContent = player.name;
    $("player-name-en").textContent = player.english;
    $("portrait-number").textContent = player.number;
    $("result-category").textContent = player.category;
    $("player-archetype").textContent = player.archetype;
    const distinctive = axes.map((axis, index) => ({ axis, score: profile[index], distance: Math.abs(profile[index] - 50) }))
      .sort((a, b) => b.distance - a.distance)
      .slice(0, 2);
    const pattern = (item) => `${item.axis.name}偏“${item.score >= 50 ? item.axis.high : item.axis.low}”`;
    $("player-description").textContent = `这次你的答案里，${pattern(distinctive[0])}，${pattern(distinctive[1])}。综合六项得分，${player.name}的球员风格和你最接近。`;
    $("match-percent").textContent = `${winner.match}%`;
    $("result-edition").textContent = `日常选择 · 2026`;
    $("match-fill").style.width = `${winner.match}%`;
    $("player-tags").replaceChildren(...distinctive.map(({ axis, score }) => {
      const chip = document.createElement("span");
      chip.textContent = `${axis.name} · ${score >= 50 ? axis.high : axis.low}`;
      return chip;
    }));
    setPlayerImage(player);

    const list = $("traits-list");
    list.replaceChildren(...axes.map((axis, index) => {
      const row = document.createElement("div");
      row.className = "trait-row";
      row.innerHTML = `<div class="trait-label"><span>${axis.name}</span><strong>${profile[index]}<small>%</small></strong></div><div class="trait-track"><span style="width:${profile[index]}%"></span></div><div class="trait-poles"><span>${axis.low}</span><span>${axis.high}</span></div>`;
      row.title = axis.description;
      return row;
    }));

    const runnerUps = $("runner-ups");
    runnerUps.replaceChildren(...ranked.slice(1, 4).map(({ player: candidate, match }, index) => {
      const item = document.createElement("div");
      item.className = "runner-up";
      item.innerHTML = `<span class="runner-number">0${index + 2}</span><span class="runner-initial">${candidate.name.slice(0, 1)}</span><span class="runner-name"></span><span class="runner-percent">${match}%</span>`;
      item.querySelector(".runner-name").textContent = candidate.name;
      return item;
    }));
    showScreen("result");
  }

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimeout);
    toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  function startQuiz() {
    state.current = 0;
    state.selected = null;
    state.answers = Array(questions.length).fill(null);
    renderQuestion();
    showScreen("quiz");
  }

  $("start-quiz").addEventListener("click", startQuiz);
  $("back-home").addEventListener("click", () => showScreen("home"));
  $("quit-quiz").addEventListener("click", () => showScreen("home"));
  $("result-home").addEventListener("click", () => showScreen("home"));
  $("previous-question").addEventListener("click", () => {
    if (state.current === 0) return;
    state.current -= 1;
    state.selected = state.answers[state.current];
    renderQuestion();
    $("question-title").focus({ preventScroll: true });
  });
  $("next-question").addEventListener("click", () => {
    if (state.selected === null) return;
    state.answers[state.current] = state.selected;
    if (state.current === questions.length - 1) {
      renderResult();
      return;
    }
    state.current += 1;
    state.selected = state.answers[state.current];
    renderQuestion();
    $("question-title").focus({ preventScroll: true });
  });
  $("restart-quiz").addEventListener("click", startQuiz);
  $("share-result").addEventListener("click", async () => {
    const name = $("result-title").textContent;
    const text = `这次测试，我的结果更像${name}。你像哪位足球明星？`;
    const shareData = { title: "你是哪位足球明星？", text, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        showToast("结果文案已复制，可以去分享了。");
      } else {
        showToast(text);
      }
    } catch (error) {
      if (error.name !== "AbortError") showToast("分享没有完成，请稍后再试。");
    }
  });

  showScreen("home");
})();
