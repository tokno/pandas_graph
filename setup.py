# -*- coding: utf-8 -*-
from setuptools import setup, find_packages

try:
    long_description = open("README.md").read()
except IOError:
    long_description = ""

setup(
    name="pandas_graph",
    version="0.0.1",
    description="A pip package",
    license="MIT",
    author="Takuya Okuno",
    packages=find_packages(),
    install_requires=[],
    long_description=long_description,
    classifiers=[
        "Programming Language :: Python",
        "Programming Language :: Python :: 3.9",
    ]
)
