from .graph import Graph
from .function import FunctionDef, InputDataframeDef, OutputDataframeDef


def function(*, name, inputs=[], outputs=[]):
    function_def = FunctionDef(name, inputs, outputs)
    return function_def.wrap


def input(*, id):
    return InputDataframeDef(id)


def output(*, id, description):
    return OutputDataframeDef(id, description)


class FunctionRegistry:
    def __init__(self):
        self.functions = []

    def add(self, *functions):
        self.functions += functions

    def create_graph(self):
        return Graph(self.functions)
