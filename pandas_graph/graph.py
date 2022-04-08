import networkx as nx


class Node:
    def __init__(self, id):
        self.id = id


class FunctionNode(Node):
    def __init__(self, function_def):
        super().__init__(function_def.id)
        self.function_def = function_def

    def __str__(self):
        return self.id

    @property
    def input_dataframe_ids(self):
        return [
            dataframe_def.id
            for dataframe_def
            in self.function_def.inputs
        ]

    @property
    def output_dataframe_ids(self):
        return [
            dataframe_def.id
            for dataframe_def
            in self.function_def.outputs
        ]

    def execute(self, *args):
        return self.function_def(*args)


class DataframeNode(Node):
    def __init__(self, dataframe_def):
        super().__init__(dataframe_def.id)

    def __str__(self):
        return self.id


class Graph:
    def __init__(self, functions):
        self.functions = functions
        self.graph = nx.DiGraph()

        function_nodes = {}  # { <関数ID>: <FunctionDef>, ... }
        dataframe_nodes = {}  # { <データフレームID>: <DataframeNode>, ... }

        # ノードを生成
        for function_def in self.functions:
            function_node = FunctionNode(function_def)
            function_nodes[function_def.id] = function_node

            self.graph.add_node(function_node)
            self.graph.nodes[function_node]["label"] = function_def.name
            self.graph.nodes[function_node]["shape"] = "ellipse"

            for output_def in function_def.outputs:
                dataframe_node = DataframeNode(output_def)
                dataframe_nodes[output_def.id] = dataframe_node

                self.graph.add_node(dataframe_node)
                self.graph.nodes[dataframe_node]["shape"] = "box"

        # ノードの関連を設定
        for function_def in self.functions:
            function_node = function_nodes[function_def.id]

            for output_def in function_def.outputs:
                self.graph.add_edge(function_node, dataframe_nodes[output_def.id])

            for input_def in function_def.inputs:
                self.graph.add_edge(dataframe_nodes[input_def.id], function_node)

    def to_agraph(self):
        return nx.nx_agraph.to_agraph(self.graph)

    def execute(self):
        dataframes = {}  # { <データフレームID>: <データフレーム>, ... }

        for node in list(nx.topological_sort(self.graph)):
            if not isinstance(node, FunctionNode):
                continue

            args = [
                dataframes[input_dataframe_id]
                for input_dataframe_id
                in node.input_dataframe_ids
            ]

            results = node.execute(*args)

            for dataframe_id, dataframe in zip(node.output_dataframe_ids, results):
                dataframes[dataframe_id] = dataframe

        return dataframes
