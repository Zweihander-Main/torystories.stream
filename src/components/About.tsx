import { graphql, useStaticQuery } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import * as React from 'react';

const About: React.FC = () => {
	const aboutData = useStaticQuery<Queries.AboutQuery>(graphql`
		query About {
			allMarkdownRemark(
				sort: { frontmatter: { date: DESC } }
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
	`);

	const node = aboutData.allMarkdownRemark.edges[0].node;
	let html = node.html || '';
	html = html.replace(/<p>/gi, '<p class="mt-8">');
	const title = node.frontmatter?.title || '';

	return (
		<section className="text-center bg-fixed bg-darkPurple bg-georgian-pattern">
			<div className="w-10/12 pt-24 pb-24 mx-auto sm:w-8/12 md:w-7/12 xl:w-6/12">
				<StaticImage
					src="../images/martin-hutchinson-colorized.png"
					layout="constrained"
					className="w-40 mx-auto border-8 rounded-full shadow-2xl md:w-auto border-dullPurple"
					height={225}
					width={225}
					alt={title}
				/>
				<h2 className="mt-4 text-2xl md:text-3xl font-display tracking-display text-shadow-sm">
					{title}
				</h2>
				<div
					className="text-xl md:text-2xl font-body text-shadow"
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</div>
		</section>
	);
};

export default About;
