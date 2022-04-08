import pandas_graph as pg

import functions

registry = pg.FunctionRegistry()
registry.collect(functions)

graph = registry.create_graph()
result = graph.execute()

print(result['c_dataframe'])
