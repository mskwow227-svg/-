/*
 * 2026 산림레포츠 축제 OL 축제 — 프론트엔드 로직
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
    initPrivacyDetails();
    renderRules();
    initNotices();
    renderDayNotice();
    initResults();
    renderClassList();
    renderAwards();
    renderBooths();
    initStartList();
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

  /* ---------- 축제 실시간 기록 ---------- */
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
      // 축제 전 — 진행 안내 카드에 안내 문구만
      if (statusEl) statusEl.textContent = (r.openLabel || "축제 당일") + " 공개";
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

  /* ---------- 공통 안내 문구 ([data-notice="키"] 요소에 config 의 OL.notices 값을 채움) ---------- */
  function initNotices() {
    var n = OL.notices || {};
    $$("[data-notice]").forEach(function (el) {
      var text = n[el.getAttribute("data-notice")];
      if (text) el.textContent = "⚠️ " + text;
    });
  }

  /* ---------- 히어로 '당일 꼭 확인' 안내 (문자 안내와 같은 내용) ---------- */
  function renderDayNotice() {
    var el = document.getElementById("day-notice");
    var n = OL.notices;
    if (!el || !n) return;
    var rows = [
      ["⏰", n.checkin],
      ["🎪", n.general],
      ["👨‍👩‍👧", n.party],
      ["⚠️", n.rosterShort && (n.rosterShort + " " + (n.classLock || ""))],
    ];
    el.innerHTML = rows.filter(function (r) { return r[1]; }).map(function (r) {
      return '<li><span aria-hidden="true">' + r[0] + "</span><span>" + r[1] + "</span></li>";
    }).join("");
  }

  /* ---------- 접이식 안내: 해당 앵커 링크로 오면 자동으로 펼침 ---------- */
  function initPrivacyDetails() {
    [["privacy", "privacy-details"], ["rules-details", "rules-details"]].forEach(function (pair) {
      var d = document.getElementById(pair[1]);
      if (!d) return;
      var open = function () { d.open = true; };
      document.addEventListener("click", function (e) {
        if (e.target.closest('a[href="#' + pair[0] + '"]')) open();
      });
      if (location.hash === "#" + pair[0]) open();
    });
  }

  /* ---------- 경기 방법·규칙·장비 ---------- */
  function renderRules() {
    var r = OL.rules;
    if (!r) return;

    var key = document.getElementById("rules-key");
    if (key && r.key) {
      key.innerHTML = r.key.map(function (k) {
        return '<li class="rules-key__item"><span class="rules-key__icon" aria-hidden="true">' + k.icon + "</span>" +
          "<div><strong>" + k.title + "</strong><p>" + k.desc + "</p></div></li>";
      }).join("");
    }

    var body = document.getElementById("rules-body");
    if (!body) return;
    var ul = function (arr) { return "<ul>" + arr.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul>"; };
    body.innerHTML =
      "<h3>경기 지도 보는 법</h3>" + ul(r.map) +
      "<h3>경기 방식과 순위 기준</h3>" + ul(r.rank) +
      "<h3>오리엔티어링 장비</h3>" +
      '<div class="rules-gear-wrap"><table class="rules-gear"><thead><tr><th scope="col">장비</th><th scope="col">설명</th></tr></thead><tbody>' +
        r.gear.map(function (g) { return "<tr><th scope=\"row\">" + g[0] + "</th><td>" + g[1] + "</td></tr>"; }).join("") +
      "</tbody></table></div>" + ul(r.gearNotes) +
      "<h3>당일 참가 순서</h3>" +
      '<p class="rules-step-title">경기 전</p>' + ul(r.before) +
      '<p class="rules-step-title">경기 중</p>' + ul(r.during) +
      '<p class="rules-step-title">경기 후</p>' + ul(r.after);
  }


  /* ---------- 당일 동선 (행사 당일에는 현재 단계 강조) ---------- */
  function renderFlow() {
    var list = document.getElementById("flow");
    if (!list || !OL.flow || !OL.event) return;

    var day = String(OL.event.dateISO).slice(0, 10);
    var at = function (hhmm) { return new Date(day + "T" + hhmm + ":00+09:00").getTime(); };

    // 모바일에서는 시간·제목만 한 줄로 보이고 눌러서 장소·설명을 펼침 (데스크톱은 항상 펼침)
    list.innerHTML = OL.flow.map(function (s, i) {
      return (
        '<li class="flow__step" data-state="upcoming">' +
          '<button type="button" class="flow__toggle" aria-expanded="false">' +
            '<span class="flow__head">' +
              '<span class="flow__num" aria-hidden="true">' + (i + 1) + "</span>" +
              '<span class="flow__time">' + s.time + "</span>" +
              '<span class="flow__now" hidden>지금 진행 중</span>' +
            "</span>" +
            '<span class="flow__title">' + s.title + "</span>" +
            '<span class="flow__chev" aria-hidden="true">▾</span>' +
          "</button>" +
          '<div class="flow__more">' +
            '<p class="flow__place"><span aria-hidden="true">📍</span> ' + s.place + "</p>" +
            '<p class="flow__desc">' + s.desc + "</p>" +
          "</div>" +
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
        if (state === "active") $(".flow__toggle", items[i]).setAttribute("aria-expanded", "true");
      });
    }
    update();
    setInterval(update, 60000);

    list.addEventListener("click", function (e) {
      var btn = e.target.closest(".flow__toggle");
      if (!btn) return;
      btn.setAttribute("aria-expanded", String(btn.getAttribute("aria-expanded") !== "true"));
    });

    // 데스크톱은 항상 펼쳐져 있어 버튼이 필요 없으므로 키보드 포커스에서 제외
    var wide = window.matchMedia("(min-width: 900px)");
    function syncFocus() {
      $$(".flow__toggle", list).forEach(function (b) {
        if (wide.matches) b.setAttribute("tabindex", "-1"); else b.removeAttribute("tabindex");
      });
    }
    syncFocus();
    wide.addEventListener("change", syncFocus);
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
        root.innerHTML = '<p class="countdown__done">축제가 시작되었습니다!</p>';
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
      root.setAttribute("aria-label", "축제까지 " + d + "일 " + h + "시간 " + m + "분 남음");
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

    var warn = document.getElementById("prize-warn");
    if (warn && OL.notices && OL.notices.roster) {
      warn.innerHTML = "⚠️ <strong>" + OL.notices.roster + "</strong> " + (OL.notices.rosterNote || "");
      warn.hidden = false;
    }
  }

  /* ---------- 5. 체험교육부스 (기초교육 카드 + 부스 1~9 목록) ---------- */
  function renderBooths() {
    var edu = OL.basicEdu;
    var grid = document.getElementById("booth-grid");
    if (grid && edu) {
      grid.innerHTML =
        '<div class="booth"><div>' +
          '<div class="booth__top">' +
            '<span class="booth__icon" aria-hidden="true">' + edu.icon + "</span>" +
            '<span class="badge badge--forest">' + edu.tag + "</span>" +
          "</div>" +
          (edu.time ? '<span class="booth__time">🕘 ' + edu.time + "</span>" : "") +
          "<h3>" + edu.title + "</h3>" +
          "<p>" + edu.desc + "</p>" +
        "</div></div>";
    }

    var list = document.getElementById("booth-list");
    if (list && OL.booths) {
      list.innerHTML = OL.booths.map(function (b) {
        return (
          '<li class="booth-item">' +
            '<span class="booth-item__num" aria-hidden="true">' + b.no + "</span>" +
            '<span class="booth-item__text">' +
              "<strong>" + b.title + "</strong>" +
              "<span>" + b.org + (b.note ? " · " + b.note : "") + "</span>" +
            "</span>" +
          "</li>"
        );
      }).join("");
    }
  }

  /* ---------- 오리엔티어링 경기 출발 리스트 (탭 + 검색) ---------- */
  function initStartList() {
    var data = OL.startList;
    var body = document.getElementById("startlist-body");
    var tabsEl = document.getElementById("startlist-tabs");
    var search = document.getElementById("startlist-search");
    var empty = document.getElementById("startlist-empty");
    var notes = document.getElementById("startlist-notes");
    if (!data || !body || !tabsEl) return;

    var tabs = ["전체"];
    data.classes.forEach(function (c) { if (tabs.indexOf(c.tab) === -1) tabs.push(c.tab); });
    var active = "전체";

    tabsEl.innerHTML = tabs.map(function (t) {
      return '<button type="button" class="startlist__tab" data-tab="' + t + '" aria-pressed="' + (t === active) + '">' + t + "</button>";
    }).join("");

    if (notes) {
      var checkinNotice = OL.notices && OL.notices.checkinShort ? ["<strong>" + OL.notices.checkinShort + "</strong>"] : [];
      var rosterNotice = OL.notices && OL.notices.roster
        ? ["<strong>" + OL.notices.roster + "</strong> " + (OL.notices.rosterNote || "")]
        : [];
      notes.innerHTML = checkinNotice.concat(rosterNotice, data.notes).map(function (n) { return "<li>" + n + "</li>"; }).join("");
    }

    function render() {
      var q = search ? search.value.replace(/\s+/g, "").toLowerCase() : "";
      var html = "";
      var count = 0;
      data.classes.forEach(function (c) {
        if (active !== "전체" && c.tab !== active) return;
        var rows = c.rows.filter(function (r) {
          return !q || String(r[1]).indexOf(q) !== -1 || String(r[2]).replace(/\s+/g, "").toLowerCase().indexOf(q) !== -1;
        });
        if (!rows.length) return;
        count += rows.length;
        html += '<tr class="startlist__class"><th colspan="3" scope="colgroup">' + c.name + " 클래스</th></tr>";
        rows.forEach(function (r) {
          html += "<tr><td>" + r[0] + "</td><td>" + r[2] + "</td><td>" + r[1] + "</td></tr>";
        });
      });
      body.innerHTML = html;
      if (empty) empty.hidden = count !== 0;
    }

    tabsEl.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-tab]");
      if (!btn) return;
      active = btn.getAttribute("data-tab");
      $$(".startlist__tab", tabsEl).forEach(function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      render();
    });
    if (search) search.addEventListener("input", render);
    render();
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
