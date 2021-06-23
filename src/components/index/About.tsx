import { graphql, useStaticQuery } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import React from 'react';

const About: React.FC = () => {
	const aboutData = useStaticQuery<GatsbyTypes.AboutQuery>(
		graphql`
			query About {
				allMarkdownRemark(
					sort: { order: DESC, fields: frontmatter___date }
					filter: {
						fields: {
							slug: { eq: "/misc/about" }
							sourceInstanceName: { eq: "misc" }
						}
					}
				) {
					edges {
						node {
							frontmatter {
								title
							}
							html
						}
					}
				}
			}
		`
	);

	const node = aboutData.allMarkdownRemark.edges[0].node;
	let html = node.html || '';
	html = html.replace(/<p>/gi, '<p class="mt-8">');
	const title = node.frontmatter?.title || '';

	return (
		<section className="bg-darkPurple bg-georgian-pattern text-center ">
			<div className="w-6/12 mx-auto pt-24 pb-24">
				<StaticImage
					src="../../images/martin-hutchinson-colorized.png"
					layout="fixed"
					className="rounded-full mx-auto border-dullPurple border-8"
					height={225}
					width={225}
					alt={title}
				/>
				<h2 className="font-display tracking-display text-3xl mt-4">
					{title}
				</h2>
				<div
					className="font-body text-2xl"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</div>
		</section>
	);
};

export default About;
