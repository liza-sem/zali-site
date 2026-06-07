if (window.__ZALI_LOADER__) {
  window.ZaliLoader = window.__ZALI_LOADER__
} else {
  window.__ZALI_LOADER__ = (function () {
    var SPAN = 620
    var cells = []
    var loader, grid, logo
    var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    var booted = false
    var revealing = false
    var navLock = false

    function isInIframe() {
      try {
        return window.self !== window.top
      } catch (_) {
        return true
      }
    }

    function storageWindow() {
      if (isInIframe()) {
        try {
          return window.top
        } catch (_) {}
      }
      return window
    }

    function clearRevealPending() {
      try {
        document.documentElement.classList.remove('zali-reveal')
      } catch (_) {}
    }

    function showLoader() {
      if (!loader) loader = document.getElementById('loader')
      if (!loader) return false
      loader.classList.remove('done')
      loader.style.display = 'grid'
      try {
        document.documentElement.classList.add('zali-reveal')
      } catch (_) {}
      return true
    }

    function hideLoader() {
      if (revealing) return
      if (!loader) loader = document.getElementById('loader')
      if (!loader) return
      loader.classList.add('done')
      if (logo) logo.classList.add('out')
      setTimeout(function () {
        loader.style.display = 'none'
        clearRevealPending()
      }, 380)
    }

    function build() {
      loader = document.getElementById('loader')
      grid = document.getElementById('lgGrid')
      logo = document.getElementById('lgLogo')
      if (!loader || !grid) return false

      var w = innerWidth
      var h = innerHeight
      var bs = w < 700 ? 52 : 64
      var cols = Math.ceil(w / bs)
      var rows = Math.ceil(h / bs)
      var cellW = Math.ceil(w / cols)
      var cellH = Math.ceil(h / rows)

      grid.style.gridTemplateColumns = 'repeat(' + cols + ',' + cellW + 'px)'
      grid.style.gridTemplateRows = 'repeat(' + rows + ',' + cellH + 'px)'
      grid.innerHTML = ''
      cells = []

      for (var i = 0; i < cols * rows; i++) {
        var d = document.createElement('div')
        d.className = 'lg-cell'
        grid.appendChild(d)
        cells.push(d)
      }

      return true
    }

    function rnd() {
      return (Math.random() * SPAN).toFixed(0) + 'ms'
    }

    function reveal(attempt) {
      if (revealing && (attempt || 0) === 0) return
      revealing = true
      if ((attempt || 0) === 0) stripNavFlag()
      if (!build()) {
        if ((attempt || 0) < 40) {
          requestAnimationFrame(function () {
            reveal((attempt || 0) + 1)
          })
        } else {
          revealing = false
          hideLoader()
        }
        return
      }

      showLoader()
      cells.forEach(function (d) {
        d.classList.remove('out')
        d.style.transitionDelay = ''
      })
      if (logo) {
        logo.style.transition = ''
        logo.classList.remove('out')
      }

      if (reduce) {
        setTimeout(function () {
          revealing = false
          hideLoader()
        }, 250)
        return
      }

      setTimeout(function () {
        cells.forEach(function (d) {
          d.style.transitionDelay = rnd()
          d.classList.add('out')
        })
        if (logo) logo.classList.add('out')
        setTimeout(function () {
          revealing = false
          hideLoader()
        }, SPAN + 460)
      }, 220)
    }

    function cover(cb) {
      if (!build()) {
        if (cb) cb()
        return
      }

      showLoader()
      cells.forEach(function (d) {
        d.style.transition = 'none'
        d.classList.add('out')
      })
      if (logo) {
        logo.style.transition = 'none'
        logo.classList.add('out')
      }
      void loader.offsetWidth
      cells.forEach(function (d) {
        d.style.transition = ''
      })
      if (logo) logo.style.transition = ''

      if (reduce) {
        requestAnimationFrame(function () {
          cells.forEach(function (d) {
            d.classList.remove('out')
          })
          if (logo) logo.classList.remove('out')
          setTimeout(function () {
            if (cb) cb()
          }, 220)
        })
        return
      }

      requestAnimationFrame(function () {
        cells.forEach(function (d) {
          d.style.transitionDelay = rnd()
          d.classList.remove('out')
        })
        if (logo) logo.classList.remove('out')
        setTimeout(function () {
          if (cb) cb()
        }, SPAN + 420)
      })
    }

    function isSameOrigin(url) {
      try {
        return new URL(url, location.href).origin === location.origin
      } catch (_) {
        return false
      }
    }

    function isZaliFamily(hostname) {
      if (!hostname) return false
      if (hostname === 'localhost' || hostname === '127.0.0.1') return true
      return hostname === 'zali.so' || hostname.slice(-8) === '.zali.so'
    }

    function isLandingPath(pathname) {
      return pathname === '/landing.html' || pathname.slice(-13) === '/landing.html'
    }

    function shouldBreakOutToTop(url) {
      if (!isInIframe()) return false

      try {
        var parsed = new URL(url, location.href)
        if (isSameOrigin(parsed.href)) {
          if (isLandingPath(parsed.pathname)) return false
          if (parsed.pathname.indexOf('/admin') === 0) return false
          if (parsed.pathname.indexOf('/api') === 0) return false
          return true
        }
        return isZaliFamily(parsed.hostname)
      } catch (_) {
        return false
      }
    }

    function destinationWithNavFlag(url) {
      try {
        var parsed = new URL(url, location.href)
        var store = storageWindow()

        if (isSameOrigin(parsed.href) || isZaliFamily(parsed.hostname)) {
          parsed.searchParams.set('zali_nav', '1')
          try {
            store.sessionStorage.setItem('zali_nav', '1')
          } catch (_) {}
          return parsed.toString()
        }
      } catch (_) {}
      return url
    }

    function shouldInterceptLink(a, href) {
      if (!href || href.charAt(0) === '#') return false
      if (a.hasAttribute('download')) return false
      if (a.getAttribute('data-no-loader') === 'true') return false
      if (/^(mailto:|tel:|javascript:)/i.test(href)) return false

      try {
        var url = new URL(href, location.href)
        if (url.pathname.indexOf('/admin') === 0) return false
        if (url.pathname.indexOf('/api') === 0) return false
        return isSameOrigin(url.href) || isZaliFamily(url.hostname)
      } catch (_) {
        return /\.html(\?|#|$)/i.test(href)
      }
    }

    function shouldRevealOnLoad() {
      if (isInIframe()) return false

      try {
        if (document.documentElement.classList.contains('zali-reveal')) return true
      } catch (_) {}

      try {
        if (storageWindow().sessionStorage.getItem('zali_nav') === '1') return true
      } catch (_) {}

      try {
        if (new URLSearchParams(location.search).get('zali_nav') === '1') return true
      } catch (_) {}

      return false
    }

    function stripNavFlag() {
      try {
        storageWindow().sessionStorage.removeItem('zali_nav')
      } catch (_) {}

      try {
        var params = new URLSearchParams(location.search)
        if (params.get('zali_nav') !== '1') return
        params.delete('zali_nav')
        var qs = params.toString()
        var next = location.pathname + (qs ? '?' + qs : '') + location.hash
        history.replaceState(null, '', next)
      } catch (_) {}
    }

    function deferRevealToHydration() {
      try {
        return document.documentElement.getAttribute('data-zali-app') === '1'
      } catch (_) {
        return false
      }
    }

    function navigate(url) {
      if (shouldBreakOutToTop(url)) {
        try {
          window.top.location.href = url
        } catch (_) {
          location.href = url
        }
        return
      }
      location.href = url
    }

    function go(url) {
      if (navLock) return
      navLock = true
      var dest = destinationWithNavFlag(url)
      cover(function () {
        navigate(dest)
      })
    }

    function boot() {
      if (booted) return
      booted = true

      if (shouldRevealOnLoad()) {
        // React hydration wipes dynamically built grid cells — defer to ZaliNavBridge.
        if (!deferRevealToHydration()) reveal(0)
      } else {
        hideLoader()
      }
    }

    function handleNavEvent(e) {
      if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      var a = e.target.closest ? e.target.closest('a[href]') : null
      if (!a) return
      if (a.target && a.target !== '_self') return

      var href = a.getAttribute('href') || ''
      if (!shouldInterceptLink(a, href)) return

      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      go(href)
    }

    function bindClicks() {
      document.addEventListener('click', handleNavEvent, true)
    }

    bindClicks()

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot)
    } else {
      boot()
    }

    window.addEventListener('pageshow', function (e) {
      if (!e.persisted) return
      booted = false
      revealing = false
      navLock = false
      if (shouldRevealOnLoad()) {
        if (!deferRevealToHydration()) reveal(0)
      } else {
        hideLoader()
      }
    })

    return {
      reveal: reveal,
      cover: cover,
      go: go,
      reset: function () {
        revealing = false
        navLock = false
      },
    }
  })()

  window.ZaliLoader = window.__ZALI_LOADER__
}
