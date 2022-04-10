from inspect import getmembers, isfunction

from .documentor import Documentor
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
        self.functions = set()

    def add(self, *functions):
        self.functions |= set(functions)

    def create_graph(self):
        return Graph(list(self.functions))

    def collect(self, module):
        self.add(*[
            o
            for (name, o) in getmembers(module)
            if isinstance(o, FunctionDef)
        ])

        return self
