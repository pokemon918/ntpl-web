function scrollToSelectedNode(listNode, selectedNode) {
	// wait for the next cycle in the event queue
	setTimeout(() => {
		if (selectedNode.current && listNode.current) {
			listNode.current.scrollTop =
				selectedNode.current.offsetTop -
				listNode.current.offsetTop -
				listNode.current.offsetHeight / 2;
		}
	}, 0);
}

export default scrollToSelectedNode;
