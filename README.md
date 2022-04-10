# pandas_graph
Pandasを使った計算プログラムをメンテナンスしやすくするためのライブラリ。

このライブラリでは関数とデータフレームのグラフとして計算プログラムを構築する。
関数は0個以上のデータフレームを入力に取り0個以上のデータフレームを出力する。

関数間の依存関係はライブラリが解決する。

![doc/sample.svg](doc/sample.svg)

# インストール方法
```bash
pip install git+https://github.com/tokno/pandas_graph.git
```

# 使い方
## 関数の定義
```python
import pandas as pd
import pandas_graph as pg

@pg.function(
    name='データフレームaを作る関数',
    inputs=[],
    outputs=[
        pg.output(
            id='a_dataframe',
            description=''
        )
    ]
)
def a_source():
    return [
        pd.DataFrame([
            [1, 2],
            [3, 4]
        ], columns=['a1', 'a2'])
    ]
```

## 実行
```python
import pandas_graph as pg

registry = pg.FunctionRegistry()
registry.add(a_source)

graph = registry.create_graph()
result = graph.execute()
```

## ドキュメントの生成
```python
graph = registry.create_graph()
pg.Documentor().generate_document(graph, "path/to/markdown", "path/to/output")
```
