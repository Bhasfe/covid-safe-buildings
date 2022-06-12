import face_recognition
import pickle
import cv2

mock = {
    "1": {
        "first_name": "Barış",
        "last_name": "Hasdemir",
        "pcr_last_3_days": True,
        "antijen_last_3_days": True,
        "vaccinated": True
    },
    "2": {
        "first_name": "Sıdıka",
        "last_name": "Taşralı",
        "pcr_last_3_days": True,
        "antijen_last_3_days": True,
        "vaccinated": True
    },
    "3": {
        "first_name": "Barış",
        "last_name": "Dede",
        "pcr_last_3_days": True,
        "antijen_last_3_days": True,
        "vaccinated": False
    }
}

dataset_path = '../live_stream_api/data/haarcascade_frontalface_dataset.xml'  # dataset
faceCascade = cv2.CascadeClassifier(dataset_path)

data = pickle.loads(open('../live_stream_api/data/face_enc', "rb").read())

video_capture = cv2.VideoCapture(0)  # 0 for web camera live stream


#  for cctv camera'rtsp://username:password@ip_address:554/user=username_password='password'_channel=channel_number_stream=0.sdp'
#  example of cctv or rtsp: 'rtsp://mamun:123456@101.134.16.117:554/user=mamun_password=123456_channel=1_stream=0.sdp'

def live_stream():
    # Capture frame-by-frame
    global person
    ret, frame = video_capture.read()

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = faceCascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30),
        flags=cv2.CASCADE_SCALE_IMAGE
    )

    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    encodings = face_recognition.face_encodings(rgb)
    names = []

    for encoding in encodings:
        matches = face_recognition.compare_faces(data["encodings"],
                                                 encoding)
        name = "Unknown"
        if True in matches:
            matches = [i for (i, b) in enumerate(matches) if b]
            counts = {}

            for i in matches:

                person = mock[data["ids"][i]]
                name = person["first_name"] + " " + person["last_name"]
                counts[name] = counts.get(name, 0) + 1
            name = max(counts, key=counts.get)

        names.append(name)

    # # Draw a rectangle around the faces
    # for (x, y, w, h) in faces:
    #     cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
    #     cv2.putText(frame, f'Occupancy {len(faces)}', (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)

    for ((x, y, w, h), name) in zip(faces, names):
        cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 3)
        cv2.putText(frame, name, (x, y), cv2.FONT_HERSHEY_SIMPLEX,
                    0.75, (0, 255, 0), 2)
        cv2.putText(frame, f'Occupancy {len(faces)}', (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)

    return cv2.imencode('.jpg', frame)[1].tobytes()
