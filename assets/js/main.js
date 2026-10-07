/*
 * 2026 산림레포츠 축제 OL 대회 — 프론트엔드 로직
 * ─────────────────────────────────────────────
 * 데이터는 config.js(window.OL). 이 파일은 렌더링과 상호작용만 담당합니다.
 * 모든 DOM 조회는 없을 수도 있다고 가정하고 방어적으로 작성했습니다.
 */
(function () {
  "use strict";

  var OL = window.OL || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.addEventListener("DOMContentLoaded", function () {
    initEducationLink();
    initKakaoMapLink();
    initCountdown();
    renderFlow();
    initStartList();
    initSurveyLink();
    initResults();
    renderClassList();
    renderAwards();
    renderBooths();
    initFaq();
    initModals();
    initMobileNav();
    initSmoothScroll();
    initScrollSpy();
  });

  /* ---------- 오리엔티어링 기초 교육 영상 링크 ---------- */
  function initEducationLink() {
    var link = document.getElementById("edu-video-link");
    if (!link) return;
    var url = OL.education && OL.education.videoUrl;
    if (url) link.setAttribute("href", url);
    else link.hidden = true;
  }

  /* ---------- 카카오맵 길찾기 링크 ---------- */
  function initKakaoMapLink() {
    var link = document.getElementById("kakao-map-link");
    var t = OL.event && OL.event.transit;
    if (!link || !t) return;
    if (t.kakaoMapUrl) {
      link.setAttribute("href", t.kakaoMapUrl);
    } else if (t.kakaoMapQuery) {
      link.setAttribute(
        "href",
        "https://map.kakao.com/link/search/" + encodeURIComponent(t.kakaoMapQuery)
      );
    }
  }

  /* ---------- 만족도 조사 링크 ---------- */
  function initSurveyLink() {
    var link = document.getElementById("survey-link");
    var url = OL.survey && OL.survey.url;
    if (!link || !url) return;
    link.setAttribute("href", url);
    link.hidden = false;
  }

  /* ---------- 오리엔티어링 경기 출발 리스트 ---------- */
  function initStartList() {
    var s = OL.startList || {};
    var statusEl = document.getElementById("startlist-status");
    var descEl = document.getElementById("startlist-desc");
    if (!s.url || !statusEl || !descEl) return;

    statusEl.textContent = "공개";
    statusEl.classList.add("notice-card__status--live");
    descEl.innerHTML =
      (s.note ? s.note + " " : "") +
      '<a href="' + s.url + '" target="_blank" rel="noopener noreferrer"><strong>출발 리스트 보기 →</strong></a>';
  }

  /* ---------- 대회 실시간 기록 ---------- */
  function initResults() {
    var r = OL.results || {};
    var status = r.status || "before";
    var live = (status === "live" || status === "final") && !!r.url;
    var isFinal = status === "final";

    var statusEl = document.getElementById("results-status");
    var descEl = document.getElementById("results-desc");
    var card = document.getElementById("results-card");
    var heroLink = document.getElementById("results-hero-link");

    if (!live) {
      // 대회 전 — 진행 안내 카드에 안내 문구만
      if (statusEl) statusEl.textContent = (r.openLabel || "대회 당일") + " 공개";
      if (heroLink) heroLink.hidden = true;
      return;
    }

    var linkText = isFinal ? "최종 결과 보기 →" : "실시간 순위 보기 →";
    if (statusEl) {
      statusEl.textContent = isFinal ? "최종 결과 공개" : "실시간 공개 중";
      statusEl.classList.add("notice-card__status--live");
    }
    if (descEl) {
      descEl.innerHTML =
        (isFinal
          ? "클래스별 최종 순위를 확인하세요. "
          : "SI카드 리딩 결과가 실시간 반영됩니다. ") +
        '<a href="' + r.url + '" target="_blank" rel="noopener noreferrer"><strong>' + linkText + "</strong></a>";
    }
    if (card) card.classList.add("notice-card--accent");

    if (heroLink) {
      heroLink.href = r.url;
      heroLink.textContent = isFinal ? "🏆 최종 결과 보기" : "🔴 실시간 순위 보기";
      heroLink.hidden = false;
    }
  }

  /* ---------- 당일 동선 (행사 당일에는 현재 단계 강조) ---------- */
  function renderFlow() {
    var list = document.getElementById("flow");
    if (!list || !OL.flow || !OL.event) return;

    var day = String(OL.event.dateISO).slice(0, 10);
    var at = function (hhmm) { return new Date(day + "T" + hhmm + ":00+09:00").getTime(); };

    list.innerHTML = OL.flow.map(function (s, i) {
      return (
        '<li class="flow__step" data-state="upcoming">' +
          '<div class="flow__head">' +
            '<span class="flow__num" aria-hidden="true">' + (i + 1) + "</span>" +
            '<span class="flow__time">' + s.time + "</span>" +
            '<span class="flow__now" hidden>지금 진행 중</span>' +
          "</div>" +
          '<h3 class="flow__title">' + s.title + "</h3>" +
          '<p class="flow__place"><span aria-hidden="true">📍</span> ' + s.place + "</p>" +
          '<p class="flow__desc">' + s.desc + "</p>" +
        "</li>"
      );
    }).join("");

    var items = $$(".flow__step", list);
    function update() {
      var now = Date.now();
      OL.flow.forEach(function (s, i) {
        var state = now < at(s.start) ? "upcoming" : now < at(s.end) ? "active" : "past";
        items[i].setAttribute("data-state", state);
        var badge = $(".flow__now", items[i]);
        if (badge) badge.hidden = state !== "active";
      });
    }
    update();
    setInterval(update, 60000);
  }

  /* ---------- 1. 카운트다운 ---------- */
  function initCountdown() {
    var root = document.getElementById("countdown");
    if (!root || !OL.event) return;

    var target = new Date(OL.event.dateISO).getTime();
    if (isNaN(target)) return;

    var slots = {
      days: document.getElementById("cd-days"),
      hours: document.getElementById("cd-hours"),
      minutes: document.getElementById("cd-minutes"),
      seconds: document.getElementById("cd-seconds"),
    };
    var pad = function (n) { return n < 10 ? "0" + n : String(n); };

    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        root.innerHTML = '<p class="countdown__done">대회가 시작되었습니다!</p>';
        clearInterval(timer);
        return;
      }
      var d = Math.floor(diff / 86400000);
      var h = Math.floor((diff % 86400000) / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      if (slots.days) slots.days.textContent = pad(d);
      if (slots.hours) slots.hours.textContent = pad(h);
      if (slots.minutes) slots.minutes.textContent = pad(m);
      if (slots.seconds) slots.seconds.textContent = pad(s);
      root.setAttribute("aria-label", "대회까지 " + d + "일 " + h + "시간 " + m + "분 남음");
    }

    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ---------- 2. 클래스 목록 ---------- */
  function catBadgeClass(cat) {
    if (cat === "가족") return "badge--amber";
    if (cat === "청소년") return "badge--emerald";
    return "badge--blue";
  }

  function typeBadgeClass(type) {
    return (type || "").indexOf("스코어") !== -1 ? "badge--score" : "badge--point";
  }

  function renderClassList() {
    var container = document.getElementById("class-list");
    if (!container || !OL.classes) return;

    container.innerHTML = OL.classes.map(function (c) {
      // 대상 문구 끝의 '(2인 1팀)' 같은 괄호 부분은 다음 줄로
      var m = String(c.target).match(/^(.*?)\s*(\([^)]*\))\s*$/);
      var targetHtml = m
        ? m[1] + '<span class="class-item__fmt">' + m[2] + "</span>"
        : c.target;
      return (
        '<button type="button" class="class-item" data-action="class-detail" data-id="' + c.id + '">' +
          '<span class="class-item__top">' +
            '<span class="badge ' + catBadgeClass(c.cat) + '">' + c.cat + "</span>" +
            '<span class="badge badge--method ' + typeBadgeClass(c.type) + '">' + c.type + "</span>" +
          "</span>" +
          "<h5>" + c.name + "</h5>" +
          "<p>" + targetHtml + "</p>" +
        "</button>"
      );
    }).join("");
  }

  function classById(id) {
    return (OL.classes || []).filter(function (c) { return c.id === id; })[0] || null;
  }

  function openClassDetail(id) {
    var c = classById(id);
    var modal = document.getElementById("class-modal");
    if (!c || !modal) return;

    var set = function (sel, text) { var el = $(sel, modal); if (el) el.textContent = text; };
    set("[data-field=name]", c.name + " 클래스");
    set("[data-field=cat]", c.cat);
    set("[data-field=type]", c.type);
    set("[data-field=target]", c.target);
    set("[data-field=desc]", c.desc);

    openModal(modal);
  }

  /* ---------- 4. 시상 내역 (1·2·3위 카드) ---------- */
  function renderAwards() {
    if (!OL.awards) return;

    var prizeGrid = document.getElementById("prize-grid");
    if (prizeGrid) {
      prizeGrid.innerHTML = OL.awards.map(function (a) {
        return (
          '<div class="prize">' +
            '<div class="prize__medal" aria-hidden="true">' + a.medal + "</div>" +
            '<div class="prize__name">' + a.prize + "</div>" +
            '<div class="prize__note">' + a.note + " · 총 " + a.teams + "팀 시상</div>" +
          "</div>"
        );
      }).join("");
    }
  }

  /* ---------- 5. 체험교육부스 카드 ---------- */
  function renderBooths() {
    var grid = document.getElementById("booth-grid");
    if (!grid || !OL.booths) return;

    grid.innerHTML = OL.booths.map(function (b) {
      return (
        '<div class="booth"><div>' +
          '<div class="booth__top">' +
            '<span class="booth__icon" aria-hidden="true">' + b.icon + "</span>" +
            '<span class="badge badge--forest">' + b.tag + "</span>" +
          "</div>" +
          "<h3>" + b.title + "</h3>" +
          "<p>" + b.desc + "</p>" +
        "</div></div>"
      );
    }).join("");
  }

  /* ---------- 7. FAQ 아코디언 + 검색 ---------- */
  function initFaq() {
    var list = document.getElementById("faq-list");
    var search = document.getElementById("faq-search");
    if (!list) return;

    var items = $$(".faq-item", list);
    var empty = document.getElementById("faq-empty");

    list.addEventListener("click", function (e) {
      var q = e.target.closest(".faq-item__q");
      if (!q) return;
      var expanded = q.getAttribute("aria-expanded") === "true";
      // 하나만 열림
      items.forEach(function (item) {
        var btn = $(".faq-item__q", item);
        var ans = $(".faq-item__a", item);
        if (btn) btn.setAttribute("aria-expanded", "false");
        if (ans) ans.hidden = true;
      });
      if (!expanded) {
        q.setAttribute("aria-expanded", "true");
        var ans = q.nextElementSibling;
        if (ans) ans.hidden = false;
      }
    });

    if (search) {
      search.addEventListener("input", function () {
        var query = search.value.trim().toLowerCase();
        var visible = 0;
        items.forEach(function (item) {
          var match = !query || item.textContent.toLowerCase().indexOf(query) !== -1;
          item.hidden = !match;
          if (match) visible++;
          // 검색어가 있으면 매칭 항목을 펼쳐서 바로 보이게
          var btn = $(".faq-item__q", item);
          var ans = $(".faq-item__a", item);
          if (query && match) {
            if (btn) btn.setAttribute("aria-expanded", "true");
            if (ans) ans.hidden = false;
          } else if (query) {
            if (btn) btn.setAttribute("aria-expanded", "false");
            if (ans) ans.hidden = true;
          }
        });
        if (empty) empty.hidden = visible !== 0;
      });
    }
  }

  /* ---------- 8. 모달 (공통) ---------- */
  var lastFocused = null;

  function openModal(modal) {
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    var focusable = getFocusable(modal);
    (focusable[0] || modal).focus();
    document.addEventListener("keydown", onModalKeydown);
    modal.__onKeydown = onModalKeydown;

    function onModalKeydown(e) {
      if (e.key === "Escape") { closeModal(modal); return; }
      if (e.key !== "Tab") return;
      var f = getFocusable(modal);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function closeModal(modal) {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (modal.__onKeydown) document.removeEventListener("keydown", modal.__onKeydown);
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  }

  function getFocusable(root) {
    return $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])', root)
      .filter(function (el) { return el.offsetParent !== null; });
  }

  function initModals() {
    // 열기 트리거
    document.addEventListener("click", function (e) {
      var opener = e.target.closest("[data-modal-open]");
      if (opener) {
        var m = document.getElementById(opener.getAttribute("data-modal-open"));
        if (m) { e.preventDefault(); openModal(m); }
        return;
      }
      var detail = e.target.closest('[data-action="class-detail"]');
      if (detail) { openClassDetail(detail.getAttribute("data-id")); return; }
    });

    // 닫기 (닫기 버튼 / 배경)
    $$(".modal").forEach(function (modal) {
      modal.addEventListener("click", function (e) {
        if (e.target === modal || e.target.closest("[data-modal-close]")) closeModal(modal);
      });
    });
  }

  /* ---------- 9. 모바일 네비 ---------- */
  function initMobileNav() {
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;

    var mq = window.matchMedia("(max-width: 980px)");
    var setHidden = function (hidden) {
      if (mq.matches) nav.hidden = hidden;
      else nav.hidden = false;
      toggle.setAttribute("aria-expanded", String(!hidden && mq.matches));
    };
    setHidden(true);

    toggle.addEventListener("click", function () {
      setHidden(!nav.hidden);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a") && mq.matches) setHidden(true);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mq.matches && !nav.hidden) { setHidden(true); toggle.focus(); }
    });
    mq.addEventListener("change", function () { setHidden(true); });
  }

  /* ---------- 10. 부드러운 앵커 스크롤 ---------- */
  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var id = link.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });

      // 클릭 즉시 해당 네비 항목 강조 (스크롤 완료 전이라도)
      if (link.closest("#primary-nav")) {
        $$("#primary-nav a").forEach(function (a) { a.classList.remove("is-active"); });
        link.classList.add("is-active");
      }
    });
  }

  /* ---------- 11. 현재 섹션 네비 강조 (스크롤스파이) ---------- */
  function initScrollSpy() {
    var nav = document.getElementById("primary-nav");
    if (!nav || !("IntersectionObserver" in window)) return;

    var byId = {};
    $$('a[href^="#"]', nav).forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      if (document.getElementById(id)) byId[id] = a;
    });

    function setActive(id) {
      $$("#primary-nav a").forEach(function (a) { a.classList.remove("is-active"); });
      if (byId[id]) byId[id].classList.add("is-active");
    }

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    Object.keys(byId).forEach(function (id) {
      obs.observe(document.getElementById(id));
    });
  }
})();
