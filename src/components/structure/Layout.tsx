import React from 'react';
import Footer from 'components/structure/Footer';

type LayoutProps = {
	hideFooter?: boolean;
};

const Layout: React.FC<
	LayoutProps & React.PropsWithChildren<Record<string, unknown>>
> = ({ children, hideFooter = false }) => {
	return (
		<div className="flex flex-col items-center bg-black text-white font-body pb-20">
			<main>{children}</main>
			{!hideFooter && <Footer />}
		</div>
	);
};

export default Layout;
