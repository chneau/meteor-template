interface Link {
	_id?: string | null;
	title: string;
	url: string;
}

interface InfoProps {
	links: Link[];
}

export const Info = ({ links }: InfoProps) => (
	<div>
		<h2>Learn Meteor!</h2>
		<ul>
			{links.map((link) => (
				<li key={link._id}>
					<a href={link.url} target="_blank" rel="noreferrer">
						{link.title}
					</a>
				</li>
			))}
		</ul>
	</div>
);
