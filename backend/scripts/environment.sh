#!/usr/bin/env bash

CONDA_ENV_NAME=covid_safe_buildings_backend

echo "CONDA_ENV_NAME:"$CONDA_ENV_NAME

if [ -z $CONDA_PREFIX]
then
  echo "Error: Could not find conda!"
  exit 1

if [ -z $CONDA_ENV_HOME ]
then
    CONDA_ENV_BIN=$CONDA_PREFIX
    echo -e "CONDA_ENV_BIN:$CONDA_ENV_BIN\n"
    conda env create -f environment.yml
else
    CONDA_ENV_BIN=$CONDA_ENV_HOME/../bin
    echo -e "CONDA_ENV_BIN:$CONDA_ENV_BIN\n"
    $CONDA_ENV_BIN/conda-env update --name $CONDA_ENV_NAME -f ../environment.yml --prune
fi




