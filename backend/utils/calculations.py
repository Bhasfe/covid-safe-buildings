class Calculations:
    """Contains utility calculation functions"""

    @classmethod
    def calculate_capacity(cls, area: float) -> int:
        """Calculate appropriate number of people in the given area"""
        # Reference https://www.safeworkaustralia.gov.au/sites/default/files/2020-04/COVID-19-Physical-Distancing-Checklist.pdf

        return int(area / 4)

    @classmethod
    def calculate_safety_level(cls,
                               capacity: int,
                               occupancy: int,
                               num_of_people_masked_with_pcr_positive: int,
                               num_of_people_non_masked_with_pcr_positive: int,
                               num_of_people_non_masked_with_pcr_negative: int,
                               num_of_people_vaccinated: int,
                               num_of_people_non_vaccinated: int,
                               ) -> float:
        """Calculates safety level"""

        safety_level = 100 - ((occupancy / capacity) * 20) - (
                (5 * num_of_people_non_vaccinated) - num_of_people_vaccinated) - 2 * (
                               (15 * (num_of_people_masked_with_pcr_positive / capacity)) - (
                               20 * (num_of_people_non_masked_with_pcr_positive / capacity)) - (
                                       10 * (num_of_people_non_masked_with_pcr_negative / capacity))) / capacity

        return safety_level
