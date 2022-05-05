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
            element.setAttribute('data-scale', 1)
            graphContainer.appendChild(element)
        })

    function changeGraphScale(event) {
        const graph = document.querySelector('svg')
        let scale = +graph.getAttribute('data-scale')
    
        const diff = event.deltaY * -0.002;
        scale = scale * (1 + diff)
    
        // scale = Math.min(Math.max(0.05, scale), 1)
    
        graph.style.transform = `scale(${scale})`
        graph.setAttribute('data-scale', scale)
    
        // TODO: マウスカーソルを中心に拡大、縮小させる
    }

    let x = null
    let y = null
        
    function moveGraphPosition(event) {
        const graph = document.querySelector('svg')
        const originalX = +(graph.style.left || '0px').replace('px', '')
        const originalY = +(graph.style.top || '0px').replace('px', '')

        const nextX = originalX + (event.pageX - x)
        const nextY = originalY + (event.pageY - y)

        graph.style.left = `${nextX}px`
        graph.style.top = `${nextY}px`

        // console.log(`x: ${originalX} -> ${nextX}`)
        // console.log(`y: ${originalY} -> ${nextY}`)

        x = event.pageX
        y = event.pageY
    }
        
    graphContainer.addEventListener('wheel', changeGraphScale)
    graphContainer.onmousedown = function(event) {
        console.log(event)
        x = event.clientX
        y = event.clientY

        document.addEventListener('mousemove', moveGraphPosition)
    }
    graphContainer.onmouseup = function() {
        console.log('onmouseup')
        document.removeEventListener('mousemove', moveGraphPosition);
        // graphContainer.onmouseup = null;
    }
}


function initializeDocument(data) {
    console.log('initializeDocument')

    window.data = data

    renderToc(data)
    renderPages(data)
    renderGraph(data)
}
