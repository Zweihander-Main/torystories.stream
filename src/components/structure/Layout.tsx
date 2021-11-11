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
		<>
			{!showHomeButton && (
				<noscript className="static top-0 w-full text-center text-white bg-deepPurple">
					This site will work without JavaScript but interactive
					elements like the podcast player will not.{' '}
					<a href="https://github.com/Zweihander-Main/torystories.stream">
						Source code available.
					</a>
				</noscript>
			)}
			<div className="flex-col items-center mb-20 text-white bg-black rflex layout font-body">
				{showHomeButton && (
					<nav
						role="navigation"
						aria-label="Home"
						className={'absolute left-0 top-2 xl:top-4 z-50'}
					>
						<Link
							to={'/'}
							className={
								'cursor-pointer relative px-2 pt-3 pb-2 lg:-top-1 xl:p-4 no-underline lg:shadow-navButton bg-black bg-opacity-40 rounded-1xl'
							}
						>
							<RiHome2Line className="inline text-xl lg:text-2xl xl:text-3xl " />
							<span
								className={
									'hidden lg:inline font-display tracking-display pl-2 relative top-1 text-xl xl:text-2xl text-shadow-md'
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
		</>
	);
};

export default Layout;
