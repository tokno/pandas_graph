class Documentor:
    def generate_document(self, graph, markdown_source_path, output_path):
        agraph = graph.to_agraph()
        print(agraph)
