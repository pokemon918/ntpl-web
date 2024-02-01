import {useEffect} from 'react';

/**
 * Use this hook to detect when the user clicks outside of an element.
 *
 * Usage example:
 *   const wrapperNode = useRef();
 *   const clickedOutside = function() { console.log('clicked outside') }
 *   useClickOutside(wrapperNode, clickedOutside);
 *
 *   return (
 *     <div ref={wrapperNode}>
 *       The function `clickOutside` will be called when clicking outside of `wrapperNode`
 *     </div>
 *   )
 */
const useClickOutside = (node, onClickOutside) => {
	const handleClick = (event) => {
		if (node.current.contains(event.target)) {
			return;
		}
		onClickOutside();
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClick);

		return function destroy() {
			document.removeEventListener('mousedown', handleClick);
		};
	});
};

export default useClickOutside;
