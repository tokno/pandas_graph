import os

import pandas_graph as pg

import functions

registry = pg.FunctionRegistry()
registry.collect(functions)

graph = registry.create_graph()
result = graph.execute()

base_dir = os.path.dirname(os.path.realpath(__file__))
pg.Document.generate_document(graph, result, f"{base_dir}/doc", f"{base_dir}/out")
