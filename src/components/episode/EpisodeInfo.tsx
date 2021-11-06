import PlayerStateContext from 'contexts/PlayerStateContext';
import TrackContext from 'contexts/TrackContext';
import { Link } from 'gatsby';
import React, { memo, useContext } from 'react';
import { IconType } from 'react-icons';
import {
	RiPlayCircleLine,
	RiSoundcloudLine,
	RiYoutubeLine,
	RiSpotifyLine,
	RiMusic2Line,
} from 'react-icons/ri';
import { NextPrevInfo } from 'types';
import { DOMAIN_REGEX } from 'utils/constants';

type SyndicationLinkProp = {
	link: string;
};

const SyndicationLink: React.FC<SyndicationLinkProp> = ({ link }) => {
	const domainMatch = DOMAIN_REGEX.exec(link);
	let Icon: IconType = RiMusic2Line,
		title = link;
	if (domainMatch && domainMatch[1]) {
		const domain = domainMatch[1];
		switch (domain) {
			case 'soundcloud.com': {
				title = 'SoundCloud';
				Icon = RiSoundcloudLine;
				break;
			}
			case 'youtube.com': {
				title = 'YouTube';
				Icon = RiYoutubeLine;
				break;
			}
			case 'spotify.com': {
				title = 'Spotify';
				Icon = RiSpotifyLine;
				break;
			}
			default: {
				title = domain;
				Icon = RiMusic2Line;
				break;
			}
		}
	}

	return (
		<li key={link}>
			<Icon className="inline mr-2 ml-2" />
			<a href={link}>{title}</a>
		</li>
	);
};

const MemoizedSyndicationLink = memo(
	SyndicationLink,
	(prevProps, nextProps) => prevProps.link !== nextProps.link
);

type EpisodeInfoProps = {
	title: string;
	episodeNum: number;
	html: string;
	syndicationLinks: Array<string>;
	date: string;
	next: NextPrevInfo;
	prev: NextPrevInfo;
	id: string;
};

const EpisodeInfo: React.FC<EpisodeInfoProps> = ({
	title,
	episodeNum,
	html,
	syndicationLinks,
	date,
	next,
	prev,
	id,
}) => {
	const { setTrackId, trackId } = useContext(TrackContext);
	const { isPlayerPlaying, setIsPlayerPlaying } =
		useContext(PlayerStateContext);

	const handlePlayClick = (e: React.MouseEvent<SVGElement>, id: string) => {
		e.preventDefault();
		setTrackId(id);
		if (!isPlayerPlaying) {
			setIsPlayerPlaying(true);
		}
	};

	return (
		<section
			className="p-20 bg-georgian-pattern bg-darkPurple z-10 scrollbar scrollbar-track-dullBlue scrollbar-thumb-brightBlue"
			aria-label={'Episode Info'}
		>
			<h1 className="font-display tracking-display text-5xl mb-4 text-shadow-md">
				{title}
				{(!isPlayerPlaying || trackId !== id) && (
					<RiPlayCircleLine
						className="pl-3 pr-3 relative bottom-0.5 box-content inline text-4xl text-white opacity-70 hover:opacity-100 cursor-pointer"
						onClick={(e) => handlePlayClick(e, id)}
					/>
				)}
			</h1>
			<h2 className="font-display tracking-display mt-1 text-3xl leading-6 text-shadow">
				{episodeNum !== -1 && `Episode ${episodeNum}`}
			</h2>
			<h3 className={'font-body text-sm mb-4 text-shadow'}>{date}</h3>
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
							<MemoizedSyndicationLink key={link} link={link} />
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
