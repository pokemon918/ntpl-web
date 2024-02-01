import React from 'react';
import {Link} from 'react-router-dom';
import Button from 'components/shared/ui/Button';
import {routeConstants} from 'const';

const Footer = ({step, onBackClick, onAddWine, disabled, type, onClose}) => (
	<div className="Footer__Wrapper">
		{step === 'step1' ? (
			<div className="Footer__Step1">
				Can't find the producer?{'   '}
				<Link to={routeConstants.TASTING}>Add a wine manually</Link>
			</div>
		) : (
			<div className="Footer__Step2">
				<div className="Footer__Step2__Button1">
					<Button variant="outlined" onHandleClick={type === 'edit' ? onClose : onBackClick}>
						Back
					</Button>
				</div>
				<div className="Footer__Step2__Button1">
					<Button disabled={disabled} onHandleClick={onAddWine}>
						{type === 'edit' ? 'Update Wine' : 'Add Wine'}
					</Button>
				</div>
			</div>
		)}
	</div>
);

export default Footer;
