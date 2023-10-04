import * as React from 'react';

import Layout from '../components/StructLayout';
import SEO from '../components/StructSEO';
import Hero from '../components/Hero';
import EpisodeList from '../components/EpisodeList';
import About from '../components/About';

const IndexPage: React.FC = () => {
	return (
		<Layout>
			<SEO />
			<Hero />
			<About />
			<EpisodeList />
		</Layout>
	);
};

export default IndexPage;
