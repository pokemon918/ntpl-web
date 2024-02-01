import React, {FC, PointerEvent, useEffect, useState} from 'react';

const getNoteId = (node?: Element | null) => node?.attributes.getNamedItem('data-note-id')?.value;

interface NoteTriggerState {
	[key: string]: boolean;
}

interface Props {
	onSelect: (noteId: string) => void;
}

const TouchSelect: FC<Props> = ({children, onSelect}) => {
	// controls whether a touch gesture is active
	const [isHovered, setHovered] = useState(false);
	const startHovering = () => setHovered(true);
	const stopHovering = () => setHovered(false);

	// controls which note has been triggered during this touch press to only allow it once
	const [isTriggered, setTriggered] = useState<NoteTriggerState>({});
	useEffect(() => {
		if (!isHovered) {
			setTriggered({});
		}
	}, [isHovered, setTriggered]);

	const handleTouchMove = (event: PointerEvent<HTMLDivElement>) => {
		if (isHovered) {
			// find out whether a note has been touched and trigger its select event
			const element = document.elementFromPoint(event.clientX, event.clientY);
			const noteId = getNoteId(element) || getNoteId(element?.parentElement);

			// invert note selection state only once on each touch press
			if (noteId && !isTriggered[noteId]) {
				onSelect(noteId);
				setTriggered({
					...isTriggered,
					[noteId]: true,
				});
			}
		}
	};

	return (
		<div onTouchStart={startHovering} onTouchEnd={stopHovering} onPointerMove={handleTouchMove}>
			{children}
		</div>
	);
};

export default TouchSelect;
