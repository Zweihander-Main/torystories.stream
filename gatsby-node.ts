import path from 'path';
import fs from 'fs';
import { createFilePath } from 'gatsby-source-filesystem';
import webvtt from 'node-webvtt';
import { GatsbyNode } from 'gatsby';
import mm from 'music-metadata'; // NOTE: ver 7 last which works without module changes

const hasPage = (
	edge: Queries.createPagesInNodeQuery['allMarkdownRemark']['edges'][number]
) => {
	if (edge.node?.fields?.sourceInstanceName) {
		switch (edge.node.fields.sourceInstanceName) {
			case 'misc': {
				return false;
				break;
			}
			case 'footerMenus': {
				return false;
				break;
			}
		}
		return true;
	}
	return false;
};

const constructPrevNextObject = (
	post: Queries.createPagesInNodeQuery['allMarkdownRemark']['edges'][number]
) => {
	if (post.node.frontmatter?.title && post.node.fields?.slug) {
		return {
			title: post.node.frontmatter.title,
			slug: post.node.fields.slug,
		};
	} else {
		return {};
	}
};

const findPrev = (
	posts: Queries.createPagesInNodeQuery['allMarkdownRemark']['edges'],
	startIndex: number,
	sourceInstanceName: string | null
) => {
	let i = startIndex - 1;
	while (i >= 0) {
		const post = posts[i];
		if (
			post.node.fields?.sourceInstanceName &&
			post.node.fields.sourceInstanceName === sourceInstanceName &&
			hasPage(post)
		) {
			return constructPrevNextObject(post);
		}
		i--;
	}
	return null;
};

const findNext = (
	posts: Queries.createPagesInNodeQuery['allMarkdownRemark']['edges'],
	startIndex: number,
	sourceInstanceName: string | null
) => {
	let i = startIndex + 1;
	while (i < posts.length) {
		const post = posts[i];
		if (
			post.node.fields?.sourceInstanceName &&
			post.node.fields.sourceInstanceName === sourceInstanceName &&
			hasPage(post)
		) {
			return constructPrevNextObject(post);
		}
		i++;
	}
	return null;
};

const parseSubtitles = (subsFile: fs.PathOrFileDescriptor) => {
	const input = fs.readFileSync(subsFile).toString();
	const parsed = webvtt.parse(input);
	if (parsed.valid) {
		const { cues } = parsed;
		return cues.map((cue) => ({
			text: cue.text.replace(/(<([^>]+)>)/gi, ''), // remove speaker tags
			startTime: cue.start,
			endTime: cue.end,
		}));
	} else {
		console.error('Error parsing subtitles:', parsed.errors);
		return [];
	}
};

const parseAudioFile = async (audioFile: string) => {
	try {
		const metadata = await mm.parseFile(audioFile, {
			duration: true,
			skipCovers: true,
		});
		const durationSeconds = metadata?.format?.duration;
		if (durationSeconds) {
			const durationFloat =
				typeof durationSeconds === 'string'
					? parseFloat(durationSeconds)
					: durationSeconds;
			const durationString = new Date(1000 * durationFloat)
				.toISOString()
				.substring(11, 19); // Will break at 25 hours
			return { durationSeconds, durationString };
		}
	} catch (error) {
		console.error('Error parsing audio file:', error);
	}
	return { durationSeconds: 0, durationString: '00:00:00' };
};

export const createPages: GatsbyNode['createPages'] = async ({
	actions,
	graphql,
}) => {
	const { createPage } = actions;
	const result = await graphql<Queries.createPagesInNodeQuery>(`
		query createPagesInNode {
			allMarkdownRemark(
				sort: { frontmatter: { date: ASC } }
				limit: 10000
			) {
				edges {
					node {
						id
						fields {
							slug
							sourceInstanceName
						}
						frontmatter {
							title
							subtitles {
								absolutePath
							}
							audioFile {
								absolutePath
							}
						}
						rawMarkdownBody
					}
				}
			}
		}
	`);
	if (result.errors) {
		if (Array.isArray(result.errors)) {
			result?.errors.forEach((e) =>
				console.error((e as string).toString())
			);
		}
		return Promise.reject(result.errors);
	}
	const posts = result?.data?.allMarkdownRemark.edges;
	if (posts && posts.length > 0) {
		posts.forEach((edge, index, array) => {
			const id = edge.node.id;
			if (hasPage(edge)) {
				const { sourceInstanceName } = edge.node.fields as {
					sourceInstanceName: string;
				};
				const context = {
					id,
					next: findNext(array, index, sourceInstanceName),
					prev: findPrev(array, index, sourceInstanceName),
				} as {
					id: string;
					next:
						| {
								title: string;
								slug: string;
						  }
						| {
								title?: undefined;
								slug?: undefined;
						  }
						| null;
					prev:
						| {
								title: string;
								slug: string;
						  }
						| {
								title?: undefined;
								slug?: undefined;
						  }
						| null;
					subtitlesArray?: Array<{
						text: string;
						startTime: number;
						endTime: number;
					}>;
				};
				if (sourceInstanceName === 'episodes') {
					const subsFile = edge?.node?.frontmatter?.subtitles
						?.absolutePath as string;
					context.subtitlesArray = parseSubtitles(subsFile);
				}
				createPage({
					path: edge?.node?.fields?.slug as string,
					component: path.resolve(
						`src/templates/${String(sourceInstanceName)}.tsx`
					),
					// additional data can be passed via context
					context,
				});
			}
		});
	}
};

export const onCreateNode: GatsbyNode['onCreateNode'] = async ({
	node,
	actions,
	getNode,
}) => {
	const { createNodeField } = actions;
	if (node.internal.type === 'MarkdownRemark') {
		const { sourceInstanceName } = getNode(node.parent as string) as Record<
			string,
			string
		>;
		const relativePath = createFilePath({
			node,
			getNode,
			trailingSlash: false,
		});
		createNodeField({
			name: 'slug',
			node,
			value: `/${sourceInstanceName}${relativePath}`,
		});
		createNodeField({
			name: 'sourceInstanceName',
			node,
			value: sourceInstanceName,
		});
	} else if (
		node.internal.type === 'File' &&
		node?.sourceInstanceName === 'episodes' &&
		node?.internal?.mediaType &&
		node?.internal?.mediaType.includes('audio')
	) {
		const audioData = await parseAudioFile(node.absolutePath as string);
		createNodeField({
			name: 'durationSeconds',
			node,
			value: audioData.durationSeconds,
		});
		createNodeField({
			name: 'durationString',
			node,
			value: audioData.durationString,
		});
	}
};
