import React, { useEffect, useState } from 'react';

import IconMask from '../../images/icons/Mask.svg';
import IconNoMask from '../../images/icons/NoMask.svg';
import IconVaccinated from '../../images/icons/Vaccinated.svg';
import IconNonVaccinated from '../../images/icons/NonVaccinated.svg';
import IconPCRNegative from '../../images/icons/PCRNegative.svg';
import IconPCRPositive from '../../images/icons/PCRPositive.svg';
import roomService from '../../services/room.service';

function PeopleStatus({ room, polling = false}) {

    const [currentRoom, setCurrentRoom] = useState(room);

    const [hasMaskCount, setHasMask] = useState(0);
    const [noMaskCount, setNoMask] = useState(0);
    const [vaccinatedCount, setVaccinated] = useState(0);
    const [nonVaccinatedCount, setNonVaccinated] = useState(0);
    const [pcrPositiveCount, setPCRPositive] = useState(0);
    const [pcrNegativeCount, setPCRNegative] = useState(0);


    useEffect(() => {

        
        setHasMask(currentRoom.num_of_people_masked_with_pcr_positive + currentRoom.num_of_people_masked_with_pcr_negative);
        setNoMask(currentRoom.num_of_people_non_masked_with_pcr_positive + currentRoom.num_of_people_non_masked_with_pcr_negative);
        setVaccinated(currentRoom.num_of_people_vaccinated);
        setNonVaccinated(currentRoom.num_of_people_non_vaccinated);
        setPCRPositive(currentRoom.num_of_people_masked_with_pcr_positive + currentRoom.num_of_people_non_masked_with_pcr_positive);
        setPCRNegative(currentRoom.num_of_people_masked_with_pcr_negative + currentRoom.num_of_people_non_masked_with_pcr_negative);

    }, [currentRoom, room]);

    useEffect(() => {
        if (polling) {
            const interval = setInterval(() => {
                fetchRoomData();
            }, 5000);

            return () => {
                clearInterval(interval);
            };
        }
    }, []);

    /**
     * Fetch live room data from the API
     */
    function fetchRoomData() {
        roomService.get(room.building_id, room.id).then((res) => {
            setCurrentRoom(res.data);
        });
    }

    return (
        <div className="grid grid-cols-3">
        <div className="flex flex-col items-center mb-4" title={hasMaskCount ? (hasMaskCount + ` ${hasMaskCount > 1 ? 'people have' : 'person has'} mask`): 'No one has mask'}>
            <p className='text-gray-800 text-xs font-medium'>Has Mask</p>
            <img src={IconMask} width="24" />
            <p className="text-lg font-medium text-blue-400 mt-2">{hasMaskCount || '-'}</p>
        </div>
        <div className="flex flex-col items-center mb-4" title={vaccinatedCount ? (vaccinatedCount + ` ${vaccinatedCount > 1 ? 'people are' : 'person is'} vaccinated`): 'No one has vaccination'}>
            <p className='text-gray-800 text-xs font-medium'>Vaccinated</p>
            <img src={IconVaccinated} width="24" />
            <p className="text-lg font-medium text-blue-400 mt-2">{vaccinatedCount || '-'}</p>
        </div>
        <div className="flex flex-col items-center mb-4" title={pcrNegativeCount ? (pcrNegativeCount + ` ${pcrNegativeCount > 1 ? 'people have' : 'person has'} negative PCR Result`): 'No one has PCR test'}>
            <p className='text-gray-800 text-xs font-medium'>PCR Negative</p>
            <img src={IconPCRNegative} width="24" />
            <p className="text-lg font-medium text-blue-400 mt-2">{pcrNegativeCount || '-'}</p>
        </div>
        <div className="flex flex-col items-center mb-4" title={noMaskCount ? (noMaskCount + ` ${noMaskCount > 1 ? 'people are not wearing masks' : 'person is not wearing mask'}`): 'Everyone is wearing mask'}>
            <p className='text-gray-800 text-xs font-medium'>No Mask</p>
            <img src={IconNoMask} width="24" />
            <p className={`text-lg font-medium  ${noMaskCount == 0 ? 'text-blue-400' : 'text-red-400'} mt-2`}>{noMaskCount || '-'}</p>
        </div>
        <div className="flex flex-col items-center mb-4" title={nonVaccinatedCount ? (nonVaccinatedCount + ` ${nonVaccinatedCount > 1 ? 'people are not vaccinated' : 'person is not vaccinated'}`): 'Everyone is vaccinated'}>
            <p className='text-gray-800 text-xs font-medium'>Non-Vaccinated</p>
            <img src={IconNonVaccinated} width="24" />
            <p className={`text-lg font-medium ${nonVaccinatedCount == 0 ? 'text-blue-400' : 'text-red-400'} mt-2`}>{nonVaccinatedCount || '-'}</p>
        </div>
        <div className="flex flex-col items-center mb-4" title={pcrPositiveCount ? (pcrPositiveCount + ` ${pcrPositiveCount > 1 ? 'people have' : 'person has'} positive PCR Result`): 'No one has PCR test'}>
            <p className='text-gray-800 text-xs font-medium'>PCR Positive</p>
            <img src={IconPCRPositive} width="24" />
            <p className={`text-lg font-medium ${pcrPositiveCount == 0 ? 'text-blue-400' : 'text-red-400'} mt-2`}>{pcrPositiveCount || '-'}</p>
        </div>
    </div>
    );
}

export default PeopleStatus;