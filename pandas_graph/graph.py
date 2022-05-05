import time
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


class ExecutionResult:
    def __init__(self):
        self.function_info = {}
        self.dataframe_info = {}

    def put_function_info(self, function_id, *, elapsed_ms):
        self.function_info[function_id] = {
            'elapsed_ms': elapsed_ms,
        }

    def put_dataframe_info(self, dataframe_id, *, columns, row_count):
        self.dataframe_info[dataframe_id] = {
            'columns': columns,
            'row_count': row_count,
        }


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

    def execute(self) -> ExecutionResult:
        execution_result = ExecutionResult()
        dataframes = {}  # { <データフレームID>: <データフレーム>, ... }

        for node in list(nx.topological_sort(self.graph)):
            if not isinstance(node, FunctionNode):
                continue

            args = [
                dataframes[input_dataframe_id]
                for input_dataframe_id
                in node.input_dataframe_ids
            ]

            epoch_before_execute = int(time.time() * 1000)
            results = node.execute(*args)
            epoch_after_execute = int(time.time() * 1000)

            execution_result.put_function_info(
                node.id,
                elapsed_ms=epoch_after_execute - epoch_before_execute
            )

            for dataframe_id, dataframe in zip(node.output_dataframe_ids, results):
                dataframes[dataframe_id] = dataframe
                execution_result.put_dataframe_info(
                    dataframe_id,
                    columns=list(dataframe.columns),
                    row_count=len(dataframe.index)
                )

        return execution_result
