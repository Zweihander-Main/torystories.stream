import { graphql, useStaticQuery } from 'gatsby';
import React, { useState } from 'react';
import SessionStorage from 'utils/sessionStorage';

type PlayerContextProps = {
	storage: SessionStorage;
	playedSeconds: number;
	idPlaying: string;
	setIdPlaying: (id: string) => void;
	setPlayedSeconds: (s: number) => void;
	playing: boolean;
	setPlaying: (b: boolean) => void;
};

const PlayerContext = React.createContext<PlayerContextProps>({
	storage: SessionStorage.getInstance(),
	playedSeconds: 0,
	idPlaying: '',
	setIdPlaying: () => undefined,
	setPlayedSeconds: () => undefined,
	playing: false,
	setPlaying: () => undefined,
});

export default PlayerContext;

export const PlayerProvider: React.FC = ({ children }) => {
	const defaultID =
		useStaticQuery<GatsbyTypes.DefaultEpisodeIDQueryQuery>(graphql`
			query DefaultEpisodeIDQuery {
				allMarkdownRemark(
					limit: 1
					sort: { fields: frontmatter___date, order: DESC }
					filter: {
						fields: { sourceInstanceName: { eq: "episodes" } }
					}
				) {
					edges {
						node {
							id
						}
					}
				}
			}
		`);

	const storage = SessionStorage.getInstance();
	const [playedSeconds, setPlayedSeconds] = useState(0);
	const [playing, setPlaying] = useState(false);

	const [idPlaying, setIdPlaying] = useState(
		defaultID.allMarkdownRemark.edges[0].node.id
	);

	return (
		<PlayerContext.Provider
			value={{
				storage,
				playedSeconds,
				idPlaying,
				setIdPlaying,
				setPlayedSeconds,
				playing,
				setPlaying,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
};

export const { Consumer: PlayerConsumer } = PlayerContext;
