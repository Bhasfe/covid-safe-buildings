from dotenv import load_dotenv
from tensorflow import keras
from typing import NoReturn
import numpy as np
import argparse
import logging
import pickle
import os
import cv2
import sys

load_dotenv()

custom_facial_encodings = pickle.loads(open(os.getenv("CUSTOM_FACIAL_ENCODINGS_PATH"), "rb").read())
model = keras.models.load_model(os.getenv("MASK_DETECTOR_TRAINED_TRANSFER_LEARNING_MODEL"))
face_cascade = cv2.CascadeClassifier(os.getenv("HAARCASCADE_DATASET_PATH"))


class LiveStreamMaskDetection:
    def __init__(self, building_id, room_id, ip_address: str):
        self.building_id: int = building_id
        self.room_id: int = room_id
        self.ip_address: str = ip_address
        self.capacity: int = 0
        self.occupancy: int = 0
        self.tags = {
            0: ('Mask: Ok', (0, 255, 0)),
            1: ('No Mask    ', (0, 0, 255))
        }

        self.tls = ThreadedLiveStream(
            fps=60,
            ip_address=0 if type(self.ip_address) != int else self.ip_address
        )

    def run(self) -> NoReturn:
        """Processing the given ip camera feed and recognize faces"""

        while True:
            frame = self.tls.get_frame()
            frame = cv2.flip(frame, 1, 1)
            faces = face_cascade.detectMultiScale(frame)

            rgb_color = cv2.cvtColor(frame, cv2.COLOR_RGB2BGR)
            for x, y, w, h in faces:
                crop = rgb_color[y:y + h, x:x + w]
                crop = cv2.resize(crop, (128, 128))
                crop = np.reshape(crop, [1, 128, 128, 3]) / 255.0
                mask_result = model.predict(crop)
                prediction = mask_result.argmax()

                # Annotations
                cv2.rectangle(frame, (x, y), (x + w, y + h), self.tags[prediction][1], 2)
                cv2.rectangle(frame, (x, y - 60), (x + w, y), self.tags[prediction][1], -1)
                cv2.putText(frame, self.tags[prediction][0], (x, y - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8,
                            (255, 255, 255), 2)

            if frame is not None:
                cv2.imshow(f'Building Id: {self.building_id} Room Id: {self.room_id} Live Stream', frame)
            key = cv2.waitKey(10)

            # Finish when press on escape
            if key == 27:
                break

        # Stop video
        webcam.release()

        # Close all windows
        cv2.destroyAllWindows()


if __name__ == '__main__':
    # If the class is imported, import sibling package
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    sys.path.append(os.path.abspath('..'))

    from utils.camera_utils import ThreadedLiveStream

    parser = argparse.ArgumentParser(description='Process the command line arguments.')
    parser.add_argument('-b', '--building_id', default=None, help='Building id')
    parser.add_argument('-r', '--room_id', default=None, help='Room id')
    parser.add_argument('-i', '--ip_address', default=None, help='Camera Ip address')

    args = parser.parse_args()

    LiveStreamMaskDetection(
        building_id=args.building_id,
        room_id=args.room_id
        , ip_address=args.ip_address) \
        .run()
