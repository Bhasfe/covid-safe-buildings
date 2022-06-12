from keras.preprocessing.image import ImageDataGenerator
from keras.applications.vgg19 import preprocess_input
from keras.applications.vgg19 import VGG19
from keras.layers import Flatten, Dense
from keras.utils import plot_model
from dotenv import load_dotenv
from keras import Sequential
from typing import List
import argparse
import logging
import os

load_dotenv()


class TrainMaskDetectorWithVGG:
    def __init__(self, optimizer: str, loss_function: str, metrics: List[str], epochs: int = 20):
        self.model: Sequential = self._get_model(optimizer, loss_function, metrics)
        self.epochs = epochs

    @classmethod
    def _get_model(cls, optimizer: str, loss_function: str, metrics: List[str]) -> Sequential:
        """Builds and returns a neural network"""

        vgg19 = VGG19(weights='imagenet', include_top=False, input_shape=(128, 128, 3))

        for layer in vgg19.layers:
            layer.trainable = False

        model = Sequential()
        model.add(vgg19)
        model.add(Flatten())
        model.add(Dense(2, activation='sigmoid'))
        model.summary()

        plot_model(model,
                   to_file=f'{os.getenv("MASK_DETECTOR_PATH")}/mask_detector_model.png',
                   show_shapes=True,
                   show_dtype=True
                   )

        model.compile(optimizer=optimizer, loss=loss_function, metrics=metrics)

        return model

    @classmethod
    def get_image_generators(cls):
        """Creates and returns the image generators"""

        train_datagen = ImageDataGenerator(rescale=1.0 / 255, horizontal_flip=True, zoom_range=0.2, shear_range=0.2)
        train_generator = train_datagen.flow_from_directory(
            directory=f'{os.getenv("MASK_DETECTOR_PATH")}/dataset/Train', target_size=(128, 128),
            class_mode='categorical', batch_size=32)

        val_datagen = ImageDataGenerator(rescale=1.0 / 255)
        val_generator = val_datagen.flow_from_directory(
            directory=f'{os.getenv("MASK_DETECTOR_PATH")}/dataset/Validation', target_size=(128, 128),
            class_mode='categorical',
            batch_size=32)

        test_datagen = ImageDataGenerator(rescale=1.0 / 255)
        test_generator = test_datagen.flow_from_directory(directory=f'{os.getenv("MASK_DETECTOR_PATH")}/dataset/Test',
                                                          target_size=(128, 128),
                                                          class_mode='categorical',
                                                          batch_size=32)

        return train_generator, val_generator, test_generator

    def train(self):
        train_generator, val_generator, test_generator = self.get_image_generators()

        history = self.model.fit_generator(generator=train_generator,
                                           steps_per_epoch=len(train_generator) // 32,
                                           epochs=20, validation_data=val_generator,
                                           validation_steps=len(val_generator) // 32)

        self.model.save(f'{os.getenv("MASK_DETECTOR_PATH")}/mask_detector_model_vgg.h5')


if __name__ == '__main__':
    logging.basicConfig(
        format='%(asctime)s - %(process)d - %(levelname)s : %(message)s', level=logging.INFO)

    parser = argparse.ArgumentParser(description='Process the command line arguments.')
    parser.add_argument('-o', '--optimizer', default=None, help='Model optimizer')
    parser.add_argument('-l', '--loss', default=None, help='Model loss function')
    parser.add_argument('-m', '--metrics', default=None, help='Model metrics')
    parser.add_argument('-e', '--epochs', default=None, help='Number of epochs')

    args = parser.parse_args()

    tmd = TrainMaskDetectorWithVGG(
        optimizer=args.optimizer,
        loss_function=args.loss,
        metrics=args.metrics.split(","),
        epochs=int(args.epochs)
    )

    tmd.train()
    #tmd._get_model(optimizer=args.optimizer, loss_function=args.loss, metrics=args.metrics.split(","))
    logging.info("Best model saved to mask-detector.model")
