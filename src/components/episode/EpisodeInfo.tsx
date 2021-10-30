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
		<section
			className="p-20 bg-georgian-pattern bg-darkPurple z-10 scrollbar scrollbar-track-dullBlue scrollbar-thumb-brightBlue"
			aria-label={'Episode Info'}
		>
			<h1 className="font-display tracking-display text-5xl mb-4">
				{title}
			</h1>
			<h2 className="font-body  text-2xl mb">
				{episodeNum !== -1 && `Episode ${episodeNum}`}
			</h2>
			<h3 className={'font-display text-lg mb-4'}>{date}</h3>
			<div
				className={'font-body text-lg mb-4'}
				dangerouslySetInnerHTML={{ __html: html }}
			/>
			{syndicationLinks.length > 0 && (
				<React.Fragment>
					<h3 className="font-display tracking-display text-2xl">
						Episode available at:
					</h3>
					<ul>
						{syndicationLinks.map((link) => (
							<li key={link}>
								<a href={link}>{link}</a>
							</li>
						))}
					</ul>
				</React.Fragment>
			)}
			<div className="grid grid-cols-2 grid-rows-1">
				{prev && <div>{prev}</div>}
				{next && <div>{next}</div>}
			</div>
			<p className="mt-8">
				© {new Date().getFullYear()} Martin Hutchinson
			</p>
		</section>
	);
};

// TODO prev next styling

export default EpisodeInfo;
