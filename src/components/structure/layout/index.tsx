import React from 'react';
import Footer from 'components/structure/footer';
import Player from 'components/structure/player';

type LayoutProps = {};

const Layout: React.FC<
	LayoutProps & React.PropsWithChildren<Record<string, unknown>>
> = ({ children }) => {
	return (
		<div className="flex flex-col items-center bg-black text-white font-body">
			<main>
				<Player />
				{children}
			</main>
			<Footer />
		</div>
	);
};

export default Layout;
