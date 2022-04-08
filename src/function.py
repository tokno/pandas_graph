import inspect


class FunctionDef:
    """
    """

    def __init__(self, name, inputs, outputs):
        self.name = name
        self.inputs = inputs
        self.outputs = outputs

    def __call__(self, *dataframes):
        return self.func(*dataframes)

    def __str__(self):
        input_ids = [input.id for input in self.inputs]
        output_ids = [output.id for output in self.outputs]

        return f"FunctionDef: {self.name}([{', '.join(input_ids)}] -> [{', '.join(output_ids)}])"

    def wrap(self, func):
        self.func = func
        self.docstring = func.__doc__
        self.code = inspect.getsource(func)

        return self

    @property
    def id(self):
        return f"{self.func.__module__}.{self.func.__name__}"


class InputDataframeDef:
    def __init__(self, id):
        self.id = id


class OutputDataframeDef:
    def __init__(self, id, description):
        self.id = id
        self.description = description
