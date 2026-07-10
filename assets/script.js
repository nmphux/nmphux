/*
 * Nguyen Minh Phu — Portfolio
 * All page behavior: theme toggle, mobile menu, skill/project filters,
 * scroll-reveal + the scroll-pinned Quote effect, the Contact form
 * submit handler, and the AI-Twin chat widget.
 * Loaded with `defer` from index.html, so the DOM below is always
 * already parsed by the time this runs — no DOMContentLoaded wrapper
 * needed at the top level (the Quote scroll-effect setup still uses one
 * internally since it was already written that way).
 */

// Theme switching handler
// Storage access is wrapped in try/catch: some mobile contexts (in-app
// browsers such as Zalo/Messenger/Facebook, Safari private mode, or a
// browser with strict privacy settings) throw on localStorage access
// instead of just returning null. Since this file has no
// DOMContentLoaded wrapper, an uncaught throw here would stop every
// addEventListener registration below it from ever running — i.e. the
// mobile menu, the theme toggle itself, the contact form, and the chat
// widget would all silently stop working for that visitor.
function safeGetStorage(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch (e) {
    return fallback;
  }
}

function safeSetStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {}
}

const themeToggleBtn = document.getElementById("theme-toggle");
const storedTheme = safeGetStorage("color-theme", null);
const prefersDark =
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
document.documentElement.classList.toggle("dark", initialTheme === "dark");
if (initialTheme === "light") {
  themeToggleBtn.classList.remove("p-2.5");
  themeToggleBtn.classList.add("p-1.5");
}

themeToggleBtn.addEventListener("click", () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    themeToggleBtn.classList.remove("p-2.5");
    themeToggleBtn.classList.add("p-1.5");
    safeSetStorage("color-theme", "light");
  } else {
    document.documentElement.classList.add("dark");
    themeToggleBtn.classList.remove("p-1.5");
    themeToggleBtn.classList.add("p-2.5");
    safeSetStorage("color-theme", "dark");
  }
});

const PROFILE_VISIBILITY = {
  linkedin: true,
  github: true,
  facebook: false,
  scholar: false,
  huggingface: false,
};

function applyOptionalProfileLinks() {
  document.querySelectorAll("[data-optional-link]").forEach((el) => {
    const key = el.dataset.optionalLink;
    const visible = PROFILE_VISIBILITY[key] ?? true;
    el.classList.toggle("hidden", !visible);
    el.setAttribute("aria-hidden", String(!visible));
  });

  const note = document.querySelector("[data-visibility-note]");
  if (note) {
    const hasVisibleOptional = Boolean(
      PROFILE_VISIBILITY.facebook ||
      PROFILE_VISIBILITY.scholar ||
      PROFILE_VISIBILITY.huggingface,
    );
    note.classList.toggle("hidden", !hasVisibleOptional);
  }
}

// Sticky header background blur control
window.addEventListener("scroll", () => {
  const header = document.getElementById("main-header");
  if (window.scrollY > 40) {
    header.classList.add("border-slate-200", "dark:border-slate-800", "py-1");
    header.classList.remove("border-transparent");
  } else {
    header.classList.remove(
      "border-slate-200",
      "dark:border-slate-800",
      "py-1",
    );
    header.classList.add("border-transparent");
  }
});

// Mobile drawer control
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Close mobile drawer on selection
const mobileLinks = mobileMenu.querySelectorAll("a");
mobileLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

// Custom Skill Tab switcher logic
function switchSkillTab(tabId) {
  // Hide all tab containers
  const contentBlocks = document.querySelectorAll(".skill-tab-content");
  contentBlocks.forEach((content) => content.classList.add("hidden"));

  // Remove active style classes from all buttons
  const tabButtons = document.querySelectorAll(".skill-tab-btn");
  tabButtons.forEach((btn) => {
    if (btn.id === `btn-${tabId}`) {
      return; // Skip the active button
    }
    btn.classList.remove(
      "active",
      "font-semibold",
      "shadow-md",
      "bg-slate-900",
      "text-white",
      "dark:bg-white",
      "dark:text-gray-950",
      "hover:bg-slate-600",
      "dark:hover:bg-slate-300",
    );
    btn.classList.add(
      "font-medium",
      "text-slate-600",
      "dark:text-slate-300",
      "bg-slate-100",
      "dark:bg-bgCardDark",
      "hover:bg-slate-200",
      "dark:hover:bg-slate-800",
    );
  });

  // Show selected container
  document.getElementById(`tab-${tabId}`).classList.remove("hidden");

  // Set current button to active style
  const activeBtn = document.getElementById(`btn-${tabId}`);
  activeBtn.classList.remove(
    "font-medium",
    "text-slate-600",
    "dark:text-slate-300",
    "bg-slate-100",
    "dark:bg-bgCardDark",
    "hover:bg-slate-200",
    "dark:hover:bg-slate-800",
  );
  activeBtn.classList.add(
    "active",
    "font-semibold",
    "shadow-md",
    "bg-slate-900",
    "text-white",
    "dark:bg-white",
    "dark:text-gray-950",
    "hover:bg-slate-600",
    "dark:hover:bg-slate-300",
  );
}

