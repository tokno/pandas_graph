import json
import glob
import os
import shutil


class Document:
    @classmethod
    def generate_document(cls, graph, execution_result, markdown_source_path, output_path):
        module_root = os.path.dirname(os.path.realpath(__file__))

        data = {
            'graph': None,
            'result': {
                'function_info': {},
                'dataframe_info': {},
            },
            'functions': {},
            'toc': None,
            'pages': {},
        }

        data['graph'] = str(graph.to_agraph())
        data['result']['function_info'] = execution_result.function_info
        data['result']['dataframe_info'] = execution_result.dataframe_info

        # add function
        for func in graph.functions:
            data['functions'][func.id] = {
                'code': func.code,
            }

        # add toc.md
        with open(f'{markdown_source_path}/toc.md', 'r', encoding='utf-8') as f:
            data['toc'] = f.read()

        # add *.md
        for abs_path in glob.glob(f'{markdown_source_path}/**/*.md', recursive=True):
            path = abs_path[len(markdown_source_path) + 1:]

            with open(f'{markdown_source_path}/{path}', 'r', encoding='utf-8') as f:
                data['pages'][path] = f.read()

        os.makedirs(output_path, exist_ok=True)

        if os.path.exists(f'{output_path}/doc'):
            shutil.rmtree(f'{output_path}/doc')

        shutil.copytree(f'{module_root}/assets/', f'{output_path}/doc')

        with open(f'{output_path}/doc/data.jsonp', 'w', encoding='utf-8') as f:
            f.write(f'''
            initializeDocument(
                {json.dumps(data)}
            )
            ''')
