import pandas as pd
import pandas_graph as pg

@pg.function(
    name='データフレームaとbからcを作る関数',
    inputs=[
        pg.input(id='dataframe_a'),
        pg.input(id='dataframe_b'),
    ],
    outputs=[
        pg.output(
            id='dataframe_c',
            description=''
        ),
    ]
)
def create_c(dataframe_a, dataframe_b):
    return [
        pd.merge(dataframe_a, dataframe_b, left_index=True, right_index=True),
    ]
