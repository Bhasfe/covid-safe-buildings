
class Helpers:
    """Contains common purpose utility functions"""

    @classmethod
    def prune_dictionary(cls, data: dict) -> dict:
        """Eliminates None values of the dictionary recursively"""

        for key, value in list(data.items()):
            if isinstance(value, dict):
                cls.prune_dictionary(value)
            elif value is None:
                del data[key]
            elif isinstance(value, list):
                for v_i in value:
                    if isinstance(v_i, dict):
                        cls.prune_dictionary(v_i)

        return data
