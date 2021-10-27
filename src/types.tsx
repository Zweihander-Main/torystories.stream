export type NextPrevInfo = {
	slug: string;
	title: string;
} | null;

export type SubtitlesArray = Array<{
	text: string;
	startTime: number;
	endTime: number;
}>;

// pageContext of pages created in gatsby-node
export interface TemplatePageContext {
	id: string;
	prev: NextPrevInfo;
	next: NextPrevInfo;
	subtitlesArray: SubtitlesArray;
}