// Project Filter configuration
function filterProjects(category) {
  const cards = document.querySelectorAll(".project-card");

  // Adjust active filter button style
  const filterButtons = document.querySelectorAll(".project-filter-btn");
  filterButtons.forEach((btn) => {
    btn.classList.remove(
      "active",
      "bg-slate-900",
      "text-white",
      "dark:bg-white",
      "dark:text-gray-950",
    );
    btn.classList.add(
      "bg-slate-100",
      "dark:bg-bgCardDark",
      "hover:bg-slate-200",
      "dark:hover:bg-slate-800",
    );
  });

  event.target.classList.add(
    "active",
    "bg-slate-900",
    "text-white",
    "dark:bg-white",
    "dark:text-gray-950",
  );
  event.target.classList.remove(
    "bg-slate-100",
    "dark:bg-bgCardDark",
    "hover:bg-slate-200",
    "dark:hover:bg-slate-800",
  );

  // Hide or show appropriate project containers
  cards.forEach((card) => {
    const cardCategory = card.getAttribute("data-category");
    if (category === "all" || cardCategory === category) {
      card.style.display = "block";
      // Re-trigger visual layout entrance
      setTimeout(() => {
        card.classList.add("active-scroll");
      }, 50);
    } else {
      card.style.display = "none";
      card.classList.remove("active-scroll");
    }
  });
}

//        // Advanced Reveal Elements using standard IntersectionObserver
// Elements automatically fade out and in as user scrolls up or down!
const revealOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px",
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active-scroll");
    } else {
      // Re-trigger transitions when scrolling back up/down to simulate ASUS style transitions
      entry.target.classList.remove("active-scroll");
    }
  });
}, revealOptions);

document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll(".reveal-element");
  targets.forEach((target) => revealObserver.observe(target));

  applyOptionalProfileLinks();

  const quoteSection = document.getElementById("quote");
  const quoteContent = quoteSection?.querySelector(".quote-content");
  const quoteOrbs = quoteSection
    ? quoteSection.querySelectorAll(".quote-orb")
    : [];
  const quoteScrollCue = quoteSection?.querySelector(".quote-scroll-cue");

  if (quoteSection && quoteContent) {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const lerp = (a, b, t) => a + (b - a) * t;

    // Fractions of the pinned scroll distance spent entering / exiting.
    // Between ENTER and EXIT the statement holds at full size so the
    // reader has time to read and reflect on it.
    const ENTER = 0.22;
    const EXIT = 0.78;

    let ticking = false;

    const updateQuoteScroll = () => {
      ticking = false;
      if (prefersReducedMotion) return;

      const rect = quoteSection.getBoundingClientRect();
      const winH = window.innerHeight;
      const scrollable = rect.height - winH;

      // Section shorter than viewport (e.g. very tall mobile browser
      // chrome collapse edge case) — just show it at rest.
      if (scrollable <= 0) return;

      const progress = clamp(-rect.top / scrollable, 0, 1);

      let scale, opacity, blur, translate;

      if (progress < ENTER) {
        const t = progress / ENTER;
        scale = lerp(0.7, 1, t);
        opacity = lerp(0, 1, t);
        blur = lerp(16, 0, t);
        translate = lerp(56, 0, t);
      } else if (progress > EXIT) {
        const t = (progress - EXIT) / (1 - EXIT);
        scale = lerp(1, 0.82, t);
        opacity = lerp(1, 0, t);
        blur = lerp(0, 16, t);
        translate = lerp(0, -56, t);
      } else {
        scale = 1;
        opacity = 1;
        blur = 0;
        translate = 0;
      }

      quoteContent.style.transform = `translateY(${translate.toFixed(2)}px) scale(${scale.toFixed(4)})`;
      quoteContent.style.opacity = opacity.toFixed(3);
      quoteContent.style.filter = `blur(${blur.toFixed(2)}px)`;

      // Subtle parallax on the background orbs for extra depth.
      quoteOrbs.forEach((orb, i) => {
        const direction = i % 2 === 0 ? -1 : 1;
        const shift = (progress - 0.5) * 70 * direction;
        orb.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
      });

      if (quoteScrollCue) {
        quoteScrollCue.style.opacity = progress < 0.08 ? "1" : "0";
      }
    };

    const requestQuoteUpdate = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateQuoteScroll);
      }
    };

    updateQuoteScroll();
    window.addEventListener("scroll", requestQuoteUpdate, {
      passive: true,
    });
    // Recompute on resize so the effect stays correct as the
    // viewport (and therefore the pinned scroll distance) changes.
    window.addEventListener("resize", requestQuoteUpdate);
  }
});

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeMarkdownUrl(url) {
  const cleanUrl = String(url || "")
    .trim()
    .replace(/&amp;/g, "&")
    .replace(/^&lt;|&gt;$/g, "");

  if (cleanUrl.startsWith("#")) return cleanUrl;

  try {
    const parsed = new URL(cleanUrl, window.location.href);
    const allowedProtocols = ["http:", "https:", "mailto:", "tel:"];
    return allowedProtocols.includes(parsed.protocol) ? parsed.href : "#";
  } catch (error) {
    return "#";
  }
}

