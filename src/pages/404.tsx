import React from 'react';

import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';

const NotFound: React.FC = () => {
	return (
		<Layout>
			<SEO title="404: Not Found" />
			Page Not Found
		</Layout>
	);
};

export default NotFound;
