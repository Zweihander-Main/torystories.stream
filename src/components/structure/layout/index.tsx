import React from 'react';
import Footer from 'components/structure/footer';

type LayoutProps = {};

const Layout: React.FC<
	LayoutProps & React.PropsWithChildren<Record<string, unknown>>
> = ({ children }) => {
	return (
		<div className="flex flex-col items-center bg-black text-white font-body pb-20">
			<main>{children}</main>
			<Footer />
		</div>
	);
};

export default Layout;
