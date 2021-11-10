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
		<div className="flex flex-col items-center mb-20 text-white bg-black layout font-body">
			{showHomeButton && (
				<nav
					role="navigation"
					aria-label="Home"
					className={'absolute left-0 top-4 z-50'}
				>
					<Link
						to={'/'}
						className={
							'cursor-pointer p-4 no-underline shadow-navButton bg-black bg-opacity-40 rounded-1xl'
						}
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
