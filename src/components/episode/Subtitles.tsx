import React, { useContext, useState } from 'react';
import PlayerContext from 'contexts/PlayerContext';
import { SubtitlesArray } from '../../types';
import { useEffect } from 'react';

type SubtitlesProps = {
	subtitlesArray: SubtitlesArray;
};

const Subtitles: React.FC<SubtitlesProps> = ({ subtitlesArray }) => {
	const { playedSeconds } = useContext(PlayerContext);
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
	}, [playedSeconds]);

	return (
		<section>
			<p>
				{subtitlesArray.map((sub, index) => {
					const { text, startTime } = sub;
					const className =
						currentSubIndex === index ? 'font-bold' : '';
					return (
						<span key={startTime} className={className}>
							{text}{' '}
						</span>
					);
				})}
			</p>
		</section>
	);
};

export default Subtitles;
