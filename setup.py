# -*- coding: utf-8 -*-
import os
from setuptools import setup, find_packages

def load_requires_from_file(fname):
    if not os.path.exists(fname):
        raise IOError(fname)
    return [pkg.strip() for pkg in open(fname, 'r')]

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
    install_requires=load_requires_from_file('requirements.txt'),
    long_description=long_description,
    classifiers=[
        "Programming Language :: Python",
        "Programming Language :: Python :: 3.9",
    ],
    package_data={
        "": ["assets/*", "assets/lib/*"],
    },
)
