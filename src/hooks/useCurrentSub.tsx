import { useContext, useEffect, useState } from 'react';
import { SubtitlesArray } from 'types';
import PlayerProgressContext from '../contexts/PlayerProgressContext';

// Usage note: do not spread on to JSX Element

type UseCurrentSubInputProps = SubtitlesArray;

type CurrentSubProps = number;

const useCurrentSub = (
	subtitlesArray: UseCurrentSubInputProps
): CurrentSubProps => {
	const { playedSeconds } = useContext(PlayerProgressContext);
	const [currentSubIndex, setCurrentSubIndex] = useState(-1);

	const isBetween = (start: number, end: number, toCheck: number) => {
		return start <= toCheck && toCheck <= end;
	};

	useEffect(() => {
		const subtitleObject = subtitlesArray[currentSubIndex];
		if (
			currentSubIndex === -1 ||
			(subtitleObject &&
				!isBetween(
					subtitleObject.startTime,
					subtitleObject.endTime,
					playedSeconds
				))
		) {
			const foundIndex = subtitlesArray.findIndex((sub) =>
				isBetween(sub.startTime, sub.endTime, playedSeconds)
			);
			if (foundIndex !== -1) {
				setCurrentSubIndex(foundIndex);
			}
		}
	}, [playedSeconds, currentSubIndex, subtitlesArray]);

	return currentSubIndex;
};

export default useCurrentSub;
