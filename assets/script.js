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
    const tocPane = document.querySelector('#toc-pane')

    const tocHtml = `<div>${marked.parse(data.toc)}</div>`
    const tocNode = new DOMParser().parseFromString(tocHtml, "text/xml")

    tocNode.childNodes.forEach(function(node) {
        tocPane.appendChild(node)
    })

    tocPane.querySelectorAll('a').forEach(function(a) {
        const href = a.getAttribute('href')
        a.setAttribute('data-page', href)
        a.removeAttribute('href')
        a.addEventListener('click', function() {
            onTocClick(decodeURI(href))
        })
    })
}


function renderPages(data) {
    const documentPane = document.querySelector('#document-pane')
    
    Object.keys(data.pages).forEach(function (path) {
        const wrapper = document.createElement('div')
        const pageHtml = `
            <div class="page inactive" data-path="${path}">
                ${marked.parse(data.pages[path])}
            </div>
        `

        const pageNode = new DOMParser().parseFromString(pageHtml, "text/xml")
        console.log(pageNode)
        pageNode.childNodes.forEach(function(node) {
            wrapper.appendChild(node)
        })

        documentPane.appendChild(wrapper)
    })
}


function renderGraph(data) {
    const graphPane = document.querySelector('#graph-pane')
    const viz = new Viz();
  
    viz.renderSVGElement(data.graph)
        .then(function(element) {
            graphPane.appendChild(element)
        })
}


function initializeDocument(data) {
    console.log('initializeDocument')

    window.data = data

    renderToc(data)
    renderPages(data)
    renderGraph(data)
}
