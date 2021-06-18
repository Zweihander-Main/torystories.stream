import React from 'react';

import Layout from 'components/structure/Layout';
import SEO from 'components/structure/SEO';
import Hero from 'components/index/Hero';
import EpisodeList from 'components/index/EpisodeList';
import About from 'components/index/About';

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
