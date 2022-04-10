import pandas as pd
import pandas_graph as pg

@pg.function(
    name='データフレームaとbからcを作る関数',
    inputs=[
        pg.input(id='a_dataframe'),
        pg.input(id='b_dataframe'),
    ],
    outputs=[
        pg.output(
            id='c_dataframe',
            description=''
        ),
    ]
)
def create_c(a_dataframe, b_dataframe):
    return [
        pd.merge(a_dataframe, b_dataframe, left_index=True, right_index=True),
    ]
