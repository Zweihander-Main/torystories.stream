import React, { memo } from 'react';
import { SubtitlesArray } from 'types';
import useCurrentSub from 'hooks/useCurrentSub';

interface SubtitlesProps {
	subtitlesArray: SubtitlesArray;
}

interface SubtitleTextProps extends SubtitlesProps {
	currentSubIndex: number;
}

const SubtitleText: React.FC<SubtitleTextProps> = ({
	subtitlesArray,
	currentSubIndex,
}) => {
	return (
		<p>
			{subtitlesArray.map((sub, index) => {
				const { text, startTime } = sub;
				const className = currentSubIndex === index ? 'font-bold' : '';
				return (
					<span key={startTime} className={className}>
						{text}{' '}
					</span>
				);
			})}
		</p>
	);
};

const MemoizedSubtitleText: React.FC<SubtitleTextProps> = memo(
	SubtitleText,
	(prevProps, nextProps) =>
		prevProps.currentSubIndex === nextProps.currentSubIndex &&
		prevProps.subtitlesArray === nextProps.subtitlesArray
);

const Subtitles: React.FC<SubtitlesProps> = ({ subtitlesArray }) => {
	const currentSubIndex = useCurrentSub(subtitlesArray);
	return (
		<section>
			<MemoizedSubtitleText
				subtitlesArray={subtitlesArray}
				currentSubIndex={currentSubIndex}
			/>
		</section>
	);
};

export default Subtitles;
