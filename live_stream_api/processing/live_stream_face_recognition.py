from dotenv import load_dotenv
from typing import NoReturn
import face_recognition
import argparse
import logging
import pickle
import os
import cv2
import sys

load_dotenv()

custom_facial_encodings = pickle.loads(open(os.getenv("CUSTOM_FACIAL_ENCODINGS_PATH"), "rb").read())
face_cascade = cv2.CascadeClassifier(os.getenv("HAARCASCADE_DATASET_PATH"))


class LiveStreamFaceRecognition:
    def __init__(self, building_id, room_id, ip_address: str):
        self.building_id: int = building_id
        self.room_id: int = room_id
        self.ip_address: str = ip_address
        self.capacity: int = 0
        self.occupancy: int = 0

        self.tls = ThreadedLiveStream(
            fps=100,
            ip_address=0 if type(self.ip_address) != int else self.ip_address
        )

    def run(self) -> NoReturn:
        """Processing the given ip camera feed and recognize faces"""

        while True:
            frame = self.tls.get_frame()
            resized = cv2.resize(frame, (frame.shape[1] // 4, frame.shape[0] // 4))
            faces = face_cascade.detectMultiScale(
                resized,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(30, 30),
                flags=cv2.CASCADE_SCALE_IMAGE
            )

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

                logging.info(guests[name])

                ApiUtils.update_statistics(
                    building_id=self.building_id,
                    room_id=self.room_id,
                    occupancy=self.occupancy,
                    guests=guests
                )
                # Annotations
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 225, 0), 2)
                cv2.putText(frame, name, (x, y - 20), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (255, 255, 255), 2)
            cv2.putText(frame, f'Occupancy {len(faces)}', (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)
            if frame is not None:
                cv2.imshow(f'Building Id: {self.building_id} Room Id: {self.room_id} Live Stream', frame)
            key = cv2.waitKey(10)

            # Finish when press on escape
            if key == 27:
                break

        # Close all windows
        cv2.destroyAllWindows()


if __name__ == '__main__':
    # If the class is imported, import sibling package
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    sys.path.append(os.path.abspath('..'))

    from utils.camera_utils import ThreadedLiveStream
    from utils.api_utils import ApiUtils

    parser = argparse.ArgumentParser(description='Process the command line arguments.')
    parser.add_argument('-b', '--building_id', default=None, help='Building id')
    parser.add_argument('-r', '--room_id', default=None, help='Room id')
    parser.add_argument('-i', '--ip_address', default=None, help='Camera Ip address')

    args = parser.parse_args()

    LiveStreamFaceRecognition(
        building_id=args.building_id,
        room_id=args.room_id
        , ip_address=args.ip_address) \
        .run()
