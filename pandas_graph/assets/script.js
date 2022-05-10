let data = null

function highlightGraphNodes(ids) {
    // 一旦ハイライトを全部消す
    document.querySelectorAll('#graph-container .node.highlight').forEach(function(node) {
        node.classList.remove('highlight')
    })


    document.querySelectorAll('#graph-container .node').forEach(function(node) {
        if (ids.includes(node.getAttribute('data-node-id'))) {
            node.classList.add('highlight')
        }
    })
}


function onTocClick(href) {
    console.log(href)

    const pages = document.querySelectorAll('#document-pane .page')

    pages.forEach(function(page) {
        if (page.getAttribute('data-path') == href) {
            page.classList.remove('inactive')

            const relatedNodeIds = [...page.querySelectorAll('.related-nodes li')].map((node) => node.textContent)
            highlightGraphNodes(relatedNodeIds)
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


function changeGraphScale(scale, pivotX=0, pivotY=0) {
    console.log(`changeGraphScale(${scale}, ${pivotX}, ${pivotY})`)
    const graph = document.querySelector('svg')
    const currentScale = +graph.getAttribute('data-scale')
    // const scaleDelta = -(currentScale - scale)
    const scaleDelta = scale / currentScale - 1
    const { x, y } = getGraphPosition()

    const graphWidthBeforeScale = graph.getBoundingClientRect().width
    const graphHeightBeforeScale = graph.getBoundingClientRect().height

    graph.style.transform = `scale(${scale})`
    graph.setAttribute('data-scale', scale)

    // const graphWidthAftereScale = graph.getBoundingClientRect().width
    // const graphHeightAftereScale = graph.getBoundingClientRect().height

    // console.log(`scaleDelta: ${scaleDelta}`)

    const xPositionDiff = graphWidthBeforeScale * (scaleDelta) / 2
    const yPositionDiff = graphHeightBeforeScale * (scaleDelta) / 2

    setGraphPosition(
        x + xPositionDiff,
        y + yPositionDiff,
    )
}


function initializeGraph(data) {
    // nodeへのclass付与
    document.querySelectorAll('#graph-container svg .node').forEach(function(node) {
        // 楕円で描画されているのは関数、長方形で描画されているのはデータフレーム
        const isFunctionNode = node.querySelector('ellipse')
        const className = isFunctionNode ? 'function-node' : 'dataframe-node'

        node.classList.add(className)

        const title = node.querySelector('title').textContent
        node.setAttribute('data-node-id', title)
    })

    // 表示幅いっぱいに表示されるように調整
    const container = document.querySelector('#graph-container')
    const graph = document.querySelector('#graph-container svg')
    const containerWidth = container.getBoundingClientRect().width
    const containerHeight = container.getBoundingClientRect().height
    const graphWidth = graph.getBoundingClientRect().width
    const graphHeight = graph.getBoundingClientRect().height

    changeGraphScale(Math.min(
        containerWidth / graphWidth,
        containerHeight / graphHeight,
    ))

    // nodeクリック時にオーバーレイを表示
    document.querySelectorAll('#graph-container .function-node').forEach(node => {
        node.addEventListener('click', event => {
            const function_id = node.getAttribute('data-node-id')

            document.querySelector('#function-info-overlay .function-id td').textContent = function_id
            document.querySelector('#function-info-overlay .executeion-time-ms td').textContent = data['result']['function_info'][function_id]['elapsed_ms']
            document.querySelector('#function-info-overlay .source-code pre').textContent = data['functions'][function_id]['code']

            document.querySelector('#function-info-overlay').classList.remove('hidden')
        })
    })

    document.querySelectorAll('#graph-container .dataframe-node').forEach(node => {
        node.addEventListener('click', event => {
            const dataframe_id = node.getAttribute('data-node-id')

            document.querySelector('#dataframe-info-overlay .dataframe-id td').textContent = dataframe_id
            document.querySelector('#dataframe-info-overlay .columns td').textContent = data['result']['dataframe_info'][dataframe_id]['columns']
            document.querySelector('#dataframe-info-overlay .row-count td').textContent = data['result']['dataframe_info'][dataframe_id]['row_count']

            document.querySelector('#dataframe-info-overlay').classList.remove('hidden')
        })
    })
}


function getGraphPosition() {
    const graph = document.querySelector('svg')

    return {
        x: +(graph.style.left || '0px').replace('px', ''),
        y: +(graph.style.top || '0px').replace('px', ''),
    }
}


function setGraphPosition(x, y) {
    console.log(`setGraphPosition(${x}, ${y})`)
    const graph = document.querySelector('svg')

    graph.style.left = `${x}px`
    graph.style.top = `${y}px`
}


function renderGraph(data) {
    const graphContainer = document.querySelector('#graph-container')
    const viz = new Viz();
  
    viz.renderSVGElement(data.graph)
        .then(function(element) {
            element.setAttribute('data-scale', 1)
            graphContainer.appendChild(element)

            initializeGraph(data)
        })

    // 拡大縮小とマウスでの移動
    let prevX = null
    let prevY = null

    function moveGraphPosition(event) {
        const { x, y } = getGraphPosition()

        const nextX = x + (event.pageX - prevX)
        const nextY = y + (event.pageY - prevY)

        setGraphPosition(nextX, nextY)

        prevX = event.pageX
        prevY = event.pageY
    }

    graphContainer.addEventListener('wheel', function(event) {
        const graph = document.querySelector('svg')
        const originalScale = +graph.getAttribute('data-scale')
    
        const scaleDiff = event.deltaY * -0.001;
        const nextScale = originalScale * (1 + scaleDiff)
        console.log(`scaleDiff: ${scaleDiff}`)

        const { x, y } = getGraphPosition()
        const graphWidth = graph.getBoundingClientRect().width
        const graphHeight = graph.getBoundingClientRect().height

        // TODO: 拡大率に上限と下限を設ける
        const pivotX = (event.layerX)
        console.log(`event.layerX: ${event.layerX}, event.layerY: ${event.layerY}`)
    
        changeGraphScale(
            nextScale,
            0,
            0
        )
        // changeGraphScale(
        //     nextScale,
        //     event.layerX,
        //     event.layerY
        // )
    
        // TODO: マウスカーソルを中心に拡大、縮小させる
        const xPositionDiff = graphWidth * (scaleDiff) / 2
        const yPositionDiff = graphHeight * (scaleDiff) / 2

        // setGraphPosition(
        //     x + xPositionDiff,
        //     y + yPositionDiff,
        // )
    })

    graphContainer.onmousedown = function(event) {
        console.log(event)
        prevX = event.clientX
        prevY = event.clientY

        document.addEventListener('mousemove', moveGraphPosition)
    }
    graphContainer.onmouseup = function() {
        document.removeEventListener('mousemove', moveGraphPosition);
    }
}


function initializeDocument(data) {
    console.log('initializeDocument')

    window.data = data

    renderToc(data)
    renderPages(data)
    renderGraph(data)
}

// 画面の初期化
document.querySelector('#function-info-overlay').addEventListener('click', function() {
    this.classList.add('hidden')
})

document.querySelector('#dataframe-info-overlay').addEventListener('click', function() {
    this.classList.add('hidden')
})

document.querySelector('#function-info-overlay .container').addEventListener('click', function(event) {
    event.stopPropagation()
})

document.querySelector('#dataframe-info-overlay .container').addEventListener('click', function(event) {
    event.stopPropagation()
})