function renderInlineMarkdown(rawText) {
  const inlineCode = [];
  let text = String(rawText ?? "").replace(/`([^`\n]+)`/g, (_, code) => {
    const token = `@@INLINE_CODE_${inlineCode.length}@@`;
    inlineCode.push(`<code>${escapeHtml(code)}</code>`);
    return token;
  });

  text = escapeHtml(text);
  text = text
    .replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^\*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => {
      const safeHref = normalizeMarkdownUrl(href);
      return `<a href="${safeHref}" target="_blank" rel="noreferrer noopener" rel="noopener noreferrer">${label}</a>`;
    });

  return text.replace(/@@INLINE_CODE_(\d+)@@/g, (_, index) => {
    return inlineCode[Number(index)] || "";
  });
}

function splitMarkdownTableRow(row) {
  return row
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isMarkdownTableSeparator(row) {
  const cells = splitMarkdownTableRow(row);
  return (
    cells.length > 0 && cells.every((cell) => /^:?-{2,}:?$/.test(cell.trim()))
  );
}

function renderMarkdownTable(rows) {
  if (!rows.length) return "";

  const separatorIndex = rows.findIndex((row, index) => {
    return index > 0 && isMarkdownTableSeparator(row);
  });

  if (separatorIndex === -1 && rows.length < 2) {
    return "";
  }

  const headerCells = splitMarkdownTableRow(rows[0]);
  const bodyRows =
    separatorIndex === -1 ? rows.slice(1) : rows.slice(separatorIndex + 1);

  const headerHtml = headerCells
    .map((cell) => `<th>${renderInlineMarkdown(cell)}</th>`)
    .join("");

  const bodyHtml = bodyRows
    .filter((row) => row.trim().startsWith("|"))
    .map((row) => {
      const cells = splitMarkdownTableRow(row);
      const normalizedCells = headerCells.map((_, index) => {
        return `<td>${renderInlineMarkdown(cells[index] || "")}</td>`;
      });
      return `<tr>${normalizedCells.join("")}</tr>`;
    })
    .join("");

  return `<div class="portfolio-chat-table-wrap"><table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
}

