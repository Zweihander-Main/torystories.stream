import React from 'react';

const Footer: React.FC = () => {
	return (
		<footer className="m-20 text-center">
			<p>Check out:</p>
			<p className="mb-4">
				<a className="font-bold" href="https://www.tbwns.com">
					Martin&apos;s blog
				</a>
				{' | '}
				<a className="font-bold" href="https://www.lordliverpool.com">
					His biography of Lord Liverpool
				</a>
			</p>
			<p>© {new Date().getFullYear()} Martin Hutchinson</p>
		</footer>
	);
};

export default Footer;
