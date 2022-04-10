import pandas as pd
import pandas_graph as pg

@pg.function(
    name='データフレームaを作る関数',
    inputs=[],
    outputs=[
        pg.output(
            id='dataframe_a',
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
