#!/usr/bin/env bash
set -eo pipefail

while getopts f: option
do
 case "${option}"
 in
  o) OPTIMIZER=${OPTARG};;
  l) LOSS=${OPTARG};;
  m) METRICS=${OPTARG};;
 esac
done

CONDA_ENV=live-stream-api

export PROJECT_ROOT="$(dirname "$PWD")"

export CUSTOM_DATASET_PATH="$PROJECT_ROOT"/data/face_recognizer/faces
export HAARCASCADE_DATASET_PATH="$PROJECT_ROOT"/data/haarcascade_frontalface_dataset.xml
export CUSTOM_FACIAL_ENCODINGS_PATH="$PROJECT_ROOT"/data/face_recognizer/facial_encodings
export CUSTOM_FACE_PERSONAL_INFORMATION="$PROJECT_ROOT"/data/face_recognizer/faces.json
export MASK_DETECTOR_TRAINED_MODEL="$PROJECT_ROOT"/data/mask_detector/mask-detector.model
export MASK_DETECTOR_TRAINED_TRANSFER_LEARNING_MODEL="$PROJECT_ROOT"/data/mask_detector/mask_detector_model_vgg.h5
export MASK_DETECTOR_PATH="$PROJECT_ROOT"/data/mask_detector

export PATH=/opt/miniconda3/envs/"$CONDA_ENV"/bin/:$PATH && echo "PATH=$PATH"

# Project environment variables
python "$PROJECT_ROOT"/data/face_recognizer/train.py -o $OPTIMIZER -l $LOSS -m $METRICS
# Example: sh train_facial_recognizer.sh