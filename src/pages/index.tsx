import React from 'react';

import Layout from 'components/structure/layout';
import SEO from 'components/structure/seo';
import Hero from 'components/index/hero';
import EpisodeList from 'components/index/episodelist';
import About from 'components/index/about';

const IndexPage: React.FC = () => {
	return (
		<Layout>
			<SEO title="Home" />
			<Hero />
			<EpisodeList />
			<About />
		</Layout>
	);
};

export default IndexPage;
