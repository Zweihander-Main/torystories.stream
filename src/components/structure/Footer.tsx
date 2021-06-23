import React from 'react';

const Footer: React.FC = () => {
	return (
		<footer className="m-20">
			© {new Date().getFullYear()} Martin Hutchinson
		</footer>
	);
};

export default Footer;
