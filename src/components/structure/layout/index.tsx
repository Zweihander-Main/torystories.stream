import React from 'react';
import Footer from 'components/structure/footer';
import Player from 'components/structure/player';

type LayoutProps = {};

const Layout: React.FC<
	LayoutProps & React.PropsWithChildren<Record<string, unknown>>
> = ({ children }) => {
	return (
		<div className="flex flex-col items-center bg-black text-white font-body pb-20">
			<main>
				<Player url={'torystories-episode1.mp3'} />
				{children}
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