window.parseMarkdown = function parseMarkdown(text) {
  if (!text) return "";

  // Isolate multi-line and inline code blocks
  const codeBlocks = [];
  text = text.replace(/```([\w-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    codeBlocks.push({ lang, code });
    return `\x01CODEBLOCK_${codeBlocks.length - 1}\x02`;
  });

  const inlineCodes = [];
  text = text.replace(/`([^`]+)`/g, (match, code) => {
    inlineCodes.push(code);
    return `\x01INLINECODE_${inlineCodes.length - 1}\x02`;
  });

  // Security XSS Protection
  text = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Inline formatting styles
  text = text.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer noopener" rel="noopener noreferrer" class="text-blue-500 hover:text-blue-600 underline decoration-blue-500/30 hover:decoration-blue-500 transition-all font-medium">$1</a>',
  );
  text = text.replace(
    /\*\*\*(.*?)\*\*\*/g,
    '<strong class="font-bold italic text-slate-900 dark:text-white">$1</strong>',
  );
  text = text.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>',
  );
  text = text.replace(
    /\*(.*?)\*/g,
    '<em class="italic text-slate-800 dark:text-slate-200">$1</em>',
  );
  text = text.replace(
    /~~(.*?)~~/g,
    '<del class="line-through text-slate-500">${1}</del>',
  );

  // Block parsing state engine
  const lines = text.split("\n");
  let html = "";
  let listStack = [];
  let inTable = false;

  const closeLists = (targetIndent = -1) => {
    let res = "";
    while (
      listStack.length > 0 &&
      listStack[listStack.length - 1].indent > targetIndent
    ) {
      res += `</${listStack.pop().type}>`;
    }
    return res;
  };

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.trim().startsWith("\x01CODEBLOCK_")) {
      html += closeLists() + line + "\n";
      if (inTable) {
        html += "</table></div>";
        inTable = false;
      }
      continue;
    }

    if (line.trim() === "") {
      if (inTable) {
        html += "</table></div>";
        inTable = false;
      }
      continue;
    }

    // Headers
    const headerMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headerMatch) {
      html += closeLists();
      if (inTable) {
        html += "</table></div>";
        inTable = false;
      }
      const level = headerMatch[1].length;
      const content = headerMatch[2];
      const sizeClasses = [
        "text-2xl mt-6",
        "text-xl mt-5",
        "text-lg mt-4",
        "text-md mt-4",
        "text-base mt-3",
        "text-sm mt-3",
      ];
      html += `<h${level} class="${sizeClasses[level - 1]} font-bold mb-2 text-slate-900 dark:text-white font-display">${content}</h${level}>`;
      continue;
    }

    // Blockquotes
    if (line.trim().startsWith("> ")) {
      html += closeLists();
      if (inTable) {
        html += "</table></div>";
        inTable = false;
      }
      html += `<blockquote class="border-l-4 border-slate-300 dark:border-slate-600 pl-4 py-1 my-2 text-slate-600 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 rounded-r">${line.replace(/^>\s*/, "")}</blockquote>`;
      continue;
    }

    // Horizontal Rule
    if (line.trim().match(/^(---|\*\*\*|___)$/)) {
      html += closeLists();
      if (inTable) {
        html += "</table></div>";
        inTable = false;
      }
      html += '<hr class="my-6 border-slate-200 dark:border-slate-700">';
      continue;
    }

    // Lists structural processing
    const listMatch = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)/);
    if (listMatch) {
      if (inTable) {
        html += "</table></div>";
        inTable = false;
      }
      const indent = listMatch[1].length;
      const marker = listMatch[2];
      const content = listMatch[3];
      const type = marker.match(/\d+/) ? "ol" : "ul";
      const listClass = type === "ol" ? "list-decimal" : "list-disc";

      if (
        listStack.length === 0 ||
        indent > listStack[listStack.length - 1].indent
      ) {
        html += `<${type} class="m-0 p-0 pl-5 my-2 ${listClass}">`;
        listStack.push({ type, indent });
      } else if (indent < listStack[listStack.length - 1].indent) {
        html += closeLists(indent);
        if (listStack.length === 0) {
          html += `<${type} class="m-0 p-0 pl-5 my-2 ${listClass}">`;
          listStack.push({ type, indent });
        }
      }

      if (
        listStack.length > 0 &&
        listStack[listStack.length - 1].indent === indent &&
        listStack[listStack.length - 1].type !== type
      ) {
        html += `</${listStack.pop().type}><${type} class="m-0 p-0 pl-5 my-2 ${listClass}">`;
        listStack.push({ type, indent });
      }

      if (
        listStack.length > 0 &&
        listStack[listStack.length - 1].indent === indent &&
        listStack[listStack.length - 1].type !== type
      ) {
        // Recalculate color dynamic balance specifically for ordered list swaps
        if (type === "ol") markerColor = "marker:text-emerald-500";
        html += `</${listStack.pop().type}><${type} class="m-0 p-0 pl-5 my-2 ${listClass} ${markerColor}">`;
        listStack.push({ type, indent });
      }

      // Calculate real-time hierarchy depth from active stack length
      const depth = listStack.length - 1;
      let itemColor = "marker:text-waterBlueGlow marker:font-bold";

      if (type === "ul") {
        const depthColors = [
          "marker:text-blue-500",
          "marker:text-emerald-500",
          "marker:text-amber-500",
          "marker:text-purple-500",
        ];
        itemColor = depthColors[depth % depthColors.length];
      }

      html += `<li class="my-1 text-slate-700 dark:text-slate-300 pl-1 ${itemColor}">${content}</li>`;
      continue;
    }

    // Tables rendering
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      html += closeLists();
      let isFirstRow = false;
      if (!inTable) {
        html +=
          '<div class="overflow-x-auto my-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"><table class="w-full text-left text-sm border-collapse">';
        inTable = true;
        isFirstRow = true;
      }
      if (/^[\s|:\-]+$/.test(line)) continue;

      const cells = line.split("|").slice(1, -1);
      html +=
        '<tr class="border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">';
      cells.forEach((cell) => {
        const content = cell.trim();
        if (isFirstRow) {
          html += `<th class="px-4 py-2 font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-white border-r border-slate-200 dark:border-slate-700 last:border-0">${content}</th>`;
        } else {
          html += `<td class="px-4 py-2 text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-700 last:border-0">${content}</td>`;
        }
      });
      html += "</tr>";

      if (
        i === lines.length - 1 ||
        !(
          lines[i + 1].trim().startsWith("|") &&
          lines[i + 1].trim().endsWith("|")
        )
      ) {
        html += "</table></div>";
        inTable = false;
      }
      continue;
    }

    // Plain Text blocks
    html += closeLists();
    if (inTable) {
      html += "</table></div>";
      inTable = false;
    }

    let blockText = line;
    while (
      i + 1 < lines.length &&
      lines[i + 1].trim() !== "" &&
      !lines[i + 1].match(/^(#{1,6}|\s*[-*]|\s*\d+\.|> |\||---|\*\*\*)/) &&
      !lines[i + 1].startsWith("\x01CODEBLOCK_")
    ) {
      blockText += " " + lines[i + 1].trim();
      i++;
    }

    let ewbr = false;
    if (blockText.endsWith("&lt;br&gt;")) {
      ewbr = true;
      blockText = blockText.replace("&lt;br&gt;", "");
    }
    html += `<div "${ewbr ? "class='mb-3'" : ""}>${blockText}</div>`;
  }

  html += closeLists();
  if (inTable) html += "</table></div>";

  // Restore isolated code placeholders
  html = html.replace(/\x01CODEBLOCK_(\d+)\x02/g, (match, index) => {
    const block = codeBlocks[index];
    const canvas = block.code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<div class="my-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm bg-slate-900"><div class="px-3 py-1.5 bg-slate-800 text-[10px] text-slate-400 uppercase font-bold tracking-wider">${block.lang || "CODE"}</div><div class="p-3 overflow-x-auto text-sm text-slate-100 font-mono whitespace-pre">${canvas}</div></div>`;
  });

  html = html.replace(/\x01INLINECODE_(\d+)\x02/g, (match, index) => {
    const code = inlineCodes[index];
    const canvas = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `<code class="bg-slate-100 dark:bg-slate-800 text-blue-500 dark:text-sky-400 px-1.5 py-0.5 rounded text-[0.85em] font-mono border border-slate-200 dark:border-slate-700">${canvas}</code>`;
  });

  return html;
};

// Reveal one of the pre-built <p data-feedback-state="..."> messages
// inside #form-feedback instead of writing markup at runtime.
function showFormFeedback(state) {
  const container = document.getElementById("form-feedback");
  if (!container) return;
  container.classList.remove("hidden");
  container.querySelectorAll("[data-feedback-state]").forEach((el) => {
    const isMatch = el.dataset.feedbackState === state;
    el.classList.toggle("hidden", !isMatch);
    el.classList.toggle("flex", isMatch);
  });
  document.getElementById("contact-submit-btn")?.classList.add("hidden");
}

function hideFormFeedback() {
  document.getElementById("form-feedback")?.classList.add("hidden");
  document.getElementById("contact-submit-btn")?.classList.remove("hidden");
}

// Google Apps Script submit form
async function handleFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = document.getElementById("contact-submit-btn");

  // Belt-and-suspenders: a disabled submit button already blocks
  // both clicks and Enter-key implicit submission, but this also
  // guards against any resubmission that bypasses that (e.g. a
  // programmatic form.requestSubmit() call).
  if (submitBtn?.disabled) return;

  const btnText = document.getElementById("btn-text");
  const btnIcon = document.getElementById("btn-icon");
  const originalText = btnText?.innerText;

  // BƯỚC 4: Dán URL Web App của Google Apps Script vào biến này
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbwnD_UdKweSNxCNgQoq6lPFgWhIpukEXCEIFn4T-BP_tOSvUqO1XOu5SKHB_jBx0XfhTA/exec";

  // Click-guard: disable the button immediately so neither a fast
  // double-click nor an impatient re-click can ever fire a second
  // submission. The icon swaps to a spinner to signal "in
  // progress" — since it's the *same* button element (not a
  // separate placeholder swapped in), its width/height never
  // change, so there's no layout shift and nothing to click under
  // it while it's disabled.
  if (submitBtn) submitBtn.disabled = true;
  if (btnText) btnText.innerText = "Sending...";
  if (btnIcon) {
    btnIcon.classList.remove("fa-paper-plane");
    btnIcon.classList.add("fa-circle-notch", "fa-spin");
  }

  const resetSubmitButton = () => {
    if (submitBtn) submitBtn.disabled = false;
    if (btnText && originalText) btnText.innerText = originalText;
    if (btnIcon) {
      btnIcon.classList.remove("fa-circle-notch", "fa-spin");
      btnIcon.classList.add("fa-paper-plane");
    }
  };

  // Kiểm tra xem đã thêm link chưa
  if (scriptURL === "<YOUR_GOOGLE_APPS_SCRIPT_URL_HERE>") {
    showFormFeedback("config");
    resetSubmitButton();
    setTimeout(hideFormFeedback, 3600);
    return;
  }

  try {
    const formData = new FormData(form);
    const searchParams = new URLSearchParams(formData);

    await fetch(scriptURL, {
      method: "POST",
      body: searchParams,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    showFormFeedback("success");
    form.reset();
  } catch (error) {
    showFormFeedback("error");
  } finally {
    // Runs on both success and error, so the button is always back
    // to its normal clickable "Send" state once the user has seen
    // the result — they can immediately try again if it failed.
    resetSubmitButton();
    setTimeout(hideFormFeedback, 3000);
  }
}

// Single source of truth for the real phone number — both the copy
// handler and the hover-reveal read from here, so the two can never
// drift out of sync the way separate hardcoded strings could.
function getContactPhoneNumber() {
  return (
    document.getElementById("contact-phone-num")?.dataset.phone ||
    "+84336667903"
  );
}

// Copy phone number to clipboard
function copyPhoneNumber() {
  const socialGrid = document.getElementById("social-grid");
  const feedback = document.getElementById("doubleclick-feedback");
  navigator.clipboard.writeText(getContactPhoneNumber()).then(() => {
    feedback.classList.remove("hidden");
    feedback.classList.add("block");
    socialGrid.classList.add("hidden");
    setTimeout(() => {
      feedback.classList.add("hidden");
      feedback.classList.remove("block");
      socialGrid.classList.remove("hidden");
    }, 1000);
  });
}

// Reveal / mask the phone number by swapping which pre-built span is
// visible, instead of rewriting the element's markup on every hover.
function togglePhoneNumberView(showFull) {
  const wrap = document.getElementById("contact-phone-num");
  if (!wrap) return;
  wrap.querySelectorAll("[data-phone-view]").forEach((el) => {
    const isMatch = el.dataset.phoneView === (showFull ? "full" : "masked");
    el.classList.toggle("hidden", !isMatch);
  });
}

function showFullPhoneNumber() {
  togglePhoneNumberView(true);
}

function hidePhoneNumber() {
  togglePhoneNumberView(false);
}

/* -------------------------------------------------------------------
   AI-Twin Chat Widget
   Kept in its own IIFE (as it already was) so its internal helper
   names (state, toggleChat, handleSend, etc.) can't collide with
   anything above.
   ------------------------------------------------------------------- */
(function () {
  const PROXY_ENDPOINT = "https://proxy-ca-nhan.phumintsnguyen.workers.dev/";
  const REQUEST_TIMEOUT_MS = 150000;

  function getCookieValue(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)"),
    );
    return match ? match[2] : null;
  }

  function getVisitorId() {
    const cookieVisitorId = getCookieValue("visitor_id");
    const storedVisitorId = safeGetStorage("chat_visitor_id", null);
    // 8 char a-z, 0-9
    const visitorId =
      cookieVisitorId ||
      storedVisitorId ||
      `${Math.random().toString(16).substring(2, 10)}`;

    safeSetStorage("chat_visitor_id", visitorId);

    if (!cookieVisitorId) {
      document.cookie = `visitor_id=${visitorId}; path=/; max-age=31536000; SameSite=Lax`;
    }

    return visitorId;
  }

  const chatRoot = document.getElementById("portfolio-chat");
  const chatbox = document.getElementById("chat-panel");
  const toggleButton = document.getElementById("chat-toggle");
  const inputField = document.getElementById("chat-input");
  const sendBtn = document.getElementById("btn-send");
  const messagesContainer = document.getElementById("chat-messages");
  const suggestBtns = document.querySelectorAll(".suggest-btn");
  const suggestionContainer = document.querySelector(".suggestion-container");

  if (
    !chatRoot ||
    !chatbox ||
    !toggleButton ||
    !inputField ||
    !sendBtn ||
    !messagesContainer
  ) {
    console.warn("Portfolio chat markup was not found.");
    return;
  }

  if ("inert" in chatbox) {
    chatbox.inert = true;
  }

  const state = {
    isOpen: false,
    isBusy: false,
    chatHistory: [],
    sessionId: null,
  };

  function toggleChat() {
    state.isOpen = !state.isOpen;

    chatRoot.dataset.open = String(state.isOpen);
    chatbox.setAttribute("aria-hidden", String(!state.isOpen));
    toggleButton.setAttribute("aria-expanded", String(state.isOpen));
    toggleButton.setAttribute(
      "aria-label",
      state.isOpen ? "Close chat" : "Open chat",
    );

    if ("inert" in chatbox) {
      chatbox.inert = !state.isOpen;
    }

    if (state.isOpen) {
      window.setTimeout(() => inputField.focus(), 160);
    }
  }

  function updateButtonState() {
    const text = inputField.value.trim();
    sendBtn.disabled = text.length === 0 || state.isBusy;
    sendBtn.setAttribute("aria-disabled", String(sendBtn.disabled));

    inputField.style.height = `${Math.min(inputField.scrollHeight, 120) - 10}px`;
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function appendMessage(text, isUser = false) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `portfolio-chat-row ${isUser ? "user" : "assistant"}`;

    const innerBubble = document.createElement("div");
    innerBubble.className = isUser
      ? "portfolio-chat-bubble"
      : "portfolio-chat-bubble portfolio-chat-markdown";
    innerBubble.textContent = text;

    msgDiv.appendChild(innerBubble);
    messagesContainer.appendChild(msgDiv);
    scrollToBottom();
    return innerBubble;
  }

  function showTypingIndicator() {
    const msgDiv = document.createElement("div");
    msgDiv.className = "portfolio-chat-row assistant";

    const innerBubble = document.createElement("div");
    innerBubble.className =
      "portfolio-chat-bubble portfolio-chat-markdown typing-bubble";

    const template = document.getElementById("typing-indicator-template");
    if (template) {
      innerBubble.appendChild(template.content.cloneNode(true));
    }

    msgDiv.appendChild(innerBubble);
    messagesContainer.appendChild(msgDiv);
    scrollToBottom();
    return innerBubble;
  }

  function createRequestId() {
    if (window.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }
    return `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function parseSseEvent(eventText) {
    const dataLines = [];
    let eventName = "message";

    eventText.split(/\r?\n/).forEach((line) => {
      const cleanLine = line.trimEnd();
      if (!cleanLine || cleanLine.startsWith(":")) return;
      if (cleanLine.startsWith("event:")) {
        eventName = cleanLine.slice(6).trim() || "message";
        return;
      }
      if (cleanLine.startsWith("data:")) {
        dataLines.push(cleanLine.slice(5).trimStart());
      }
    });

    if (!dataLines.length) return null;

    const payload = dataLines.join("\n").trim();
    if (!payload || payload === "[DONE]") return { done: true, eventName };

    try {
      const parsed = JSON.parse(payload);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return { ...parsed, eventName };
      }
      return { content: String(parsed ?? ""), eventName };
    } catch (error) {
      return { content: payload, eventName };
    }
  }

  function extractAssistantDelta(data) {
    if (!data) return "";
    if (typeof data === "string") return data;

    const directCandidates = [
      data.content,
      data.message,
      data.answer,
      data.response,
      data.text,
      data.output,
    ];

    for (const candidate of directCandidates) {
      if (typeof candidate === "string") return candidate;
      if (candidate?.content && typeof candidate.content === "string") {
        return candidate.content;
      }
      if (candidate?.text && typeof candidate.text === "string") {
        return candidate.text;
      }
    }

    const firstChoice = Array.isArray(data.choices) ? data.choices[0] : null;
    return (
      firstChoice?.delta?.content ||
      firstChoice?.message?.content ||
      firstChoice?.text ||
      ""
    );
  }

  function renderAssistantBubble(assistantBubble, text) {
    assistantBubble.innerHTML = parseMarkdown(text);
    console.log(text);
    scrollToBottom();
  }

  async function streamAssistantReply(text, assistantBubble) {
    const visitorId = getVisitorId();
    const requestId = createRequestId();

    // Detect whether the user's message is Vietnamese (basic heuristic)
    const vietnameseCharRe = /[\u00C0-\u1EF9đĐ]/; // covers common Vietnamese diacritics
    const vietnameseWordRe =
      /\b(xin|chao|ban|toi|nhe|giup|dc|nghiem|thong\s+tin|ttin|xem|gui|coi|cho\s+minh|cho\s+xin|dau|nao|chua|khong|ko|gi|vay)\b|\bk\?/i;
    const isVietnamese =
      vietnameseCharRe.test(text) || vietnameseWordRe.test(text);

    const languageInstruction = isVietnamese
      ? "Vui lòng trả lời bằng tiếng Việt. Please answer in Vietnamese."
      : "Please answer in English. Trả lời bằng tiếng Anh.";

    const fullMessage = `${text}\n\n${languageInstruction}`;

    const reqBody = JSON.stringify({
      message: fullMessage,
      history: state.chatHistory.slice(-10).map((g) => ({
        role: g.role,
        content: g.content,
      })),
      visitor_id: visitorId,
      session_id: state.sessionId || void 0,
    });

    const headers = {
      "Content-Type": "application/json",
      Accept: "text/event-stream, application/json",
      "X-Chat-Request-Id": requestId,
    };

    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      REQUEST_TIMEOUT_MS,
    );

    try {
      const response = await fetch(PROXY_ENDPOINT, {
        method: "POST",
        mode: "cors",
        cache: "no-store",
        headers,
        body: reqBody,
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorDetails = "";
        try {
          errorDetails = await response.text();
        } catch (e) {
          errorDetails = "Unable to read error response payload.";
        }

        throw new Error(`Proxy returned ${response.status}. ${errorDetails}`);
      }

      if (!response.body) {
        throw new Error("Response body is empty or missing from the proxy.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiText = "";
      let eventBuffer = "";
      let rawText = "";
      let receivedDone = false;

      // Narrow, protocol-level noise filter only — deliberately does NOT
      // try to guess "too many fragments" or match generic words like
      // "request_id", since a real assistant answer (e.g. about API
      // design) could legitimately contain that text and get silently
      // dropped. It only catches two concrete shapes the proxy can
      // forward inline: a timeout notice and SSE keep-alive pings.
      const isCorruptedPayload = (payload) =>
        payload.includes("Upstream timed out") ||
        /:\s*ping\s+\d+/.test(payload);

      // These two functions only ACCUMULATE text into `aiText` — they no
      // longer touch the DOM. Markdown parsing + innerHTML happen exactly
      // once, after the stream finishes (see below), instead of on every
      // chunk. Re-parsing the whole message from scratch on each delta did
      // repeated, ever-growing regex work and forced a reflow per chunk —
      // real latency on longer replies, and time the read loop wasn't
      // spending reading the network.
      const consumePayload = (data) => {
        if (!data) return;

        if (data.session_id && !state.sessionId) {
          state.sessionId = data.session_id;
        }

        if (data.done) {
          receivedDone = true;
          return;
        }

        if (data.error) {
          throw new Error(data.error);
        }

        const delta = extractAssistantDelta(data);
        if (delta) {
          aiText += delta;
        }
      };

      const consumeRawText = (payload) => {
        const cleanedPayload = payload
          .split(/\r?\n/)
          .filter((line) => !line.trim().startsWith(":"))
          .join("\n")
          .trim();

        if (!cleanedPayload) return;

        if (isCorruptedPayload(cleanedPayload)) {
          console.warn(
            "[WARN] Skipping corrupted API response:",
            cleanedPayload.slice(0, 100),
          );
          return;
        }

        try {
          const previousText = aiText;
          consumePayload(JSON.parse(cleanedPayload));
          if (previousText === aiText && !receivedDone) {
            aiText += cleanedPayload;
          }
        } catch (error) {
          if (!cleanedPayload.startsWith("{")) {
            aiText += cleanedPayload;
          } else {
            console.warn(
              "[WARN] Skipped unparseable JSON fragment:",
              cleanedPayload.slice(0, 80),
            );
          }
        }
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        rawText += chunk;
        eventBuffer += chunk;

        const events = eventBuffer.split(/\r?\n\r?\n/);
        eventBuffer = events.pop() || "";

        for (const eventText of events) {
          if (isCorruptedPayload(eventText)) {
            console.warn("[WARN] Filtering corrupted event");
            continue;
          }
          consumePayload(parseSseEvent(eventText));
        }
      }

      const trailingText = `${eventBuffer}${decoder.decode()}`.trim();
      if (trailingText.includes("data:")) {
        consumePayload(parseSseEvent(trailingText));
      } else if (!aiText && !receivedDone) {
        if (!isCorruptedPayload(trailingText)) {
          consumeRawText(trailingText || rawText);
        } else {
          console.warn("[WARN] Final payload corrupted, ignoring");
        }
      }

      if (!aiText) {
        aiText =
          "I received an empty response from the assistant. Please try again in a moment.";
      }

      // Single render pass: parse markdown and paint the bubble once, now
      // that the full response is assembled.
      renderAssistantBubble(assistantBubble, aiText);

      state.chatHistory.push({ role: "user", content: text });
      state.chatHistory.push({ role: "assistant", content: aiText });
      return aiText;
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(
          "The assistant request timed out before the stream completed.",
        );
      }
      console.error("AI stream failed", { requestId, error });
      throw error;
    } finally {
      window.clearTimeout(timeoutId);
    }
  }

  async function handleSend(text) {
    if (!text || state.isBusy) return;

    if (suggestionContainer) {
      suggestionContainer.style.display = "none";
    }

    state.isBusy = true;
    appendMessage(text, true);
    inputField.value = "";
    updateButtonState();

    const loadingBubble = showTypingIndicator();

    try {
      await streamAssistantReply(text, loadingBubble);
    } catch (error) {
      console.error("Chat API Execution Failed completely:", error);
      loadingBubble.innerHTML =
        '<p><strong>AI connection error.</strong> Please try again later, or contact Phu directly at <a href="mailto:phumintsnguyen@gmail.com">phumintsnguyen@gmail.com</a>.</p>';
    } finally {
      state.isBusy = false;
      updateButtonState();
      if (state.isOpen) inputField.focus();
    }
  }

  toggleButton.addEventListener("click", toggleChat);
  inputField.addEventListener("input", updateButtonState);
  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) {
        handleSend(inputField.value.trim());
      }
    }
  });
  sendBtn.addEventListener("click", () => {
    if (!sendBtn.disabled) {
      handleSend(inputField.value.trim());
    }
  });
  suggestBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      handleSend(btn.textContent.trim());
    });
  });

  updateButtonState();
})();
