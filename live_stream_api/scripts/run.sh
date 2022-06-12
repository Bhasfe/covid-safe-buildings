#!/usr/bin/env bash

export PROJECT_ROOT="$(dirname "$PWD")"
export CUSTOM_DATASET_PATH="$PROJECT_ROOT"/data/face_recognizer/faces
export HAARCASCADE_DATASET_PATH="$PROJECT_ROOT"/data/haarcascade_frontalface_dataset.xml
export CUSTOM_FACIAL_ENCODINGS_PATH="$PROJECT_ROOT"/data/face_recognizer/facial_encodings
export CUSTOM_FACE_PERSONAL_INFORMATION="$PROJECT_ROOT"/data/face_recognizer/faces.json
export MASK_DETECTOR_TRAINED_MODEL="$PROJECT_ROOT"/data/mask_detector/mask-detector.model
export MASK_DETECTOR_TRAINED_TRANSFER_LEARNING_MODEL="$PROJECT_ROOT"/data/mask_detector/mask_detector_model_vgg.h5
export MASK_DETECTOR_PATH="$PROJECT_ROOT"/data/mask_detector

export DATABASE_URI=sqlite:////Users/barishasdemir/live_stream/data.db

export LIVE_STREAM_API_HOST=0.0.0.0
export LIVE_STREAM_API_PORT=5002

export ADMIN_PASSWORD=admin
export ADMIN_EMAIL=admin@admin.com

export APP_BACKEND_HOST=127.0.0.1
export APP_BACKEND_PORT=5000

CONDA_ENV=live-stream-api
PROJECT_ROOT="$(dirname "$PWD")"
export PATH=/opt/miniconda3/envs/"$CONDA_ENV"/bin/:$PATH && echo "PATH=$PATH"

python "$PROJECT_ROOT"/app.py

