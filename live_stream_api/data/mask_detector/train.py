import os
from typing import List, NoReturn
from keras.preprocessing.image import ImageDataGenerator
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, \
    Dropout
from keras.callbacks import ModelCheckpoint
from keras.utils import plot_model
import argparse
import logging


class TrainMaskDetector():
    def __init__(self, optimizer: str, loss_function: str, metrics: List[str], epochs: int = 5):
        self.model: Sequential = self._get_model(optimizer, loss_function, metrics)
        self.epochs = epochs

    @staticmethod
    def _get_model(optimizer: str, loss_function: str, metrics: List[str]) -> Sequential:
        """Builds and returns a neural network with the given parameters"""

        model = Sequential()
        model.add(Conv2D(100, (3, 3), activation='relu', input_shape=(150, 150, 3)))
        model.add(MaxPooling2D(2, 2))
        model.add(Conv2D(100, (3, 3), activation='relu'))
        model.add(MaxPooling2D(2, 2))
        model.add(Flatten())
        model.add(Dropout(0.5))
        model.add(Dense(50, activation='relu'))
        model.add(Dense(2, activation='softmax'))
        model.compile(optimizer=optimizer, loss=loss_function, metrics=metrics)

        # Print Model Summary
        model.summary()

        # Save neural network architecture as png
        plot_model(model,
                   to_file=f'{os.getenv("MASK_DETECTOR_PATH")}/mask_detector_model.png',
                   show_shapes=True,
                   show_dtype=True
                   )
        return model

    @staticmethod
    def get_data_generators():
        """Apply Data Augmentation to generate new data to increase dataset"""

        train_data_genarator = ImageDataGenerator(
            rescale=1.0 / 255,
            rotation_range=45,
            width_shift_range=0.2,
            height_shift_range=0.2,
            shear_range=0.2,
            zoom_range=0.2,
            horizontal_flip=True,
            fill_mode='nearest'
        )
        train_generator = train_data_genarator.flow_from_directory(f"{os.getenv('MASK_DETECTOR_PATH')}/dataset/train",
                                                                   batch_size=5,
                                                                   target_size=(150, 150))

        validation_datagen = ImageDataGenerator(
            rescale=1.0 / 255,
            rotation_range=45,
            width_shift_range=0.2,
            height_shift_range=0.2,
            shear_range=0.2,
            zoom_range=0.2,
        )
        validation_generator = validation_datagen.flow_from_directory(f"{os.getenv('MASK_DETECTOR_PATH')}/dataset/test",
                                                                      batch_size=5,
                                                                      target_size=(150, 150))

        return train_generator, validation_generator

    @staticmethod
    def get_checkpoint() -> ModelCheckpoint:
        """Returns the model check point"""

        checkpoint = ModelCheckpoint(f'{os.getenv("MASK_DETECTOR_PATH")}/mask-detector.model',
                                     monitor='val_loss',
                                     verbose=1,
                                     save_best_only=True,
                                     mode='auto')

        return checkpoint

    def train(self):
        logging.info("Data generating...")
        train_generator, validation_generator = self.get_data_generators()

        logging.info("Training...")
        checkpoint = self.get_checkpoint()
        history = self.model.fit_generator(
            train_generator,
            epochs=self.epochs,
            validation_data=validation_generator,
            callbacks=[checkpoint]
        )


if __name__ == '__main__':
    logging.basicConfig(
        format='%(asctime)s - %(process)d - %(levelname)s : %(message)s', level=logging.INFO)

    parser = argparse.ArgumentParser(description='Process the command line arguments.')
    parser.add_argument('-o', '--optimizer', default=None, help='Model optimizer')
    parser.add_argument('-l', '--loss', default=None, help='Model loss function')
    parser.add_argument('-m', '--metrics', default=None, help='Model metrics')
    parser.add_argument('-e', '--epochs', default=None, help='Number of epochs')

    args = parser.parse_args()

    tmd = TrainMaskDetector(
        optimizer=args.optimizer,
        loss_function=args.loss,
        metrics=args.metrics.split(","),
        epochs=int(args.epochs)
    )

    tmd.train()
    logging.info("Best model saved to mask-detector.model")
