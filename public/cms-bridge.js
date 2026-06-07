/**
 * Hydrates landing.html from Payload CMS APIs.
 * Fallback content stays in the HTML until you publish updates in /admin.
 */
(function () {
  var ICONS = {
    spark: { bg: 'linear-gradient(120deg,#f2994a,#eb5757)', glyph: '✦' },
    pen: { bg: 'linear-gradient(120deg,#7b5cff,#9d7bff)', glyph: '✎' },
    play: { bg: '#111', glyph: '▶' },
    link: { bg: 'var(--ink)', glyph: '↗' },
  }

  var DEFAULT_UPDATES = [
    {
      title: 'The triage inbox is live',
      url: '#',
      sourceLabel: 'changelog',
      iconStyle: 'spark',
    },
    {
      title: 'Context-switching brains',
      url: '#',
      sourceLabel: 'essay',
      iconStyle: 'pen',
    },
    {
      title: 'Watch: Slack, unified',
      url: '#',
      sourceLabel: 'demo · 0:48',
      iconStyle: 'play',
    },
  ]

  window.ZaliCms = {
    waitlistCount: null,
    siteName: 'Zali',
  }

  function labelFor(item) {
    if (item.sourceLabel) return item.sourceLabel
    return item.kind || 'update'
  }

  function renderUpdate(item) {
    var icon = ICONS[item.iconStyle] || ICONS.link
    var a = document.createElement('a')
    a.className = 'ex-item'
    a.href = item.url || '#'
    if (item.url && item.url.indexOf('http') === 0) {
      a.target = '_blank'
      a.rel = 'noopener noreferrer'
    }
    a.innerHTML =
      '<span class="ex-chk"></span>' +
      '<div class="ex-bd">' +
      '<div class="ex-tx"></div>' +
      '<div class="ex-meta">' +
      '<span class="ex-src"></span>' +
      '<span class="ex-from"></span>' +
      '</div></div>' +
      '<span class="ex-go">→</span>'
    a.querySelector('.ex-tx').textContent = item.title
    var src = a.querySelector('.ex-src')
    src.style.background = icon.bg
    src.textContent = icon.glyph
    a.querySelector('.ex-from').textContent = labelFor(item)
    return a
  }

  function renderUpdates(items) {
    var list = document.getElementById('cmsUpdatesList')
    if (!list) return
    var rows = items && items.length ? items : DEFAULT_UPDATES
    list.replaceChildren()
    rows.forEach(function (item) {
      list.appendChild(renderUpdate(item))
    })
  }

  function renderFooter(settings) {
    var copy = document.getElementById('finFooterCopy')
    if (copy && settings.footerText) copy.textContent = settings.footerText

    var nav = document.getElementById('finFooterLinks')
    if (!nav || !settings.footerLinks || !settings.footerLinks.length) return

    nav.replaceChildren()
    settings.footerLinks.forEach(function (link) {
      var a = document.createElement('a')
      a.href = link.url
      a.textContent = link.label
      if (link.url.indexOf('http') === 0) {
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
      }
      nav.appendChild(a)
    })
  }

  function applySiteSettings(settings) {
    window.ZaliCms.waitlistCount = settings.waitlistCount
    window.ZaliCms.siteName = settings.siteName || 'Zali'

    var logo = document.querySelector('.logo .name')
    if (logo && settings.siteName) logo.textContent = settings.siteName

    renderFooter(settings)
  }

  function fetchJson(url) {
    return fetch(url).then(function (res) {
      return res.json()
    })
  }

  Promise.all([
    fetchJson('/api/landing/posts?limit=3'),
    fetchJson('/api/site-settings'),
  ])
    .then(function (results) {
      renderUpdates(results[0].items)
      applySiteSettings(results[1])
    })
    .catch(function (err) {
      console.warn('CMS bridge: using static fallbacks', err)
    })
})()
