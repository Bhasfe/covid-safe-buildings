from threading import Thread
import pickle
import keras
import time
import cv2
import os
from dotenv import load_dotenv

load_dotenv()

custom_facial_encodings = pickle.loads(open(os.getenv("CUSTOM_FACIAL_ENCODINGS_PATH"), "rb").read())
model = keras.models.load_model(os.getenv("MASK_DETECTOR_TRAINED_TRANSFER_LEARNING_MODEL"))
face_cascade = cv2.CascadeClassifier(os.getenv("HAARCASCADE_DATASET_PATH"))


class ThreadedLiveStream(object):
    def __init__(self, fps=60, ip_address=0):
        self.capture = cv2.VideoCapture(ip_address)
        self.capture.set(cv2.CAP_PROP_BUFFERSIZE, 5)

        # FPS = 1/X  (X = desired FPS)
        self.FPS = 1 / fps
        self.FPS_MS = int(self.FPS * 1000)

        self.thread = Thread(target=self.update, args=())
        self.thread.daemon = True
        self.thread.start()
        time.sleep(2)

    def update(self):
        while True:
            if self.capture.isOpened():
                (self.status, self.frame) = self.capture.read()
            time.sleep(self.FPS)

    def get_frame(self):
        return self.frame


class LiveStreamUnprocessed:
    def __init__(self, building_id, room_id, ip_address: str):
        self.building_id: int = building_id
        self.room_id: int = room_id
        self.ip_address: str = ip_address

    def live_stream(self, frame) -> bytes:
        """Processing the given ip camera feed and recognize faces"""

        return cv2.imencode('.jpg', frame)[1].tobytes()

    def generate_frames(self):
        """Yields the frames"""

        ip_address = 0 if type(self.ip_address) != int else self.ip_address
        tls = ThreadedLiveStream(
            fps=100,
            ip_address=ip_address
        )

        while True:
            try:
                frame = tls.get_frame()
                frame = self.live_stream(frame)
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n'
                       + frame + b'\r\n'
                       )
            except AttributeError:
                pass
