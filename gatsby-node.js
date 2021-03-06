/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

const path = require('path');
const fs = require('fs');
const { createFilePath } = require('gatsby-source-filesystem');
const webvtt = require('node-webvtt');
const mm = require('music-metadata');

const hasPage = (edge) => {
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
};

const constructPrevNextObject = (post) => {
	return {
		title: post.node.frontmatter.title,
		slug: post.node.fields.slug,
	};
};

const findPrev = (posts, startIndex, sourceInstanceName) => {
	let i = startIndex - 1;
	while (i >= 0) {
		const post = posts[i];
		if (
			post.node.fields.sourceInstanceName === sourceInstanceName &&
			hasPage(post)
		) {
			return constructPrevNextObject(post);
		}
		i--;
	}
	return null;
};

const findNext = (posts, startIndex, sourceInstanceName) => {
	let i = startIndex + 1;
	while (i < posts.length) {
		const post = posts[i];
		if (
			post.node.fields.sourceInstanceName === sourceInstanceName &&
			hasPage(post)
		) {
			return constructPrevNextObject(post);
		}
		i++;
	}
	return null;
};

const parseSubtitles = (subsFile) => {
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
		console.error('Error parsing subtitles: ', error);
		return [];
	}
};

const parseAudioFile = async (audioFile) => {
	try {
		const metadata = await mm.parseFile(audioFile, {
			duration: true,
			skipCovers: true,
		});
		const durationSeconds = metadata?.format?.duration;
		if (durationSeconds) {
			const durationString = new Date(1000 * parseFloat(durationSeconds))
				.toISOString()
				.substr(11, 8); // Will break at 25 hours
			return { durationSeconds, durationString };
		}
	} catch (error) {
		console.error(error.message);
	}
	return { durationSeconds: 0, durationString: '00:00:00' };
};

exports.createPages = ({ actions, graphql }) => {
	const { createPage } = actions;
	return graphql(`
		{
			allMarkdownRemark(
				sort: { order: ASC, fields: [frontmatter___date] }
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
	`).then((result) => {
		if (result.errors) {
			result.errors.forEach((e) => console.error(e.toString()));
			return Promise.reject(result.errors);
		}
		const posts = result.data.allMarkdownRemark.edges;
		posts.forEach((edge, index, array) => {
			if (hasPage(edge)) {
				const id = edge.node.id;
				const sourceInstanceName = edge.node.fields.sourceInstanceName;
				const context = {
					id,
					next: findNext(array, index, sourceInstanceName),
					prev: findPrev(array, index, sourceInstanceName),
				};
				if (sourceInstanceName === 'episodes') {
					context.subtitlesArray = parseSubtitles(
						edge.node.frontmatter.subtitles.absolutePath
					);
				}
				createPage({
					path: edge.node.fields.slug,
					component: path.resolve(
						`src/templates/${String(sourceInstanceName)}.tsx`
					),
					// additional data can be passed via context
					context,
				});
			}
		});
	});
};
exports.onCreateNode = ({ node, actions, getNode }) => {
	const { createNodeField } = actions;
	if (node.internal.type === `MarkdownRemark`) {
		const { sourceInstanceName } = getNode(node.parent);
		const relativePath = createFilePath({
			node,
			getNode,
			trailingSlash: false,
		});
		createNodeField({
			name: `slug`,
			node,
			value: `/${sourceInstanceName}${relativePath}`,
		});
		createNodeField({
			name: `sourceInstanceName`,
			node,
			value: sourceInstanceName,
		});
	} else if (
		node.internal.type === 'File' &&
		node?.sourceInstanceName === 'episodes' &&
		node.internal?.mediaType.includes('audio')
	) {
		parseAudioFile(node.absolutePath).then((audioData) => {
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
		});
	}
};
