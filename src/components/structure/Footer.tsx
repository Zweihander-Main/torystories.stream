import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';

type MenuItemProps = {
	display: string;
	url: string;
};

const MenuItem: React.FC<MenuItemProps> = ({ display, url }) => {
	return (
		<li>
			&mdash;&nbsp;&nbsp;
			<a className="font-bold" href={url}>
				{display}
			</a>
		</li>
	);
};

type MenuProps = {
	title: string;
	links: Array<{
		display: string;
		url: string;
	}>;
	menuIndex: number;
};

const Menu: React.FC<MenuProps> = ({ title, links, menuIndex }) => {
	return (
		<div
			className={`footer-indent-and-padding ml-8 mr-8 md:m-4 max-w-xs col-span-1 row-span-1 ${
				menuIndex === 0
					? 'col-start-1 row-start-1'
					: 'col-start-1 row-start-2 sm:row-start-1 sm:col-start-2'
			}`}
		>
			<p>{title}</p>
			<ul>
				{links.map((link) => (
					<MenuItem key={link.url} {...link} />
				))}
			</ul>
		</div>
	);
};

const Footer: React.FC = () => {
	const footerMenusData =
		useStaticQuery<GatsbyTypes.FooterMenusQuery>(graphql`
			query FooterMenus {
				allMarkdownRemark(
					filter: {
						fields: { sourceInstanceName: { eq: "footerMenus" } }
					}
					sort: { fields: frontmatter___menuNum }
				) {
					nodes {
						frontmatter {
							title
							links {
								display
								url
							}
						}
					}
				}
			}
		`);
	const footerMenus = footerMenusData.allMarkdownRemark.nodes;

	return (
		<footer className="grid items-center sm:items-start sm:justify-items-center mt-8 mb-24 grid-rows-3 grid-cols-1 sm:grid-rows-2 sm:grid-cols-2">
			{footerMenus.map((menu, menuIndex) => {
				const title = menu?.frontmatter?.title || '';
				const mdLinks = menu?.frontmatter?.links || [];
				const links = mdLinks.map((link) => ({
					display: link?.display || '',
					url: link?.url || '',
				}));
				return <Menu key={title} {...{ title, links, menuIndex }} />;
			})}
			<p className="text-center self-start mt-8 col-span-1 sm:col-span-2 col-start-1 row-span-1 row-start-3 sm:row-start-2">
				© {new Date().getFullYear()} Martin Hutchinson
			</p>
		</footer>
	);
};

export default Footer;
