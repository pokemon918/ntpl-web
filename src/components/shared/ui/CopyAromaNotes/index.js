import React from 'react';
import PropTypes from 'prop-types';

import Button from '../Button';

import './CopyAromaNotes.scss';

const CopyAromaNotes = ({onClickSkip, onClickCopy}) => (
	<React.Fragment>
		<div className="CopyAromaNotes__Overlay" />
		<div className="CopyAromaNotes__Wrapper">
			<div className="Copyaromanotes__Container__Header">
				<div
					className="CopyAromaNotes__Container__CloseButton"
					data-testid="close-overlay"
					onClick={onClickSkip}
				>
					&times;
				</div>
				<div className="CopyAromaNotes__Container__Title">Oak</div>
			</div>
			<div className="CopyAromaNotes__Container__Content">
				<div className="CopyAromaNotes__Button">
					<Button onHandleClick={onClickCopy}>Copy all Aroma Notes.</Button>
				</div>
				<div className="CopyAromaNotes__Button">
					<Button variant="transparent" onHandleClick={onClickSkip}>
						Do not copy aroma notes.
					</Button>
				</div>
			</div>
		</div>
	</React.Fragment>
);

CopyAromaNotes.propTypes = {
	onClickCopy: PropTypes.func.isRequired,
	onClickSkip: PropTypes.func.isRequired,
};

export default CopyAromaNotes;
