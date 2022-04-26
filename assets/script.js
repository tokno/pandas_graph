let data = null

function onTocClick(href) {
    console.log(href)

    const pages = document.querySelectorAll('#document-pane .page')

    pages.forEach(function(page) {
        if (page.getAttribute('data-path') == href) {
            page.classList.remove('inactive')
        }
        else {
            page.classList.add('inactive')
        }
    })
}


function renderToc(data) {
    const tocContainer = document.querySelector('#toc-container')

    const tocHtml = `<div>${marked.parse(data.toc)}</div>`
    const tocNode = new DOMParser().parseFromString(tocHtml, "text/html")

    tocNode.querySelector('body').childNodes.forEach(function(node) {
        tocContainer.appendChild(node)
    })

    tocContainer.querySelectorAll('a').forEach(function(a) {
        const href = a.getAttribute('href')
        a.setAttribute('data-page', href)
        a.removeAttribute('href')
        a.addEventListener('click', function() {
            onTocClick(decodeURI(href))
        })
    })
}


function renderPages(data) {
    const documentContainer = document.querySelector('#document-container')
    
    Object.keys(data.pages).forEach(function (path) {
        const pageHtml = `
            <div class="page inactive" data-path="${path}">
                ${marked.parse(data.pages[path])}
            </div>
        `

        const pageNode = new DOMParser().parseFromString(pageHtml, "text/html")
        pageNode.querySelector('body').childNodes.forEach(function(node) {
            documentContainer.appendChild(node)
        })
    })
}


function renderGraph(data) {
    const graphContainer = document.querySelector('#graph-container')
    const viz = new Viz();
  
    viz.renderSVGElement(data.graph)
        .then(function(element) {
            graphContainer.appendChild(element)
        })
}


function initializeDocument(data) {
    console.log('initializeDocument')

    window.data = data

    renderToc(data)
    renderPages(data)
    renderGraph(data)
}
