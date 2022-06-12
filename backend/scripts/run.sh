#!/usr/bin/env bash

export PROJECT_ROOT="$(dirname "$PWD")"
export DATABASE_URI=sqlite:"$PROJECT_ROOT"/database.db
export PORT=5000

set -o allexport
source "$PROJECT_ROOT"/.env
set +o allexport

CONDA_ENV=covid_safe_buildings_backend
export PATH=/opt/miniconda3/envs/"$CONDA_ENV"/bin/:$PATH && echo "PATH=$PATH"

python "$PROJECT_ROOT"/app.py

