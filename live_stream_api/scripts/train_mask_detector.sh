#!/usr/bin/env bash
set -eo pipefail

while getopts o:l:m:e: option
do
 case "${option}"
 in
  o) OPTIMIZER=${OPTARG};;
  l) LOSS=${OPTARG};;
  m) METRICS=${OPTARG};;
  e) EPOCHS=${OPTARG};;
 esac
done

CONDA_ENV=live_stream_api

export PATH=/opt/miniconda3/envs/"$CONDA_ENV"/bin/:$PATH && echo "PATH=$PATH"

# Project environment variables
export PROJECT_ROOT="$(dirname "$PWD")"
export CUSTOM_DATASET_PATH="$PROJECT_ROOT"/data/face_recognizer/faces
export HAARCASCADE_DATASET_PATH="$PROJECT_ROOT"/data/haarcascade_frontalface_dataset.xml
export CUSTOM_FACIAL_ENCODINGS_PATH="$PROJECT_ROOT"/data/face_recognizer/facial_encodings
export CUSTOM_FACE_PERSONAL_INFORMATION="$PROJECT_ROOT"/data/face_recognizer/faces.json
export MASK_DETECTOR_TRAINED_MODEL="$PROJECT_ROOT"/data/mask_detector/mask-detector.model
export MASK_DETECTOR_TRAINED_TRANSFER_LEARNING_MODEL="$PROJECT_ROOT"/data/mask_detector/mask_detector_model_vgg.h5
export MASK_DETECTOR_PATH="$PROJECT_ROOT"/data/mask_detector

python "$PROJECT_ROOT"/data/mask_detector/train_vgg.py -o $OPTIMIZER -l $LOSS -m $METRICS -e $EPOCHS
# Example: sh train_mask_detector.sh -o adam -l categorical_crossentropy -m acc -e 20