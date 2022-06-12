from dotenv import load_dotenv
from imutils import paths
import face_recognition
import logging
import pickle
import cv2
import os

load_dotenv()


class FaceRecognitionTrain:
    def __init__(self):
        self.face_encodings = []
        self.face_ids = []

    def generate_encodings(self):
        for (i, path) in enumerate(list(paths.list_images(f'{os.getenv("PROJECT_ROOT")}/data/face_recognizer/faces'))):
            face_id = path.split(os.path.sep)[-2]
            logging.info(f"Training id {face_id}")

            rgb = cv2.cvtColor(cv2.imread(path), cv2.COLOR_BGR2RGB)

            boxes = face_recognition.face_locations(rgb, model='hog')
            encodings = face_recognition.face_encodings(rgb, boxes)
            for encoding in encodings:
                self.face_encodings.append(encoding)
                self.face_ids.append(face_id)

    def train(self):
        self.generate_encodings()
        with open(f'{os.getenv("PROJECT_ROOT")}/data/face_recognizer/facial_encodings', "wb") as output:
            output.write(pickle.dumps({"encodings": self.face_encodings, "face_ids": self.face_ids}))


if __name__ == '__main__':
    logging.basicConfig(
        format='%(asctime)s - %(process)d - %(levelname)s : %(message)s', level=logging.INFO)
    frt = FaceRecognitionTrain()
    logging.info("Training started!")
    frt.train()
    logging.info("Encodings saved to ./facial_encodings!\nFinished!")
