import pandas as pd
import pandas_graph as pg

@pg.function(
    name='',
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
