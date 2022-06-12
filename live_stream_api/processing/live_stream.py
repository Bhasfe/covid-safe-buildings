from utils.api_utils import ApiUtils
from utils.camera_utils import ThreadedLiveStream
from keras.models import load_model
from dotenv import load_dotenv
import face_recognition
import numpy as np
import logging
import pickle
import os
import cv2
import keras

load_dotenv()

custom_facial_encodings = pickle.loads(open(os.getenv("CUSTOM_FACIAL_ENCODINGS_PATH"), "rb").read())
face_cascade = cv2.CascadeClassifier(os.getenv("HAARCASCADE_DATASET_PATH"))
model = keras.models.load_model(os.getenv("MASK_DETECTOR_TRAINED_TRANSFER_LEARNING_MODEL"))


class LiveStream:
    def __init__(self, building_id, room_id, ip_address: str):
        self.building_id: int = building_id
        self.room_id: int = room_id
        self.ip_address: str = ip_address
        self.capacity: int = 0
        self.occupancy: int = 0
        self.tags = {
            0: ('No Mask', (0, 0, 255)),
            1: ('Mask: Ok', (0, 255, 0))
        }

    def live_stream(self, frame) -> bytes:
        """Processing the given ip camera feed and recognize faces"""

        frame = cv2.flip(frame, 1, 1)
        faces = face_cascade.detectMultiScale(frame)

        # Update the occupancy
        self.occupancy = len(faces)

        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        encodings = face_recognition.face_encodings(rgb)
        names = []
        guests = {}

        # Loop over the custom facial encodings and compare with the detected face
        for encoding in encodings:
            matches = face_recognition.compare_faces(custom_facial_encodings["encodings"],
                                                     encoding)
            name = "unknown"
            temp_guest = {}
            if True in matches:
                matches = [i for (i, b) in enumerate(matches) if b]
                counts = {}

                for i in matches:
                    user_info = ApiUtils.get_user_information(i)
                    if user_info:
                        name = user_info["first_name"] + " " + user_info["last_name"]
                        counts[name] = counts.get(name, 0) + 1
                        temp_guest[name] = user_info
                    else:
                        counts[name] = counts.get("unknown", 0) + 1
                        temp_guest[name] = None
                name = max(counts, key=counts.get)

            if name != 'unknown':
                guests[name] = temp_guest[name]
            else:
                guests[name] = None
            names.append(name)
            logging.info(name)

        for ((x, y, w, h), name) in zip(faces, names):
            # Multiply with 4 because we reduced the size with factor 4 to process fast
            (x, y, w, h) = (x * 4, y * 4, w * 4, h * 4)

            # Resize the frame and use trained neural network to detect mask
            resized = cv2.resize(frame[y:y + h, x:x + w], (150, 150))
            reshaped = np.vstack([np.reshape(resized / 255.0, (1, 150, 150, 3))])
            prediction = model.predict(reshaped)
            label = np.argmax(prediction, axis=1)[0]

            if name != "unknown":
                guests[name]["has_mask"] = label
                logging.info(guests[name])

            ApiUtils.update_statistics(
                building_id=self.building_id,
                room_id=self.room_id,
                occupancy=self.occupancy,
                guests=guests
            )

            # Annotations
            cv2.rectangle(frame, (x, y), (x + w, y + h), self.tags[label][1], 2)
            cv2.rectangle(frame, (x, y - 60), (x + w, y), self.tags[label][1], -1)
            cv2.putText(frame, self.tags[label][0], (x, y - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
            cv2.putText(frame, name, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 2)

        cv2.putText(frame, f'Occupancy {len(faces)}', (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)

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
