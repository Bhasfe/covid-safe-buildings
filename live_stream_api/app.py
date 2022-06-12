from utils.camera_utils import LiveStreamUnprocessed
from flask import Flask, Response, render_template
from processing.live_stream import LiveStream
from flask_jwt_extended import JWTManager
from utils.api_utils import ApiUtils
from flask_restful import Api
from dotenv import load_dotenv
from flask_cors import CORS
import os
import logging

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.secret_key = os.getenv("API_SECRET_KEY")

api = Api(app)
jwt = JWTManager(app)


@app.route('/building/<int:building_id>/room/<int:room_id>/camera/<int:camera_id>/live_stream')
def live_stream(building_id, room_id, camera_id):
    return render_template('live_stream.html', camera_id=camera_id, building_id=building_id, room_id=room_id)


@app.route('/building/<int:building_id>/room/<int:room_id>/camera/<int:camera_id>/live_stream_raw')
def live_stream_raw(building_id, room_id, camera_id):
    token = ApiUtils.get_access_token()
    ip_address = ApiUtils.get_camera_ip(building_id=building_id, room_id=room_id, camera_id=camera_id, token=token)
    if not ip_address:
        return {'message': 'Camera not found'}, 404

    live = LiveStream(building_id=building_id, room_id=room_id, ip_address=ip_address)
    return Response(live.generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/building/<int:building_id>/room/<int:room_id>/camera/<int:camera_id>/live_stream_unprocessed')
def live_stream_unprocessed(building_id, room_id, camera_id):
    return render_template('live_stream_unprocessed.html', camera_id=camera_id, building_id=building_id,
                           room_id=room_id)


@app.route('/building/<int:building_id>/room/<int:room_id>/camera/<int:camera_id>/live_stream_unprocessed_raw')
def live_stream_unprocessed_raw(building_id, room_id, camera_id):
    token = ApiUtils.get_access_token()
    ip_address = ApiUtils.get_camera_ip(building_id=building_id, room_id=room_id, camera_id=camera_id, token=token)
    if not ip_address:
        return {'message': 'Camera not found'}, 404

    live = LiveStreamUnprocessed(building_id=building_id, room_id=room_id, ip_address=ip_address)
    return Response(live.generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')


if __name__ == "__main__":
    from db import db

    logging.basicConfig(
        format='%(asctime)s - %(process)d - %(levelname)s : %(message)s', level=logging.INFO)

    db.init_app(app)
    app.run(host=os.getenv("LIVE_STREAM_API_HOST"),
            port=os.getenv("LIVE_STREAM_API_PORT"),
            debug=os.getenv("DEBUG_MODE"),
            threaded=True
            )
