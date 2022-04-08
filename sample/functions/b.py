import pandas as pd
import pandas_graph as pg

@pg.function(
    name='',
    inputs=[],
    outputs=[
        pg.output(
            id='b_dataframe',
            description=''
        )
    ]
)
def b_source():
    return [
        pd.DataFrame([
            [5, 6],
            [7, 8]
        ], columns=['b1', 'b2'])
    ]
