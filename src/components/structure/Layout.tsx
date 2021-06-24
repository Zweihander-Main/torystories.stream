import React from 'react';
import Footer from 'components/structure/Footer';
import { RiHome2Line } from 'react-icons/ri';
import { Link } from 'gatsby';

type LayoutProps = {
	showHomeButton?: boolean;
	hideFooter?: boolean;
};

const Layout: React.FC<
	LayoutProps & React.PropsWithChildren<Record<string, unknown>>
> = ({ children, showHomeButton = false, hideFooter = false }) => {
	return (
		<div className="layout flex flex-col items-center bg-black text-white font-body mb-20">
			{showHomeButton && (
				<nav className={'absolute left-0 top-4 z-50'}>
					<Link
						to={'/'}
						className={'cursor-pointer p-4 no-underline'}
					>
						<RiHome2Line className={'inline'} size="2rem" />
						<span
							className={
								'font-display tracking-display pl-2 relative top-1 text-2xl text-shadow-md'
							}
						>
							Home
						</span>
					</Link>
				</nav>
			)}
			<main>{children}</main>
			{!hideFooter && <Footer />}
		</div>
	);
};

export default Layout;
