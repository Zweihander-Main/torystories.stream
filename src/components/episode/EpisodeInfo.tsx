import { Link } from 'gatsby';
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
			<h1 className="font-display tracking-display text-5xl mb-4 text-shadow-md">
				{title}
			</h1>
			<h2 className="font-body  text-2xl mb text-shadow">
				{episodeNum !== -1 && `Episode ${episodeNum}`}
			</h2>
			<h3 className={'font-display text-lg mb-4 text-shadow'}>{date}</h3>
			<div
				className={'font-body text-lg mb-4 text-shadow'}
				dangerouslySetInnerHTML={{ __html: html }}
			/>
			{syndicationLinks.length > 0 && (
				<React.Fragment>
					<h3 className="font-display tracking-display text-2xl text-shadow">
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
			<div className="grid grid-cols-2 grid-rows-1 mt-4 mb-4">
				{prev && (
					<div className="col-start-1 col-end-2">
						<h3
							className={
								'font-display tracking-display text-2xl text-shadow'
							}
						>
							Previous Episode:
						</h3>
						<Link to={prev.slug}>{prev.title}</Link>
					</div>
				)}
				{next && (
					<div className="col-start-2 col-end-3 text-right">
						<h3
							className={
								'font-display tracking-display text-2xl text-shadow'
							}
						>
							Next Episode:
						</h3>
						<Link to={next.slug}>{next.title}</Link>
					</div>
				)}
			</div>
			<p className="mt-8 text-center">
				© {new Date().getFullYear()} Martin Hutchinson
			</p>
		</section>
	);
};

export default EpisodeInfo;
