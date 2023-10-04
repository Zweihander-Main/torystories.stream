import * as React from 'react';

import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import { Link } from 'gatsby';

const NotFound: React.FC = () => {
	return (
		<Layout>
			<SEO title="404: Not Found" />
			<p className="mt-32">Sorry, not found!</p>
			<Link to="/">Go to home page</Link>
		</Layout>
	);
};

export default NotFound;
