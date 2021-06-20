import React from 'react';
import { NextPrevInfo } from 'types';

type EpisodeInfoProps = {
	title: string;
	episodeNum: number;
	html: string;
	syndicationLinks: Array<string>;
	date: string;
	next: NextPrevInfo;
	prev: NextPrevInfo;
};

const EpisodeInfo: React.FC<EpisodeInfoProps> = ({
	title,
	episodeNum,
	html,
	syndicationLinks,
	date,
	next,
	prev,
}) => {
	return (
		<section>
			<h1>
				{episodeNum !== -1 && `Episode ${episodeNum}: `}
				{title}
			</h1>
			{date}
			<div dangerouslySetInnerHTML={{ __html: html }} />
			{syndicationLinks.length > 0 && (
				<React.Fragment>
					<h3>Episode available at:</h3>
					<ul>
						{syndicationLinks.map((link) => (
							<li key={link}>{link}</li>
						))}
					</ul>
				</React.Fragment>
			)}
			<div className="grid grid-cols-2 grid-rows-1">
				{prev && <div>{prev}</div>}
				{next && <div>{next}</div>}
			</div>
		</section>
	);
};

export default EpisodeInfo;
